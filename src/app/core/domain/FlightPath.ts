import {Coordinate} from "./Coordinate";

// Note with signalRMsgPack MessagePack is case-sensitive https://learn.microsoft.com/en-us/aspnet/core/signalr/messagepackhubprotocol?view=aspnetcore-7.0#messagepack-is-case-sensitive
export class FlightPath{
  AirlineName: string = "defaultAirline";
  FlightPathCoordinates: Coordinate[] = [];
  LineColour: string = "red"
}
