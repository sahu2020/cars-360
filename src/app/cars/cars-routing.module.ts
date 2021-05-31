import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { carsComponent } from './cars.component';
import { AuthGuard } from '../auth/auth.guard';
import { carEditComponent } from './car-edit/car-edit.component';
import { carDetailComponent } from './car-detail/car-detail.component';
import { carsResolverService } from './cars-resolver.service';
import { carStartComponent } from './car-start/car-start.component';

const routes: Routes = [
  {
    path: '',
    component: carsComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', component: carStartComponent },
      { path: 'new', component: carEditComponent },
      {
        path: ':id',
        component: carDetailComponent,
        resolve: [carsResolverService],
      },
      {
        path: ':id/edit',
        component: carEditComponent,
        resolve: [carsResolverService]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class carsRoutingModule {}
