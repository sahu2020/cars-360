import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { carsComponent } from './cars.component';
import { carDetailComponent } from './car-detail/car-detail.component';
import { carEditComponent } from './car-edit/car-edit.component';
import { carsRoutingModule } from './cars-routing.module';
import { SharedModule } from '../shared/shared.module';
import { carStartComponent } from './car-start/car-start.component';
import { TableComplete } from './table/table-complete';

@NgModule({
  declarations: [
    carsComponent,
    carDetailComponent,
    carStartComponent,
    carEditComponent,
    TableComplete
  ],
  imports: [
    RouterModule,
    ReactiveFormsModule,
    carsRoutingModule,
    SharedModule,
  ]
})
export class carsModule {}
