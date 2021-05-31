import { DecimalPipe } from "@angular/common";
import { Component, EventEmitter, Output, QueryList, ViewChildren } from "@angular/core";
import { Observable } from "rxjs";
import { CarService } from "src/app/services/car.service";
import { NgbdSortableHeader, SortEvent } from "src/app/shared/directives/sortable.directives";
import { Car } from "src/app/shared/models/car.model";
import * as fromApp from '../../store/app.reducer';
import { Store } from '@ngrx/store';

@Component({
  selector: "ngbd-table-complete",
  templateUrl: "./table-complete.html",
  providers: [CarService, DecimalPipe],
})
export class TableComplete {
  
  cars$: Observable<Car[]>;
  total$: Observable<number>;
  @Output() emitCarVinID  = new EventEmitter<string>();

  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;

  constructor(public service: CarService,private store: Store<fromApp.AppState>) {
    
    this.cars$ = service.cars$;
    this.total$ = service.total$;
 
  }

  emitCarVinId(id:string){
    this.emitCarVinID.emit(id);
  }
  getDetails(id:string){
    console.log(id)
  }
  onSort({ column, direction }: SortEvent) {
    // resetting other headers
    this.headers.forEach((header) => {
      if (header.sortable !== column) {
        header.direction = "";
      }
    });

    this.service.sortColumn = column;
    this.service.sortDirection = direction;
  }
}
