export interface Detection {
  class_name: string;
  confidence: number;
  description: string;
  treatment?: string;
}

export interface User {
  username: string;
  email: string;
}

export interface AuthState {
  isLoggedIn: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  signup: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}
