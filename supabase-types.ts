export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
  public: {
    Tables: {
      clusters: {
        Row: {
          created_at: string;
          end_time: string;
          id: string;
          name: string;
          start_time: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          end_time?: string;
          id?: string;
          name: string;
          start_time?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          end_time?: string;
          id?: string;
          name?: string;
          start_time?: string;
          user_id?: string;
        };
      };
      habit_dates_completed: {
        Row: {
          date: string;
          habit_id: string;
        };
        Insert: {
          date: string;
          habit_id: string;
        };
        Update: {
          date?: string;
          habit_id?: string;
        };
      };
      habits: {
        Row: {
          cluster_id: string;
          created_at: string;
          id: string;
          name: string;
          user_id: string;
        };
        Insert: {
          cluster_id: string;
          created_at?: string;
          id?: string;
          is_complete?: boolean;
          name: string;
          user_id: string;
        };
        Update: {
          cluster_id?: string;
          created_at?: string;
          id?: string;
          is_complete?: boolean;
          name?: string;
          user_id?: string;
        };
      };
      profiles: {
        Row: {
          id: string;
          name: string;
          premium: boolean;
        };
        Insert: {
          id: string;
          name: string;
          premium?: boolean;
        };
        Update: {
          id?: string;
          name?: string;
          premium?: boolean;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
