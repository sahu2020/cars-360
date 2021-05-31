import { ActionReducerMap } from '@ngrx/store';

import * as fromAuth from '../auth/store/auth.reducer';
import * as fromcars from '../cars/store/car.reducer';

export interface AppState {
  auth: fromAuth.State;
  cars: fromcars.State;
}

export const appReducer: ActionReducerMap<AppState> = {
  auth: fromAuth.authReducer,
  cars: fromcars.carReducer
};
