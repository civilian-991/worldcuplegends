'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { User as SupabaseUser, AuthChangeEvent, Session } from '@supabase/supabase-js';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  phone?: string;
  role?: string;
  createdAt: string;
}

export interface Address {
  id: string;
  label: string;
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  isDefault: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<{ success: boolean; error?: string }>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  addresses: Address[];
  addAddress: (address: Omit<Address, 'id'>) => Promise<{ success: boolean; error?: string }>;
  updateAddress: (id: string, address: Partial<Address>) => Promise<{ success: boolean; error?: string }>;
  deleteAddress: (id: string) => Promise<{ success: boolean; error?: string }>;
  setDefaultAddress: (id: string) => Promise<{ success: boolean; error?: string }>;
  refreshUser: () => Promise<void>;
}

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const supabase = createClient();

  // Fetch user profile from database
  const fetchProfile = useCallback(async (supabaseUser: SupabaseUser) => {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', supabaseUser.id)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }

    return {
      id: profile.id,
      email: profile.email,
      firstName: profile.first_name || '',
      lastName: profile.last_name || '',
      avatar: profile.avatar_url || undefined,
      phone: profile.phone || undefined,
      role: profile.role || 'customer',
      createdAt: profile.created_at,
    };
  }, [supabase]);

  // Fetch addresses from database
  const fetchAddresses = useCallback(async (userId: string) => {
    const { data, error } = await supabase
      .from('addresses')
      .select('*')
      .eq('user_id', userId)
      .order('is_default', { ascending: false });

    if (error) {
      console.error('Error fetching addresses:', error);
      return [];
    }

    interface AddressRow {
      id: string
      label: string
      first_name: string
      last_name: string
      street: string
      city: string
      state: string
      zip_code: string
      country: string
      phone: string | null
      is_default: boolean
    }
    return (data as AddressRow[]).map((addr) => ({
      id: addr.id,
      label: addr.label,
      firstName: addr.first_name,
      lastName: addr.last_name,
      street: addr.street,
      city: addr.city,
      state: addr.state,
      zipCode: addr.zip_code,
      country: addr.country,
      phone: addr.phone || '',
      isDefault: addr.is_default,
    }));
  }, [supabase]);

  // Refresh user data
  const refreshUser = useCallback(async () => {
    const { data: { user: supabaseUser } } = await supabase.auth.getUser();

    if (supabaseUser) {
      const profile = await fetchProfile(supabaseUser);
      if (profile) {
        setUser(profile);
        const addrs = await fetchAddresses(supabaseUser.id);
        setAddresses(addrs);
      }
    } else {
      setUser(null);
      setAddresses([]);
    }
  }, [supabase, fetchProfile, fetchAddresses]);

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);

      const { data: { user: supabaseUser } } = await supabase.auth.getUser();

      if (supabaseUser) {
        const profile = await fetchProfile(supabaseUser);
        if (profile) {
          setUser(profile);
          const addrs = await fetchAddresses(supabaseUser.id);
          setAddresses(addrs);
        }
      }

      setIsLoading(false);
    };

    initAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, session: Session | null) => {
        if (event === 'SIGNED_IN' && session?.user) {
          const profile = await fetchProfile(session.user);
          if (profile) {
            setUser(profile);
            const addrs = await fetchAddresses(session.user.id);
            setAddresses(addrs);
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setAddresses([]);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, fetchProfile, fetchAddresses]);

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  };

  const register = async (data: RegisterData) => {
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          first_name: data.firstName,
          last_name: data.lastName,
        },
      },
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setAddresses([]);
  };

  const updateProfile = async (data: Partial<User>) => {
    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    const updateData: Record<string, unknown> = {};
    if (data.firstName !== undefined) updateData.first_name = data.firstName;
    if (data.lastName !== undefined) updateData.last_name = data.lastName;
    if (data.phone !== undefined) updateData.phone = data.phone;
    if (data.avatar !== undefined) updateData.avatar_url = data.avatar;

    const { error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', user.id);

    if (error) {
      return { success: false, error: error.message };
    }

    setUser((prev) => (prev ? { ...prev, ...data } : null));
    return { success: true };
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  };

  const addAddress = async (address: Omit<Address, 'id'>) => {
    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    // If setting as default, update other addresses first
    if (address.isDefault) {
      await supabase
        .from('addresses')
        .update({ is_default: false })
        .eq('user_id', user.id);
    }

    const { data, error } = await supabase
      .from('addresses')
      .insert({
        user_id: user.id,
        label: address.label,
        first_name: address.firstName,
        last_name: address.lastName,
        street: address.street,
        city: address.city,
        state: address.state,
        zip_code: address.zipCode,
        country: address.country,
        phone: address.phone,
        is_default: address.isDefault || addresses.length === 0,
      })
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    const newAddress: Address = {
      id: data.id,
      label: data.label,
      firstName: data.first_name,
      lastName: data.last_name,
      street: data.street,
      city: data.city,
      state: data.state,
      zipCode: data.zip_code,
      country: data.country,
      phone: data.phone || '',
      isDefault: data.is_default,
    };

    if (newAddress.isDefault) {
      setAddresses((prev) => [
        newAddress,
        ...prev.map((a) => ({ ...a, isDefault: false })),
      ]);
    } else {
      setAddresses((prev) => [...prev, newAddress]);
    }

    return { success: true };
  };

  const updateAddress = async (id: string, data: Partial<Address>) => {
    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    const updateData: Record<string, unknown> = {};
    if (data.label !== undefined) updateData.label = data.label;
    if (data.firstName !== undefined) updateData.first_name = data.firstName;
    if (data.lastName !== undefined) updateData.last_name = data.lastName;
    if (data.street !== undefined) updateData.street = data.street;
    if (data.city !== undefined) updateData.city = data.city;
    if (data.state !== undefined) updateData.state = data.state;
    if (data.zipCode !== undefined) updateData.zip_code = data.zipCode;
    if (data.country !== undefined) updateData.country = data.country;
    if (data.phone !== undefined) updateData.phone = data.phone;
    if (data.isDefault !== undefined) updateData.is_default = data.isDefault;

    const { error } = await supabase
      .from('addresses')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      return { success: false, error: error.message };
    }

    setAddresses((prev) =>
      prev.map((addr) => (addr.id === id ? { ...addr, ...data } : addr))
    );

    return { success: true };
  };

  const deleteAddress = async (id: string) => {
    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    const addressToDelete = addresses.find((a) => a.id === id);

    const { error } = await supabase
      .from('addresses')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      return { success: false, error: error.message };
    }

    setAddresses((prev) => {
      const filtered = prev.filter((addr) => addr.id !== id);
      // If we deleted the default, make the first one default
      if (filtered.length > 0 && addressToDelete?.isDefault) {
        // Update in database
        supabase
          .from('addresses')
          .update({ is_default: true })
          .eq('id', filtered[0].id);
        filtered[0].isDefault = true;
      }
      return filtered;
    });

    return { success: true };
  };

  const setDefaultAddress = async (id: string) => {
    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    // First, set all addresses to non-default
    await supabase
      .from('addresses')
      .update({ is_default: false })
      .eq('user_id', user.id);

    // Then set the selected one as default
    const { error } = await supabase
      .from('addresses')
      .update({ is_default: true })
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      return { success: false, error: error.message };
    }

    setAddresses((prev) =>
      prev.map((addr) => ({
        ...addr,
        isDefault: addr.id === id,
      }))
    );

    return { success: true };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        login,
        register,
        logout,
        updateProfile,
        resetPassword,
        addresses,
        addAddress,
        updateAddress,
        deleteAddress,
        setDefaultAddress,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
