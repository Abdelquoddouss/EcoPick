import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {of, tap} from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { UserService } from '../services/user.service';
import * as UserActions from './user.actions';

@Injectable()
export class UserEffects {
  constructor(
    private actions$: Actions,
    private userService: UserService
  ) {}

  loadUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.loadUser),
      mergeMap((action) =>
        this.userService.getUser(action.userId).pipe(
          map((user) => UserActions.loadUserSuccess({ user })),
          catchError((error) => of(UserActions.loadUserFailure({ error: error.message })))
        )
      )
    )
  );

  updateUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.updateUser),
      mergeMap((action) =>
        this.userService.updateUser(action.userId, action.user).pipe(
          tap((updatedUser) => {
            // Mettre à jour localStorage
            localStorage.setItem('user', JSON.stringify(updatedUser));
          }),
          map((user) => UserActions.updateUserSuccess({ user })),
          catchError((error) => of(UserActions.updateUserFailure({ error: error.message })))
        )
      )
    )
  );

  // Effet pour supprimer l'utilisateur
  deleteUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.deleteUser),
      mergeMap((action) =>
        this.userService.deleteUser(action.userId).pipe(
          map(() => UserActions.deleteUserSuccess()),
          catchError((error) => of(UserActions.deleteUserFailure({ error: error.message })))
        )
      )
    )
  );
}
