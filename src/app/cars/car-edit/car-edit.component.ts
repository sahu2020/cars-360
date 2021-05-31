import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';
import { Subscription } from 'rxjs';

import * as fromApp from '../../store/app.reducer';
import * as carsActions from '../store/car.actions';
import { car } from '../car.model';

@Component({
  selector: 'app-car-edit',
  templateUrl: './car-edit.component.html',
  styleUrls: ['./car-edit.component.scss']
})
export class carEditComponent implements OnInit, OnDestroy {
  id: any;
  editMode = false;
  carForm: FormGroup;

  private storeSub: Subscription;


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
      this.editMode = params['id'] != null;
      this.initForm();
    });
  }


  onSubmit() {
    const newcar = new car(
      this.carForm.value['id'],
      this.carForm.value['car'],
      this.carForm.value['car_model'],
      this.carForm.value['car_model_year'],
      this.carForm.value['car_color'],
      this.carForm.value['car_vin'],
       this.carForm.value['car_price'], this.carForm.value['car_availability'],);
    if (this.editMode) {

      this.store.dispatch(
        new carsActions.Updatecar({
          index: this.id,
          newcar: this.carForm.value
        })
      );
    } else {
      this.store.dispatch(new carsActions.Addcar(this.carForm.value));
    }
    this.onCancel();
  }



  onCancel() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  ngOnDestroy() {
 
  }

  private initForm() {
    let carName = '';
    let carColor = '';
    let carAvailability;
    let carModelYear;
  

    if (this.editMode) {
      this.storeSub = this.store
        .select('cars')
        .pipe(
          map(carState => {
            return carState.cars.find((car, index) => {
              return car.car_vin == this.id;
            });
          })
        )
        .subscribe(car => {
          carName = car.car;
          carColor = car.car_color;
          carAvailability = car.availability;
          carModelYear =car.car_model_year

        });
    }

    this.carForm = new FormGroup({
      name: new FormControl(carName, Validators.required),
      color: new FormControl(carColor, Validators.required),
      modelYear: new FormControl(carModelYear, Validators.required),
      availability: new FormControl(carAvailability, Validators.required),

    });
  }
}
