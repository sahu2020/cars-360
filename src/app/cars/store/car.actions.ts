import { Action } from '@ngrx/store';

import { car } from '../car.model';

export const SET_carS = '[cars] Set cars';
export const FETCH_carS = '[cars] Fetch cars';
export const ADD_car = '[car] Add car';
export const UPDATE_car = '[car] Update car';
export const DELETE_car = '[car] Delete car';
export const STORE_carS = '[car] Store cars';

export class Setcars implements Action {
  readonly type = SET_carS;

  constructor(public payload: car[]) {}
}

export class Fetchcars implements Action {
  readonly type = FETCH_carS;
}

export class Addcar implements Action {
  readonly type = ADD_car;

  constructor(public payload: car) {}
}

export class Updatecar implements Action {
  readonly type = UPDATE_car;

  constructor(public payload: { index: number; newcar: car }) {}
}

export class Deletecar implements Action {
  readonly type = DELETE_car;

  constructor(public payload: number) {}
}

export class Storecars implements Action {
  readonly type = STORE_carS;
}

export type carsActions =
  | Setcars
  | Fetchcars
  | Addcar
  | Updatecar
  | Deletecar
  | Storecars;
