import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {LeafletModule} from "@asymmetrik/ngx-leaflet";
import { WorldMapComponent } from './core/world-map/world-map.component';
import {RouterModule} from "@angular/router";
import { HomeComponent } from './core/home/home.component';

@NgModule({
  declarations: [
    AppComponent,
    WorldMapComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    LeafletModule,
    AppRoutingModule,
    RouterModule.forRoot([
      {path: '', component: HomeComponent, pathMatch: 'full'},
    ]),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
