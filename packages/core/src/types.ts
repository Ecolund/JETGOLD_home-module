// Core types for the application
export interface CoreConfig {
  version: string;
  environment: 'development' | 'production' | 'test';
}

export interface User {
  id: string;
  name: string;
  email: string;
}