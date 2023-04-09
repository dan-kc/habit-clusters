import { Database } from 'supabase-types';

export type Profile = Database['public']['Tables']['profiles']['Row'] & {
  clusters: Cluster[];
};

export type Cluster = Database['public']['Tables']['clusters']['Row'] & {
  habits: Habit[];
};

export type Habit = Database['public']['Tables']['habits']['Row'] & {
  habit_dates_completed: Database['public']['Tables']['habit_dates_completed']['Row'][];
};
