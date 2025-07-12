// Database types for Supabase
// This will be expanded as we create the database schema

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          created_at: string;
          updated_at: string;
          display_name?: string;
          selected_language?: string;
          total_points: number;
          current_streak: number;
          longest_streak: number;
          last_activity_date?: string;
        };
        Insert: {
          id: string;
          email: string;
          created_at?: string;
          updated_at?: string;
          display_name?: string;
          selected_language?: string;
          total_points?: number;
          current_streak?: number;
          longest_streak?: number;
          last_activity_date?: string;
        };
        Update: {
          id?: string;
          email?: string;
          created_at?: string;
          updated_at?: string;
          display_name?: string;
          selected_language?: string;
          total_points?: number;
          current_streak?: number;
          longest_streak?: number;
          last_activity_date?: string;
        };
      };
      // More tables will be added as we develop the schema
    };
    Views: {
      [_ in never]: never
    };
    Functions: {
      [_ in never]: never
    };
    Enums: {
      [_ in never]: never
    };
  };
};
