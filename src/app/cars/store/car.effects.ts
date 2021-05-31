import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { HttpClient } from '@angular/common/http';
import { switchMap, map, withLatestFrom } from 'rxjs/operators';

import * as carsActions from './car.actions';
import { car } from '../car.model';
import * as fromApp from '../../store/app.reducer';

@Injectable()
export class carEffects {
  @Effect()
  fetchcars = this.actions$.pipe(
    ofType(carsActions.FETCH_carS),
    switchMap(() => {
      return this.http.get<car[]>(
        'https://first-project-92195.firebaseio.com/cars.json'
      );
    }),
    map(cars => {
      return cars.map(car => {
        return {
          ...car
        };
      });
    }),
    map(cars => {
      return new carsActions.Setcars(cars);
    })
  );

  @Effect({dispatch: false})
  storecars = this.actions$.pipe(
    ofType(carsActions.STORE_carS),
    withLatestFrom(this.store.select('cars')),
    switchMap(([actionData, carsState]) => {
      return this.http.put(
        'https://first-project-92195.firebaseio.com/cars.json',
        carsState.cars
      );
    })
  );

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private store: Store<fromApp.AppState>
  ) {}
}
