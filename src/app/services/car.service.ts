import {Injectable, PipeTransform} from '@angular/core';

import {BehaviorSubject, Observable, of, Subject} from 'rxjs';

import {Car, CarListData} from '../shared/models/car.model';
import {DecimalPipe} from '@angular/common';
import {debounceTime, delay, map, switchMap, tap} from 'rxjs/operators';
import {SortColumn, SortDirection} from '../shared/directives/sortable.directives';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer';

interface SearchResult {
  carsList: Car[];
  total: number;
}

interface State {
  page: number;
  pageSize: number;
  searchTerm: string;
  sortColumn: SortColumn;
  sortDirection: SortDirection;
}

const compare = (v1: string | number, v2: string | number) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;

function sort(cars: Car[], column: SortColumn, direction: string): Car[] {
  if (direction === '' || column === '') {
    return cars;
  } else {
    return [...cars].sort((a, b) => {
      const res = compare(a.id, b.id);
      return direction === 'asc' ? res : -res;
    });
  }
}

function matches(Car: Car, term: string, pipe: PipeTransform) {
  return Car.car_model.toLowerCase().includes(term.toLowerCase())
    || pipe.transform(Car.car_model).includes(term)
    || pipe.transform(Car.car_color).includes(term);
}

@Injectable({providedIn: 'root'})
export class CarService {
  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _cars$ = new BehaviorSubject<Car[]>([]);
  private _total$ = new BehaviorSubject<number>(0);
  listOfCarFromInventory:Car[];

  private _state: State = {
    page: 1,
    pageSize: 100,
    searchTerm: '',
    sortColumn: '',
    sortDirection: ''
  };

  constructor(private pipe: DecimalPipe, private http:HttpClient,private store: Store<fromApp.AppState>) {
    this.fetchCars();
    this._search$.pipe(
      tap(() => this._loading$.next(true)),
      debounceTime(200),
      switchMap(() => this._search()),
      delay(200),
      tap(() => this._loading$.next(false))
    ).subscribe(result => {
      this._cars$.next(result.carsList);
      this._total$.next(result.total);
    });

    this._search$.next();
  }

  get cars$() { return this._cars$.asObservable(); }
  get total$() { return this._total$.asObservable(); }
  get loading$() { return this._loading$.asObservable(); }
  get page() { return this._state.page; }
  get pageSize() { return this._state.pageSize; }
  get searchTerm() { return this._state.searchTerm; }

  set page(page: number) { this._set({page}); }
  set pageSize(pageSize: number) { this._set({pageSize}); }
  set searchTerm(searchTerm: string) { this._set({searchTerm}); }
  set sortColumn(sortColumn: SortColumn) { this._set({sortColumn}); }
  set sortDirection(sortDirection: SortDirection) { this._set({sortDirection}); }

  private _set(patch: Partial<State>) {
    Object.assign(this._state, patch);
    this._search$.next();
  }

  private _search(): Observable<SearchResult> {
    const {sortColumn, sortDirection, pageSize, page, searchTerm} = this._state;

    // 1. sort
    let carsList = sort( this.listOfCarFromInventory, sortColumn, sortDirection);

    // 2. filter
    carsList = carsList.filter(car => matches(car, searchTerm, this.pipe));
    const total = carsList.length;

    // 3. paginate
    carsList = carsList.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);
    return of({carsList, total});
  }

  private fetchCars(){
     return this.http.get("http://localhost:4300/cars/inventory").subscribe((data:CarListData)=> this.listOfCarFromInventory = data.cars);
  }
}