import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AlertComponent } from './alert/alert.component';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';
import { PlaceholderDirective } from './placeholder/placeholder.directive';
import { DropdownDirective } from './dropdown.directive';
import { LoggingService } from '../logging.service';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
// import { TableComplete } from './table/table-complete';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HighchartsChartModule } from 'highcharts-angular';
import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
  declarations: [
    AlertComponent,
    LoadingSpinnerComponent,
    PlaceholderDirective,
    DropdownDirective,
    
  ],
  imports: [CommonModule,HighchartsChartModule ,DragDropModule,FormsModule],
  exports: [
    AlertComponent,
    LoadingSpinnerComponent,
    PlaceholderDirective,
    DropdownDirective,
    CommonModule,
    NgbModule,
    FormsModule,
    HttpClientModule,
    HighchartsChartModule,
    DragDropModule

  ],
  entryComponents: [AlertComponent],
  providers: [LoggingService]
})
export class SharedModule {}
