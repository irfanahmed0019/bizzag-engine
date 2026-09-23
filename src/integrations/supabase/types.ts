export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      contact_messages: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
          phone: string
          status: string
          subject: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          phone?: string
          status?: string
          subject?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          phone?: string
          status?: string
          subject?: string
        }
        Relationships: []
      }
      customization_requests: {
        Row: {
          created_at: string
          id: string
          images: string[]
          note: string
          product_id: string | null
          product_name: string
          product_slug: string
          quantity: number
          reference: string
          selections: Json
          status: string
        }
        Insert: {
          created_at?: string
          id?: string
          images?: string[]
          note?: string
          product_id?: string | null
          product_name?: string
          product_slug?: string
          quantity?: number
          reference: string
          selections?: Json
          status?: string
        }
        Update: {
          created_at?: string
          id?: string
          images?: string[]
          note?: string
          product_id?: string | null
          product_name?: string
          product_slug?: string
          quantity?: number
          reference?: string
          selections?: Json
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "customization_requests_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          badge: string | null
          best_seller: boolean
          blurb: string
          category: string
          created_at: string
          custom_fields: Json
          description: string
          featured: boolean
          features: string[]
          frame: boolean
          frame_borders: Json
          frame_layouts: Json
          gift_wrap_price: number
          id: string
          image: string
          images: string[]
          low_stock_threshold: number
          mrp: number | null
          name: string
          new_arrival: boolean
          occasions: string[]
          options: Json
          personalization: boolean
          photo_upload: boolean
          price: number
          published: boolean
          rating: number
          reviews: number
          sku: string | null
          slug: string
          sort_order: number
          specs: Json
          stock_qty: number | null
          stock_status: string
          trending: boolean
          updated_at: string
        }
        Insert: {
          badge?: string | null
          best_seller?: boolean
          blurb?: string
          category?: string
          created_at?: string
          custom_fields?: Json
          description?: string
          featured?: boolean
          features?: string[]
          frame?: boolean
          frame_borders?: Json
          frame_layouts?: Json
          gift_wrap_price?: number
          id?: string
          image?: string
          images?: string[]
          low_stock_threshold?: number
          mrp?: number | null
          name: string
          new_arrival?: boolean
          occasions?: string[]
          options?: Json
          personalization?: boolean
          photo_upload?: boolean
          price?: number
          published?: boolean
          rating?: number
          reviews?: number
          sku?: string | null
          slug: string
          sort_order?: number
          specs?: Json
          stock_qty?: number | null
          stock_status?: string
          trending?: boolean
          updated_at?: string
        }
        Update: {
          badge?: string | null
          best_seller?: boolean
          blurb?: string
          category?: string
          created_at?: string
          custom_fields?: Json
          description?: string
          featured?: boolean
          features?: string[]
          frame?: boolean
          frame_borders?: Json
          frame_layouts?: Json
          gift_wrap_price?: number
          id?: string
          image?: string
          images?: string[]
          low_stock_threshold?: number
          mrp?: number | null
          name?: string
          new_arrival?: boolean
          occasions?: string[]
          options?: Json
          personalization?: boolean
          photo_upload?: boolean
          price?: number
          published?: boolean
          rating?: number
          reviews?: number
          sku?: string | null
          slug?: string
          sort_order?: number
          specs?: Json
          stock_qty?: number | null
          stock_status?: string
          trending?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      site_content: {
        Row: {
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          key: string
          updated_at?: string
          value?: Json
        }
        Update: {
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      site_events: {
        Row: {
          created_at: string
          id: string
          product_id: string | null
          product_name: string
          type: string
        }
        Insert: {
          created_at?: string
          id?: string
          product_id?: string | null
          product_name?: string
          type: string
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string | null
          product_name?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "site_events_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
