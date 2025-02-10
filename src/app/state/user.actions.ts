import { createAction, props } from '@ngrx/store';
import { User } from './user.state';

// Charger l'utilisateur
export const loadUser = createAction('[User] Load User', props<{ userId: number }>());
export const loadUserSuccess = createAction('[User] Load User Success', props<{ user: User }>());
export const loadUserFailure = createAction('[User] Load User Failure', props<{ error: string }>());

// Mettre à jour l'utilisateur
export const updateUser = createAction('[User] Update User', props<{ userId: number; user: User }>());
export const updateUserSuccess = createAction('[User] Update User Success', props<{ user: User }>());
export const updateUserFailure = createAction('[User] Update User Failure', props<{ error: string }>());

// Supprimer l'utilisateur
export const deleteUser = createAction('[User] Delete User', props<{ userId: number }>());
export const deleteUserSuccess = createAction('[User] Delete User Success');
export const deleteUserFailure = createAction('[User] Delete User Failure', props<{ error: string }>());
