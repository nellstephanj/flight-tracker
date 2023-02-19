import {Component, OnInit} from '@angular/core';
import * as Leaflet from "leaflet";
import {SignalRService} from "../services/signal-r.service";
import {FlightPath} from "../domain/FlightPath";
import {Marker} from "leaflet";

@Component({
  selector: 'app-world-map',
  templateUrl: './world-map.component.html',
  styleUrls: ['./world-map.component.scss']
})
export class WorldMapComponent implements OnInit {
  map!: Leaflet.Map;
  markers: Leaflet.Marker[] = [];
  iconUrl: string = '../../assets/plane.webp'
  flightMarkers = new Map();
  options = {
    layers: [
      Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      })
    ],
    zoom: 3,
    center: {lat: 52.099912141, lng: 5.064885078}
  }

  planeIcon = Leaflet.icon({
    iconUrl: this.iconUrl,
    iconSize:     [30, 20], // size of the icon
    iconAnchor:   [10, 10], // point of the icon which will correspond to marker's location
    popupAnchor:  [0, 5] // point from which the popup should open relative to the iconAnchor
  });

  constructor(private signalRService: SignalRService) {

  }

  ngOnInit(): void {
    this.signalRService.onMessageReceived.subscribe((flightPath: FlightPath) => {
      const latlngs: number[][] = [[]]
      if (flightPath.flightPathCoordinates.length > 0) {
        latlngs.pop();
      }
      Object.entries(flightPath.flightPathCoordinates).forEach(([, coordinate]) => {
        latlngs.push([coordinate.latitude, coordinate.longitudes])
      });

      this.drawPolyLine(latlngs, flightPath.lineColour);

      let lastCor = latlngs.pop()
      if (lastCor) {
        this.setPlaneIcon(lastCor, flightPath);
      }
    });
  }

  private setPlaneIcon(lastCor: number[], flightPath: FlightPath) {
    const data = [
      {
        position: {lat: lastCor[0], lng: lastCor[1]},
        draggable: false
      }
    ];
    const marker = this.generateMarker(data[0], this.markers.length + 1);
    this.markers.push(marker);
    this.removeMarker(this.flightMarkers.get(flightPath.airlineName))
    this.flightMarkers.set(flightPath.airlineName, marker);
    marker.addTo(this.map).bindPopup(`<b>${flightPath.airlineName}</b>`);
  }

  drawPolyLine(latlings: number[][], color: string) {
    const polyline = Leaflet.polyline(latlings as [number, number][], {color: color});
    polyline.addTo(this.map)
  }

  generateMarker(data: any, index: number): Marker {
    const marker = Leaflet.marker(data.position, {draggable: data.draggable})
      .on('click', (event) => this.markerClicked(event, index))
    marker.setIcon(this.planeIcon);
    return marker
  }

  removeMarker(marker: Marker) {
    if (marker) {
      this.map.removeLayer(marker)
    }
  }

  onMapReady($event: Leaflet.Map) {
    this.map = $event;
  }

  markerClicked($event: any, index: number) {
    console.log($event.latlng.lat, $event.latlng.lng);
  }
}
