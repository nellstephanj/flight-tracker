import {EventEmitter, Injectable} from '@angular/core';
import * as signalR from '@microsoft/signalr';
import {FlightPath} from "../domain/FlightPath";

@Injectable({
  providedIn: 'root'
})
export class SignalRService {

  private readonly hubConnection: signalR.HubConnection;
  onMessageReceived = new EventEmitter<any>(); // TODO: readup

  constructor() {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:7038/track') // TODO: If a simple solution cannot be found create multiple hubs and allocated to people
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Trace)
      .build();
    this.startConnection();
  }

  startConnection = () => {
    this.hubConnection.start()
      .then(() => console.log(`Connection with Graph Information Hub started Hub Id ${this.hubConnection.connectionId}`))
      .catch(err => console.log(`Error while starting connection with Graph Information Hub: ${err}`));
  };

  stopConnection = () => {
    if (this.hubConnection) {
      this.hubConnection.stop().then(() => {
        console.log('Connection closed with Graph Information Hub');
      });
    }
  };

  addFlightListener = () => {
    this.hubConnection.on('sendFlightData', (flightPath: FlightPath) => {
      console.log(flightPath);
      this.onMessageReceived.emit(flightPath);
    })
  };
}
