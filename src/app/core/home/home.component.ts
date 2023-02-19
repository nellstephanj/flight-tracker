import { Component } from '@angular/core';
import {SignalRService} from "../services/signal-r.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  constructor(
    public signalRService: SignalRService,
  ) {
    this.signalRService.startConnection();
    this.signalRService.addFlightListener();
  }
}
