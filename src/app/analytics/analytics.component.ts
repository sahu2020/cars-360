import { Component, OnDestroy, OnInit } from '@angular/core';
import * as Highcharts from "highcharts";
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';
import { Subscription } from 'rxjs';

import * as fromApp from '../store/app.reducer';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.css']
})
export class AnalyticsComponent implements OnInit,OnDestroy {
  storeSub: Subscription;
  xAxis:number[]
  data:any;
  highcharts = Highcharts;
  chartOptions;
 
  constructor( private store: Store<fromApp.AppState>) { }
  ngOnDestroy(): void {
   this.storeSub.unsubscribe();
  }

  ngOnInit() {
    this.storeSub = this.store
    .select('cars')
   
    .subscribe(cars => {
      let years = [];
      for (var i = 0; i < cars.cars.length; i++) {
          years.push(cars.cars[i].car_model_year);   
      }
  
      let carNames = [];
      for (var i = 0; i < cars.cars.length; i++) {
          carNames.push(cars.cars[i].car);
      }
     
      this.chartOptions = {   
         chart: {
            type: 'bar'
         },
         title: {
            text: 'Car Model Bar chart'
         },
         subtitle : {
            text: 'No of model vs year'  
         },
         legend : {
            layout: 'vertical',
            align: 'left',
            verticalAlign: 'top',
            x: 250,
            y: 100,
            floating: true,
            borderWidth: 1,
            },
            xAxis:{
               categories: years, title: {
               text: null
            } 
         },
         series: [{
          data: carNames
      }],
  
         tooltip : {
            valueSuffix: ' millions'
         },
         plotOptions : {
            bar: {
               dataLabels: {
                  enabled: true
               }
            }
         }
      };
     let modelYears = cars.cars.map((car) => car.car_model_year);
     this.xAxis = modelYears.filter((c, index) => {
      return modelYears.indexOf(c) === index;
  })
    });

  }
  
 

}
