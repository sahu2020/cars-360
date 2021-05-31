import { car } from '../car.model';
import * as carsActions from './car.actions';

export interface State {
  cars: car[];
}

const initialState: State = {
  cars: []
};

export function carReducer(
  state = initialState,
  action: carsActions.carsActions
) {
  switch (action.type) {
    case carsActions.SET_carS:
      return {
        ...state,
        cars: [...action.payload]
      };
    case carsActions.ADD_car:
      return {
        ...state,
        cars: [...state.cars, action.payload]
      };
    case carsActions.UPDATE_car:
      const updatedcar = {
        ...state.cars[action.payload.index],
        ...action.payload.newcar
      };

      const updatedcars = [...state.cars];
      updatedcars[action.payload.index] = updatedcar;

      return {
        ...state,
        cars: updatedcars
      };
    case carsActions.DELETE_car:
      return {
        ...state,
        cars: state.cars.filter((car, index) => {
          return index !== action.payload;
        })
      };
    default:
      return state;
  }
}
