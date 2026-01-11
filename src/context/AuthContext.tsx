'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  phone?: string;
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
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
  addresses: Address[];
  addAddress: (address: Omit<Address, 'id'>) => void;
  updateAddress: (id: string, address: Partial<Address>) => void;
  deleteAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
}

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user for demo
const mockUser: User = {
  id: 'user-001',
  email: 'demo@wlc2026.com',
  firstName: 'John',
  lastName: 'Legend',
  phone: '+1 (555) 123-4567',
  createdAt: '2025-11-15T10:00:00Z',
};

const mockAddresses: Address[] = [
  {
    id: 'addr-001',
    label: 'Home',
    firstName: 'John',
    lastName: 'Legend',
    street: '123 Football Avenue',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    country: 'United States',
    phone: '+1 (555) 123-4567',
    isDefault: true,
  },
  {
    id: 'addr-002',
    label: 'Office',
    firstName: 'John',
    lastName: 'Legend',
    street: '456 Stadium Road',
    city: 'Los Angeles',
    state: 'CA',
    zipCode: '90001',
    country: 'United States',
    phone: '+1 (555) 987-6543',
    isDefault: false,
  },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for saved session
    const savedUser = localStorage.getItem('wlc-user');
    const savedAddresses = localStorage.getItem('wlc-addresses');

    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
        setAddresses(savedAddresses ? JSON.parse(savedAddresses) : mockAddresses);
      } catch (e) {
        console.error('Failed to parse user:', e);
      }
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem('wlc-user', JSON.stringify(user));
      localStorage.setItem('wlc-addresses', JSON.stringify(addresses));
    }
  }, [user, addresses]);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Demo: accept any email/password
    if (email && password) {
      const loggedInUser = {
        ...mockUser,
        email,
        id: `user-${Date.now()}`,
      };
      setUser(loggedInUser);
      setAddresses(mockAddresses);
      localStorage.setItem('wlc-user', JSON.stringify(loggedInUser));
      localStorage.setItem('wlc-addresses', JSON.stringify(mockAddresses));
      return true;
    }
    return false;
  };

  const register = async (data: RegisterData): Promise<boolean> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const newUser: User = {
      id: `user-${Date.now()}`,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      createdAt: new Date().toISOString(),
    };

    setUser(newUser);
    setAddresses([]);
    localStorage.setItem('wlc-user', JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    setAddresses([]);
    localStorage.removeItem('wlc-user');
    localStorage.removeItem('wlc-addresses');
  };

  const updateProfile = (data: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
    }
  };

  const addAddress = (address: Omit<Address, 'id'>) => {
    const newAddress: Address = {
      ...address,
      id: `addr-${Date.now()}`,
    };

    // If this is the first address or marked as default, update others
    if (address.isDefault || addresses.length === 0) {
      setAddresses((prev) => [
        ...prev.map((a) => ({ ...a, isDefault: false })),
        { ...newAddress, isDefault: true },
      ]);
    } else {
      setAddresses((prev) => [...prev, newAddress]);
    }
  };

  const updateAddress = (id: string, data: Partial<Address>) => {
    setAddresses((prev) =>
      prev.map((addr) => (addr.id === id ? { ...addr, ...data } : addr))
    );
  };

  const deleteAddress = (id: string) => {
    setAddresses((prev) => {
      const filtered = prev.filter((addr) => addr.id !== id);
      // If we deleted the default, make the first one default
      if (filtered.length > 0 && !filtered.some((a) => a.isDefault)) {
        filtered[0].isDefault = true;
      }
      return filtered;
    });
  };

  const setDefaultAddress = (id: string) => {
    setAddresses((prev) =>
      prev.map((addr) => ({
        ...addr,
        isDefault: addr.id === id,
      }))
    );
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateProfile,
        addresses,
        addAddress,
        updateAddress,
        deleteAddress,
        setDefaultAddress,
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
