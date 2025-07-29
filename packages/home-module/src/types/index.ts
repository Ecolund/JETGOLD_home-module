export interface HomeFeature {
  id: string;
  title: string;
  subtitle?: string;
  icon?: string;
  order: number;
  created_at?: string;
  updated_at?: string;
}

export interface Database {
  public: {
    Tables: {
      home_features: {
        Row: HomeFeature;
        Insert: Omit<HomeFeature, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<HomeFeature, 'id' | 'created_at' | 'updated_at'>>;
      };
    };
  };
  created_at?: string;
  updated_at?: string;
}

export interface HomeModuleProps {
  // Add any props that the home module might need
}