import { IonRating } from './../components/ion-rating/ion-rating';
import { OrderService } from './../providers/order/order.service';
import { ApiHelper } from './../config/global';
import { Network } from '@ionic-native/network';
import { DataServiceProvider } from './../providers/data-service/data-service';
import { GlobalServiceProvider } from './../providers/global-service/global-service';
import { AuthService } from './../providers/auth/auth-service';
import { NgModule, ErrorHandler } from '@angular/core';
import { Http, HttpModule } from '@angular/http';
import { FeedbackPage } from './../pages/feedback/feedback';
import { ChangePage } from './../pages/change/change';
import { SchedulePage } from './../pages/schedule/schedule';
import { SplashPage } from '../pages/splash/splash';
import { LoginPage } from '../pages/login/login';
import { ProfilePage } from '../pages/profile/profile';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { TaxiApp } from './app.component';
import { OrderPage } from '../pages/order/order';
import { HomePage } from '../pages/home/home';
import { IonicStorageModule } from '@ionic/storage';
import { MapComponent } from '../components/map/map';
import { Ionic2RatingModule } from 'ionic2-rating';
import { RideService } from '../providers/ride/ride.service';
import { GeocoderService } from '../providers/map/geocoder.service';
import { MapService } from '../providers/map/map.service';
import { TabsPage } from '../pages/tabs/tabs';
import { Splashscreen, StatusBar } from 'ionic-native';
import { CallNumber } from '@ionic-native/call-number';
import { BrowserModule } from '@angular/platform-browser';
import { Database } from '../providers/database';
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  GoogleMapOptions,
  CameraPosition,
  MarkerOptions,
  Marker
 } from '@ionic-native/google-maps';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { SMS } from '@ionic-native/sms';
import * as firebase from 'firebase';
import { BackgroundMode } from '@ionic-native/background-mode';
import { FCM } from '@ionic-native/fcm';
import { DirectPage } from '../pages/direct/direct';
// Initialize Firebase
export const config = {
  apiKey: 'AIzaSyDV5IIf5Y4TcyS1A6gmWkDL_NfuXb2hUYY',
  authDomain: 'armadamasuser.firebaseapp.com',
  databaseURL: 'https://armadamasuser.firebaseio.com',
  projectId: 'armadamasuser',
  storageBucket: 'armadamasuser.appspot.com',
  messagingSenderId: '235484651230'
};
firebase.initializeApp(config);

@NgModule({
  declarations: [
    LoginPage,
    TaxiApp,
    OrderPage,
    HomePage,
    MapComponent,
    TabsPage,
    ProfilePage,
    SplashPage,
    SchedulePage,
    ChangePage,
    FeedbackPage,
    IonRating,
    DirectPage
  ],
  imports: [
    IonicModule.forRoot(TaxiApp),
    Ionic2RatingModule,
    IonicStorageModule.forRoot({
      name: 'siradb',
      driverOrder: ['indexeddb', 'sqlite', 'websql'],
    }),
    BrowserModule,
    HttpModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    LoginPage,
    TaxiApp,
    OrderPage,
    HomePage,
    TabsPage,
    ProfilePage,
    SplashPage,
    SchedulePage,
    ChangePage,
    FeedbackPage,
    DirectPage
  ],
  providers: [
    OrderService,
    RideService,
    GeocoderService,
    MapService,
    Network,
    Splashscreen,
    StatusBar,
    SMS,
    CallNumber,
    ApiHelper,
    AuthService,
    GlobalServiceProvider,
    DataServiceProvider,
    FCM,
    BackgroundMode,
    Database,
    {provide: ErrorHandler, useClass: IonicErrorHandler}, ],
})
export class AppModule {
}

export function providers() {
  return [
  // LocationTracker,
    // User,
    // Api,
    // Items,

    // { provide: Settings, useFactory: provideSettings, deps: [ Storage ] },
    // // Keep this to enable Ionic's runtime error handling during development
    // { provide: ErrorHandler, useClass: IonicErrorHandler }
  ];
}
