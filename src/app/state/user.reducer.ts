import { createReducer, on } from '@ngrx/store';
import { UserState, initialUserState } from './user.state';
import * as UserActions from './user.actions';

export const userReducer = createReducer(
  initialUserState,

  // Charger l'utilisateur
  on(UserActions.loadUser, (state) => ({ ...state, loading: true, error: null })),
  on(UserActions.loadUserSuccess, (state, { user }) => ({ ...state, user, loading: false })),
  on(UserActions.loadUserFailure, (state, { error }) => ({ ...state, error, loading: false })),

  // Mettre à jour l'utilisateur
  on(UserActions.updateUser, (state) => ({ ...state, loading: true, error: null })),
  on(UserActions.updateUserSuccess, (state, { user }) => ({
    ...state,
    user: {
      ...state.user,
      ...user
    },
    loading: false
  })),
on(UserActions.updateUserFailure, (state, { error }) => ({ ...state, error, loading: false })),

  // Supprimer l'utilisateur
  on(UserActions.deleteUser, (state) => ({ ...state, loading: true, error: null })),
  on(UserActions.deleteUserSuccess, (state) => ({ ...state, user: null, loading: false })),
  on(UserActions.deleteUserFailure, (state, { error }) => ({ ...state, error, loading: false }))
);

