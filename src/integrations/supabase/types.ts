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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      about_content: {
        Row: {
          content: Json
          created_at: string
          id: string
          section: string
          updated_at: string
        }
        Insert: {
          content: Json
          created_at?: string
          id?: string
          section: string
          updated_at?: string
        }
        Update: {
          content?: Json
          created_at?: string
          id?: string
          section?: string
          updated_at?: string
        }
        Relationships: []
      }
      article_categories: {
        Row: {
          created_at: string
          id: string
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      article_likes: {
        Row: {
          article_id: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          article_id: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          article_id?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "article_likes_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "article_likes_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles_with_authors"
            referencedColumns: ["id"]
          },
        ]
      }
      articles: {
        Row: {
          author: string | null
          category: string | null
          content: string | null
          created_at: string
          date: string
          description: string | null
          id: string
          image: string | null
          likes: number | null
          title: string
          updated_at: string
          views: number | null
        }
        Insert: {
          author?: string | null
          category?: string | null
          content?: string | null
          created_at?: string
          date?: string
          description?: string | null
          id?: string
          image?: string | null
          likes?: number | null
          title: string
          updated_at?: string
          views?: number | null
        }
        Update: {
          author?: string | null
          category?: string | null
          content?: string | null
          created_at?: string
          date?: string
          description?: string | null
          id?: string
          image?: string | null
          likes?: number | null
          title?: string
          updated_at?: string
          views?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_article_category"
            columns: ["category"]
            isOneToOne: false
            referencedRelation: "article_categories"
            referencedColumns: ["slug"]
          },
        ]
      }
      comments: {
        Row: {
          article_id: string
          author_name: string
          content: string
          created_at: string
          id: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          article_id: string
          author_name: string
          content: string
          created_at?: string
          id?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          article_id?: string
          author_name?: string
          content?: string
          created_at?: string
          id?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "comments_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles_with_authors"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          first_name: string | null
          id: string
          last_name: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          first_name?: string | null
          id: string
          last_name?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Relationships: []
      }
      services: {
        Row: {
          created_at: string
          description: string
          features: string[]
          id: string
          image: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          features?: string[]
          id?: string
          image?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          features?: string[]
          id?: string
          image?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      team_members: {
        Row: {
          created_at: string
          id: string
          image: string | null
          name: string
          order_index: number | null
          role: Database["public"]["Enums"]["team_role"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          image?: string | null
          name: string
          order_index?: number | null
          role: Database["public"]["Enums"]["team_role"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          image?: string | null
          name?: string
          order_index?: number | null
          role?: Database["public"]["Enums"]["team_role"]
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      articles_with_authors: {
        Row: {
          author: string | null
          author_name: string | null
          category: string | null
          content: string | null
          created_at: string | null
          date: string | null
          description: string | null
          id: string | null
          image: string | null
          likes: number | null
          title: string | null
          updated_at: string | null
          views: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_article_category"
            columns: ["category"]
            isOneToOne: false
            referencedRelation: "article_categories"
            referencedColumns: ["slug"]
          },
        ]
      }
      user_full_names: {
        Row: {
          full_name: string | null
          id: string | null
          role: Database["public"]["Enums"]["user_role"] | null
        }
        Insert: {
          full_name?: never
          id?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
        }
        Update: {
          full_name?: never
          id?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
        }
        Relationships: []
      }
    }
    Functions: {
      check_user_liked_article: {
        Args: { p_article_id: string; p_user_id: string }
        Returns: boolean
      }
      increment_article_views: {
        Args: { article_id: string }
        Returns: undefined
      }
      is_admin: { Args: { user_id: string }; Returns: boolean }
      toggle_article_like: {
        Args: { p_article_id: string; p_user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      team_role:
        | "CEO"
        | "DG"
        | "SG"
        | "REDACTRICE"
        | "COMMUNICATRICE"
        | "COMMUNICATEUR"
      user_role: "admin" | "author" | "user"
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      team_role: [
        "CEO",
        "DG",
        "SG",
        "REDACTRICE",
        "COMMUNICATRICE",
        "COMMUNICATEUR",
      ],
      user_role: ["admin", "author", "user"],
    },
  },
} as const
