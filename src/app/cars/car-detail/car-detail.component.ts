import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, switchMap } from 'rxjs/operators';

import { car } from '../car.model';
import * as fromApp from '../../store/app.reducer';
import * as carsActions from '../store/car.actions';


@Component({
  selector: 'app-car-detail',
  templateUrl: './car-detail.component.html',
  styleUrls: ['./car-detail.component.scss']
})
export class carDetailComponent implements OnInit {
  car: car;
  id: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit() {
    this.route.params
      .pipe(
        map(params => {
       
          return params['id'];
        }),
        switchMap(id => {
          this.id = id;
          return this.store.select('cars');
        }),
        map(carsState => {
          return carsState.cars.find((car, index) => {
            return car["car_vin"] == this.id;
          });
        })
      )
      .subscribe(car => {
        this.car = car;
      });
  }

  onAddToShoppingList() {
    // this.carService.addIngredientsToShoppingList(this.car.ingredients);
    // this.store.dispatch(
    //   new ShoppingListActions.AddIngredients(this.car.ingredients)
    // );
  }

  onEditcar() {
    this.router.navigate(['edit'], { relativeTo: this.route });
    // this.router.navigate(['../', this.id, 'edit'], {relativeTo: this.route});
  }

  onDeletecar() {
    // this.carService.deletecar(this.id);
    this.store.dispatch(new carsActions.Deletecar(this.id));
    this.router.navigate(['/cars']);
  }
}
