
import { Component } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { environment } from 'src/environments/environment';
import {Idle, DEFAULT_INTERRUPTSOURCES} from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';
import { InversoresDataSource } from '../../model/datasource/inversores.datasource';
import { InversorService } from '../../services/inversor.service';

@Component({
  selector: 'app-main-home',
  templateUrl: './main-home.component.html',
  styleUrls: ['./main-home.component.scss']
})
export class MainHomeComponent {

  idleState = 'Not started.';
  timedOut = false;
  lastPing?: Date = null;
  counter?: number;
  dataSource: InversoresDataSource;

  // Example array to be used by chart. This array should be returned by a backend method, with the necessary information
  saleData = [
    { name: "Enero", value: this.calcular() },
    { name: "Febrero", value: 55000 },
    { name: "Marzo", value: 15000 },
    { name: "Abril", value: 150000 },
    { name: "Mayo", value: 20000 }
  ];
  //MG prueba
  calcular():any{
  //cuantos X hay en un peridodo de tiempo

return 45550;


  }
  constructor(private idle: Idle, private keepalive: Keepalive, private authService: AuthService, private investorService: InversorService) {

   //console.log('Counter:  ',this.counter = inversoresDataSource.totalElements);
   this.dataSource = new InversoresDataSource(this.investorService);
this.counter = this.dataSource.totalElements;

   console.log(this.dataSource.totalElements);

    // sets an idle timeout of X seconds, for testing purposes.
    idle.setIdle(environment.idle);
    // sets a timeout period of Y seconds. after X+Y seconds of inactivity, the user will be considered timed out.
    idle.setTimeout(environment.idleTimeout);
    // sets the default interrupts, in this case, things like clicks, scrolls, touches to the document
    idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

    idle.onIdleEnd.subscribe(() => this.idleState = 'No longer idle.');
    idle.onTimeout.subscribe(() => {
      this.idleState = 'Timed out!';
      this.timedOut = true;

      this.authService.redirectLoginSessionExpiration();
    });
    idle.onIdleStart.subscribe(() => this.idleState = 'You\'ve gone idle!');
    idle.onTimeoutWarning.subscribe((countdown) => {
      this.idleState = 'You will time out in ' + countdown + ' seconds!';
    });

    // sets the ping interval to 15 seconds
    keepalive.interval(environment.idlePingInterval);

    keepalive.onPing.subscribe(() => this.lastPing = new Date());

    this.reset();

  }

  reset() {
    this.idle.watch();
    this.idleState = 'Started.';
    this.timedOut = false;

  }
 }
