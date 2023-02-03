import { Component } from '@angular/core';
import * as Leaflet from "leaflet";

@Component({
  selector: 'app-world-map',
  templateUrl: './world-map.component.html',
  styleUrls: ['./world-map.component.scss']
})
export class WorldMapComponent {
  map!: Leaflet.Map;
  markers: Leaflet.Marker[] = [];
  options = {
    layers: [
      Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      })
    ],
    zoom: 3,
    center: { lat: 52.099912141, lng: 5.064885078 }
  }

  initMarkers() {
    const initialMarkers = [
      {
        position: { lat: 52.099912, lng: 5.064885 },
        draggable: false
      }
    ];
    for (let index = 0; index < initialMarkers.length; index++) {
      const data = initialMarkers[index];
      const marker = this.generateMarker(data, index);
      marker.addTo(this.map).bindPopup(`<b>${data.position.lat},  ${data.position.lng}</b>`);
      this.map.panTo(data.position);
      this.markers.push(marker)
    }
  }

  drawPolyLine(latlings: number[][], color: string){
    const polyline = Leaflet.polyline(latlings as [number, number][], {color: color});
    polyline.addTo(this.map)
  }

  generateMarker(data: any, index: number) {
    return Leaflet.marker(data.position, { draggable: data.draggable })
      .on('click', (event) => this.markerClicked(event, index))
      .on('dragend', (event) => this.markerDragEnd(event, index));
  }

  onMapReady($event: Leaflet.Map) {
    this.map = $event;
    this.initMarkers();

    const latlngs = [ [52.09991, 5.06488], [37.77, -79.43], [39.04, -85.2]];
    this.drawPolyLine(latlngs, "red");

    const latlngs2 = [ [50.09991, 5.06488], [35.77, -79.43], [34.04, -85.2]];
    this.drawPolyLine(latlngs2, "green");
  }

  //TODO: Add functionality to always have a marker at the last coordinate
  // TODO: See if you can have custom marker if not marker with plane?

  mapClicked($event: any) {
    console.log($event.latlng.lat, $event.latlng.lng);
  }

  markerClicked($event: any, index: number) {
    console.log($event.latlng.lat, $event.latlng.lng);
  }

  markerDragEnd($event: any, index: number) {
    console.log($event.target.getLatLng());
  }
}
