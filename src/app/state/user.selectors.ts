import { createSelector } from '@ngrx/store';
import { AppState, UserState } from './user.state';

export const selectUserState = (state: AppState) => state.user;

export const selectUser = createSelector(selectUserState, (state) => state.user);
export const selectLoading = createSelector(selectUserState, (state) => state.loading);
export const selectError = createSelector(selectUserState, (state) => state.error);
