export interface User {
  id: number;
  fullName: string;
  email: string;
  address: string;
  phone: string;
  birthDate: string;
}

export interface UserState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface AppState {
  user: UserState;
}

export const initialUserState: UserState = {
  user: null,
  loading: false,
  error: null,
};
