import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-car-start',
  templateUrl: './car-start.component.html',
  styleUrls: ['./car-start.component.scss']
})
export class carStartComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  getEmitCarVinId(event){
    console.log(event)
  }
}
