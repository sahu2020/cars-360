import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { Store } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import { take, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

import { car } from './car.model';
import * as fromApp from '../store/app.reducer';
import * as carsActions from '../cars/store/car.actions';

@Injectable({ providedIn: 'root' })
export class carsResolverService implements Resolve<car[]> {
  constructor(
    private store: Store<fromApp.AppState>,
    private actions$: Actions
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.store.select('cars').pipe(
      take(1),
      map(carsState => {
        return carsState.cars;
      }),
      switchMap(cars => {
        if (cars.length === 0) {
          this.store.dispatch(new carsActions.Fetchcars());
          return this.actions$.pipe(
            ofType(carsActions.SET_carS),
            take(1)
          );
        } else {
          return of(cars);
        }
      })
    );
  }
}
