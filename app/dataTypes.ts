export interface Profile {
  premium: boolean;
  name: string;
  clusters: Cluster[];
}

export interface Cluster {
  id: string;
  name: string;
  start_time: string;
  end_time: string;
  habits: Habit[];
}

export interface Habit {
  id: string;
  cluster_id: string;
  name: string;
  is_complete?: boolean;
}
