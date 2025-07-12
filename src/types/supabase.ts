export type Json
  = | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[];

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)";
  };
  public: {
    Tables: {
      badges: {
        Row: {
          created_at: string | null;
          criteria: Json | null;
          description: string;
          icon: string | null;
          id: string;
          is_active: boolean | null;
          name: string;
          points_reward: number | null;
        };
        Insert: {
          created_at?: string | null;
          criteria?: Json | null;
          description: string;
          icon?: string | null;
          id?: string;
          is_active?: boolean | null;
          name: string;
          points_reward?: number | null;
        };
        Update: {
          created_at?: string | null;
          criteria?: Json | null;
          description?: string;
          icon?: string | null;
          id?: string;
          is_active?: boolean | null;
          name?: string;
          points_reward?: number | null;
        };
        Relationships: [];
      };
      languages: {
        Row: {
          code: string;
          created_at: string | null;
          flag_emoji: string | null;
          id: string;
          is_active: boolean | null;
          name: string;
          native_name: string;
        };
        Insert: {
          code: string;
          created_at?: string | null;
          flag_emoji?: string | null;
          id?: string;
          is_active?: boolean | null;
          name: string;
          native_name: string;
        };
        Update: {
          code?: string;
          created_at?: string | null;
          flag_emoji?: string | null;
          id?: string;
          is_active?: boolean | null;
          name?: string;
          native_name?: string;
        };
        Relationships: [];
      };
      lessons: {
        Row: {
          created_at: string | null;
          description: string | null;
          difficulty_level: number | null;
          estimated_duration_minutes: number | null;
          id: string;
          is_published: boolean | null;
          language_id: string;
          order_index: number;
          title: string;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          description?: string | null;
          difficulty_level?: number | null;
          estimated_duration_minutes?: number | null;
          id?: string;
          is_published?: boolean | null;
          language_id: string;
          order_index: number;
          title: string;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          description?: string | null;
          difficulty_level?: number | null;
          estimated_duration_minutes?: number | null;
          id?: string;
          is_published?: boolean | null;
          language_id?: string;
          order_index?: number;
          title?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "lessons_language_id_fkey";
            columns: ["language_id"];
            isOneToOne: false;
            referencedRelation: "languages";
            referencedColumns: ["id"];
          },
        ];
      };
      profiles: {
        Row: {
          created_at: string | null;
          current_streak: number | null;
          display_name: string | null;
          email: string;
          id: string;
          last_activity_date: string | null;
          longest_streak: number | null;
          selected_language: string | null;
          total_points: number | null;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          current_streak?: number | null;
          display_name?: string | null;
          email: string;
          id: string;
          last_activity_date?: string | null;
          longest_streak?: number | null;
          selected_language?: string | null;
          total_points?: number | null;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          current_streak?: number | null;
          display_name?: string | null;
          email?: string;
          id?: string;
          last_activity_date?: string | null;
          longest_streak?: number | null;
          selected_language?: string | null;
          total_points?: number | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "profiles_selected_language_fkey";
            columns: ["selected_language"];
            isOneToOne: false;
            referencedRelation: "languages";
            referencedColumns: ["code"];
          },
        ];
      };
      user_badges: {
        Row: {
          badge_id: string;
          earned_at: string | null;
          id: string;
          user_id: string;
        };
        Insert: {
          badge_id: string;
          earned_at?: string | null;
          id?: string;
          user_id: string;
        };
        Update: {
          badge_id?: string;
          earned_at?: string | null;
          id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_badges_badge_id_fkey";
            columns: ["badge_id"];
            isOneToOne: false;
            referencedRelation: "badges";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "user_badges_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      user_progress: {
        Row: {
          attempts: number | null;
          completed_at: string | null;
          created_at: string | null;
          id: string;
          lesson_id: string;
          score: number | null;
          status: string;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          attempts?: number | null;
          completed_at?: string | null;
          created_at?: string | null;
          id?: string;
          lesson_id: string;
          score?: number | null;
          status?: string;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          attempts?: number | null;
          completed_at?: string | null;
          created_at?: string | null;
          id?: string;
          lesson_id?: string;
          score?: number | null;
          status?: string;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_progress_lesson_id_fkey";
            columns: ["lesson_id"];
            isOneToOne: false;
            referencedRelation: "lessons";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "user_progress_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      user_sessions: {
        Row: {
          duration_minutes: number | null;
          ended_at: string | null;
          id: string;
          lessons_completed: number | null;
          points_earned: number | null;
          started_at: string | null;
          user_id: string;
          words_practiced: number | null;
        };
        Insert: {
          duration_minutes?: number | null;
          ended_at?: string | null;
          id?: string;
          lessons_completed?: number | null;
          points_earned?: number | null;
          started_at?: string | null;
          user_id: string;
          words_practiced?: number | null;
        };
        Update: {
          duration_minutes?: number | null;
          ended_at?: string | null;
          id?: string;
          lessons_completed?: number | null;
          points_earned?: number | null;
          started_at?: string | null;
          user_id?: string;
          words_practiced?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "user_sessions_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      user_vocabulary: {
        Row: {
          correct_answers: number | null;
          created_at: string | null;
          id: string;
          last_reviewed_at: string | null;
          mastery_level: number | null;
          next_review_at: string | null;
          total_attempts: number | null;
          updated_at: string | null;
          user_id: string;
          vocabulary_id: string;
        };
        Insert: {
          correct_answers?: number | null;
          created_at?: string | null;
          id?: string;
          last_reviewed_at?: string | null;
          mastery_level?: number | null;
          next_review_at?: string | null;
          total_attempts?: number | null;
          updated_at?: string | null;
          user_id: string;
          vocabulary_id: string;
        };
        Update: {
          correct_answers?: number | null;
          created_at?: string | null;
          id?: string;
          last_reviewed_at?: string | null;
          mastery_level?: number | null;
          next_review_at?: string | null;
          total_attempts?: number | null;
          updated_at?: string | null;
          user_id?: string;
          vocabulary_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_vocabulary_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "user_vocabulary_vocabulary_id_fkey";
            columns: ["vocabulary_id"];
            isOneToOne: false;
            referencedRelation: "vocabulary";
            referencedColumns: ["id"];
          },
        ];
      };
      vocabulary: {
        Row: {
          audio_url: string | null;
          created_at: string | null;
          difficulty_level: number | null;
          english_word: string;
          example_sentence_english: string | null;
          example_sentence_translated: string | null;
          id: string;
          lesson_id: string;
          pronunciation: string | null;
          translated_word: string;
          word_type: string | null;
        };
        Insert: {
          audio_url?: string | null;
          created_at?: string | null;
          difficulty_level?: number | null;
          english_word: string;
          example_sentence_english?: string | null;
          example_sentence_translated?: string | null;
          id?: string;
          lesson_id: string;
          pronunciation?: string | null;
          translated_word: string;
          word_type?: string | null;
        };
        Update: {
          audio_url?: string | null;
          created_at?: string | null;
          difficulty_level?: number | null;
          english_word?: string;
          example_sentence_english?: string | null;
          example_sentence_translated?: string | null;
          id?: string;
          lesson_id?: string;
          pronunciation?: string | null;
          translated_word?: string;
          word_type?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "vocabulary_lesson_id_fkey";
            columns: ["lesson_id"];
            isOneToOne: false;
            referencedRelation: "lessons";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never
    };
    Functions: {
      get_user_stats: {
        Args: { user_uuid: string };
        Returns: {
          total_lessons_completed: number;
          total_words_learned: number;
          current_streak: number;
          total_points: number;
        }[];
      };
      update_user_streak: {
        Args: { user_uuid: string };
        Returns: undefined;
      };
    };
    Enums: {
      [_ in never]: never
    };
    CompositeTypes: {
      [_ in never]: never
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
  | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
  | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
      & DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    & DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
      ? R
      : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"]
    & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"]
      & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
        ? R
        : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
  | keyof DefaultSchema["Tables"]
  | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
    Insert: infer I;
  }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Insert: infer I;
    }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
  | keyof DefaultSchema["Tables"]
  | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
    Update: infer U;
  }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Update: infer U;
    }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
  | keyof DefaultSchema["Enums"]
  | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
  | keyof DefaultSchema["CompositeTypes"]
  | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
