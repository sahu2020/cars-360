import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import { LoggingService } from './logging.service';
import * as fromApp from './store/app.reducer';
import * as AuthActions from './auth/store/auth.actions';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  isAuthenticated = false;
  private userSub: Subscription;
  constructor(
    private store: Store<fromApp.AppState>,
    private loggingService: LoggingService
  ) {}

  ngOnInit() {
    this.userSub = this.store
      .select('auth')
      .pipe(map(authState => authState.user))
      .subscribe(user => {
        this.isAuthenticated = !!user;
        console.log(!user);
        console.log(!!user);
      });
    this.store.dispatch(new AuthActions.AutoLogin());

  }
}
