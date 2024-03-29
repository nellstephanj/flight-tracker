import {EventEmitter, Injectable} from '@angular/core';
import * as signalR from '@microsoft/signalr';
import * as signalRMsgPack from '@microsoft/signalr-protocol-msgpack';
import {FlightPath} from "../domain/FlightPath";

@Injectable({
  providedIn: 'root'
})
export class SignalRService {

  private readonly hubConnection: signalR.HubConnection;
  onMessageReceived = new EventEmitter<any>();

  constructor() {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:7038/track')
      .withHubProtocol(new signalRMsgPack.MessagePackHubProtocol())
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Trace)
      .build();
    this.startConnection();
  }

  startConnection = () => {
    this.hubConnection.start()
      .then(() => console.log(`Connection with Flight Tracking Hub started Hub Id ${this.hubConnection.connectionId}`))
      .catch(err => console.log(`Error while starting connection with Flight Tracking Hub: ${err}`));
  };
  addFlightListener = () => {
    this.hubConnection.on('sendFlightData', (flightPath: FlightPath) => {
      if (flightPath) {
        this.onMessageReceived.emit(flightPath);
      }
    })
  };
}
