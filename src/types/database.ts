export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          first_name: string | null
          last_name: string | null
          phone: string | null
          avatar_url: string | null
          role: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          first_name?: string | null
          last_name?: string | null
          phone?: string | null
          avatar_url?: string | null
          role?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          first_name?: string | null
          last_name?: string | null
          phone?: string | null
          avatar_url?: string | null
          role?: string
          created_at?: string
          updated_at?: string
        }
      }
      addresses: {
        Row: {
          id: string
          user_id: string
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
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          label: string
          first_name: string
          last_name: string
          street: string
          city: string
          state: string
          zip_code: string
          country: string
          phone?: string | null
          is_default?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          label?: string
          first_name?: string
          last_name?: string
          street?: string
          city?: string
          state?: string
          zip_code?: string
          country?: string
          phone?: string | null
          is_default?: boolean
          created_at?: string
        }
      }
      products: {
        Row: {
          id: number
          name: string
          slug: string
          price: number
          original_price: number | null
          description: string | null
          category: string
          subcategory: string | null
          images: string[]
          sizes: string[] | null
          colors: Json | null
          in_stock: boolean
          stock_quantity: number
          featured: boolean
          rating: number
          review_count: number
          tags: string[] | null
          legend: string | null
          team: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          name: string
          slug: string
          price: number
          original_price?: number | null
          description?: string | null
          category: string
          subcategory?: string | null
          images?: string[]
          sizes?: string[] | null
          colors?: Json | null
          in_stock?: boolean
          stock_quantity?: number
          featured?: boolean
          rating?: number
          review_count?: number
          tags?: string[] | null
          legend?: string | null
          team?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          name?: string
          slug?: string
          price?: number
          original_price?: number | null
          description?: string | null
          category?: string
          subcategory?: string | null
          images?: string[]
          sizes?: string[] | null
          colors?: Json | null
          in_stock?: boolean
          stock_quantity?: number
          featured?: boolean
          rating?: number
          review_count?: number
          tags?: string[] | null
          legend?: string | null
          team?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          user_id: string | null
          status: string
          payment_status: string
          subtotal: number
          shipping: number
          tax: number
          total: number
          shipping_address: Json
          billing_address: Json | null
          stripe_payment_intent_id: string | null
          tracking_number: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          user_id?: string | null
          status?: string
          payment_status?: string
          subtotal: number
          shipping: number
          tax: number
          total: number
          shipping_address: Json
          billing_address?: Json | null
          stripe_payment_intent_id?: string | null
          tracking_number?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          status?: string
          payment_status?: string
          subtotal?: number
          shipping?: number
          tax?: number
          total?: number
          shipping_address?: Json
          billing_address?: Json | null
          stripe_payment_intent_id?: string | null
          tracking_number?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      order_items: {
        Row: {
          id: number
          order_id: string
          product_id: number | null
          product_name: string
          quantity: number
          price: number
          size: string | null
          color: string | null
        }
        Insert: {
          id?: number
          order_id: string
          product_id?: number | null
          product_name: string
          quantity: number
          price: number
          size?: string | null
          color?: string | null
        }
        Update: {
          id?: number
          order_id?: string
          product_id?: number | null
          product_name?: string
          quantity?: number
          price?: number
          size?: string | null
          color?: string | null
        }
      }
      cart_items: {
        Row: {
          id: number
          user_id: string
          product_id: number
          quantity: number
          size: string | null
          color: string | null
          created_at: string
        }
        Insert: {
          id?: number
          user_id: string
          product_id: number
          quantity?: number
          size?: string | null
          color?: string | null
          created_at?: string
        }
        Update: {
          id?: number
          user_id?: string
          product_id?: number
          quantity?: number
          size?: string | null
          color?: string | null
          created_at?: string
        }
      }
      wishlist_items: {
        Row: {
          id: number
          user_id: string
          product_id: number
          created_at: string
        }
        Insert: {
          id?: number
          user_id: string
          product_id: number
          created_at?: string
        }
        Update: {
          id?: number
          user_id?: string
          product_id?: number
          created_at?: string
        }
      }
      coupons: {
        Row: {
          id: number
          code: string
          type: string
          value: number
          min_order_amount: number | null
          max_uses: number | null
          used_count: number
          expires_at: string | null
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: number
          code: string
          type: string
          value: number
          min_order_amount?: number | null
          max_uses?: number | null
          used_count?: number
          expires_at?: string | null
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: number
          code?: string
          type?: string
          value?: number
          min_order_amount?: number | null
          max_uses?: number | null
          used_count?: number
          expires_at?: string | null
          is_active?: boolean
          created_at?: string
        }
      }
      newsletter_subscribers: {
        Row: {
          id: number
          email: string
          subscribed_at: string
          is_active: boolean
        }
        Insert: {
          id?: number
          email: string
          subscribed_at?: string
          is_active?: boolean
        }
        Update: {
          id?: number
          email?: string
          subscribed_at?: string
          is_active?: boolean
        }
      }
      contact_messages: {
        Row: {
          id: number
          first_name: string
          last_name: string
          email: string
          subject: string
          message: string
          status: string
          created_at: string
        }
        Insert: {
          id?: number
          first_name: string
          last_name: string
          email: string
          subject: string
          message: string
          status?: string
          created_at?: string
        }
        Update: {
          id?: number
          first_name?: string
          last_name?: string
          email?: string
          subject?: string
          message?: string
          status?: string
          created_at?: string
        }
      }
      reviews: {
        Row: {
          id: number
          product_id: number
          user_id: string
          rating: number
          title: string | null
          comment: string | null
          created_at: string
        }
        Insert: {
          id?: number
          product_id: number
          user_id: string
          rating: number
          title?: string | null
          comment?: string | null
          created_at?: string
        }
        Update: {
          id?: number
          product_id?: number
          user_id?: string
          rating?: number
          title?: string | null
          comment?: string | null
          created_at?: string
        }
      }
      legends: {
        Row: {
          id: number
          name: string
          short_name: string | null
          country: string
          country_code: string | null
          position: string | null
          era: string | null
          goals: number
          assists: number
          appearances: number
          world_cups: number
          image: string | null
          team: string | null
          jersey_number: number | null
          rating: number | null
        }
        Insert: {
          id?: number
          name: string
          short_name?: string | null
          country: string
          country_code?: string | null
          position?: string | null
          era?: string | null
          goals?: number
          assists?: number
          appearances?: number
          world_cups?: number
          image?: string | null
          team?: string | null
          jersey_number?: number | null
          rating?: number | null
        }
        Update: {
          id?: number
          name?: string
          short_name?: string | null
          country?: string
          country_code?: string | null
          position?: string | null
          era?: string | null
          goals?: number
          assists?: number
          appearances?: number
          world_cups?: number
          image?: string | null
          team?: string | null
          jersey_number?: number | null
          rating?: number | null
        }
      }
      teams: {
        Row: {
          id: number
          name: string
          country_code: string | null
          flag: string | null
          world_cups: number
          world_cup_years: string[] | null
          confederation: string | null
          rating: number | null
          color: string | null
        }
        Insert: {
          id?: number
          name: string
          country_code?: string | null
          flag?: string | null
          world_cups?: number
          world_cup_years?: string[] | null
          confederation?: string | null
          rating?: number | null
          color?: string | null
        }
        Update: {
          id?: number
          name?: string
          country_code?: string | null
          flag?: string | null
          world_cups?: number
          world_cup_years?: string[] | null
          confederation?: string | null
          rating?: number | null
          color?: string | null
        }
      }
      matches: {
        Row: {
          id: number
          home_team: string
          away_team: string
          home_flag: string | null
          away_flag: string | null
          match_date: string
          match_time: string | null
          venue: string | null
          stage: string | null
          home_score: number | null
          away_score: number | null
          is_live: boolean
        }
        Insert: {
          id?: number
          home_team: string
          away_team: string
          home_flag?: string | null
          away_flag?: string | null
          match_date: string
          match_time?: string | null
          venue?: string | null
          stage?: string | null
          home_score?: number | null
          away_score?: number | null
          is_live?: boolean
        }
        Update: {
          id?: number
          home_team?: string
          away_team?: string
          home_flag?: string | null
          away_flag?: string | null
          match_date?: string
          match_time?: string | null
          venue?: string | null
          stage?: string | null
          home_score?: number | null
          away_score?: number | null
          is_live?: boolean
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// Helper types
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type InsertTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type UpdateTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']

// Convenience types
export type Profile = Tables<'profiles'>
export type Address = Tables<'addresses'>
export type Product = Tables<'products'>
export type Order = Tables<'orders'>
export type OrderItem = Tables<'order_items'>
export type CartItem = Tables<'cart_items'>
export type WishlistItem = Tables<'wishlist_items'>
export type Coupon = Tables<'coupons'>
export type NewsletterSubscriber = Tables<'newsletter_subscribers'>
export type ContactMessage = Tables<'contact_messages'>
export type Review = Tables<'reviews'>
export type Legend = Tables<'legends'>
export type Team = Tables<'teams'>
export type Match = Tables<'matches'>
