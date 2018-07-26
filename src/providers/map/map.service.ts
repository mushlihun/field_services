import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Geolocation, Geoposition } from 'ionic-native';
import { MapConst } from './map.constants';
import {  } from 'googlemaps';
// import * as Map from 'googlemaps';
interface IMapOptions {
  lat: number;
  lon: number;
  zoom: number;
}

@Injectable()
export class MapService {
  public gmarkers: any = [];
  private map: google.maps.Map = null;
  private directionsDisplay: any;
  private infoWindow: google.maps.InfoWindow = null;
  private apiKey: string = 'AIzaSyDV5IIf5Y4TcyS1A6gmWkDL_NfuXb2hUYY' ;
  constructor() {
  }
  public createMap(mapEl: Element, opts: IMapOptions = {
    lat: MapConst.DEFAULT_LAT,
    lon: MapConst.DEFAULT_LNG,
    zoom: MapConst.DEFAULT_ZOOM,
  }): Promise<google.maps.Map> {

    return this.loadMap().then(() => {
      const myLatLng = new google.maps.LatLng(opts.lat, opts.lon);
      const styleArray = [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [
            {visibility: 'off'}
          ]
        }
      ];
      const directionsDisplay = new google.maps.DirectionsRenderer;
      const mapOptions: google.maps.MapOptions = {
        zoom: opts.zoom,
        minZoom: opts.zoom,
        center: myLatLng,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        disableDefaultUI: true,
        scaleControl: false,
        // styles: styleArray,
        zoomControl: false,
        zoomControlOptions: {
        // position: google.maps.ControlPosition.BOTTOM_CENTER
        }
      };
      this.directionsDisplay = new google.maps.DirectionsRenderer;
      this.map = new google.maps.Map(mapEl, mapOptions);
      return this.map;
    });
  }
  public addMarkersToMap(lat, lng) {
    let gmarkers = [];
    let position = new google.maps.LatLng(lat, lng);
    let addMarker = new google.maps.Marker({
      animation: google.maps.Animation.DROP,
      position: position,
      icon: {url: 'assets/icon/target.png'}
    });
    console.log('marker');
    return addMarker.setMap(this.map);
    // gmarkers.push.apply(addMarker);
}
public removeMarker() {
    let gmarkers = [];
    for (let i = 0; i < this.gmarkers.length; i++) {
      gmarkers[i].setMap(null);
  }
}
  public directions(response, opts: IMapOptions = {
    lat: MapConst.DEFAULT_LAT,
    lon: MapConst.DEFAULT_LNG,
    zoom: MapConst.DEFAULT_ZOOM,
  }): Promise<google.maps.Map> {
    // const myLatLng = new google.maps.LatLng(opts.lat, opts.lon);
    // this.map = new google.maps.Map(this.mapElement, {
    //   zoom: 7,
    //   center: myLatLng,
    // });
    // this.directionsDisplay = new google.maps.DirectionsRenderer;
    this.directionsDisplay.setOptions({
      suppressMarkers: true,
    //   markerOptions: {
    //   icon: {url: 'assets/icon/icon_pickup.png'},
    // },
      polylineOptions: {
        strokeColor: 'blue'
      },
      map: this.map,
    });
    this.directionsDisplay.setDirections(response);
    // this.map.getCenter();
    return this.directionsDisplay.setMap(this.map);
  }
public createMarker(position) {
    let marker = new google.maps.Marker({
        position: position,
        map: this.map,
        icon: { url: 'assets/icon/target.png'},
    });
    console.log('marker1', marker);
    // return marker.setMap(this.map);
}
public createMarker1(position) {
  let marker = new google.maps.Marker({
      position: position,
      map: this.map,
      icon: {url: 'assets/icon/icon_pickup.png'},
  });
  console.log('marker2', marker);
}

  /**
   * return the coordinates of the center of map
   * @returns {LatLng}
   */
  public get mapCenter(): google.maps.LatLng {
    return this.map.getCenter();
  }

  public set mapCenter(location: google.maps.LatLng) {
    this.map.setCenter(location);
  }
  /***
   * return map html element
   * @returns {Element}
   */
  public get mapElement(): Element {
    return this.map.getDiv();
  }

  /***
   * create an infoWindow and display it in the map
   * @param content - the content to display inside the infoWindow
   * @param position
   */
  public createInfoWindow(content: string, position: google.maps.LatLng): void {
    this.closeInfoWindow();
    const opt: google.maps.InfoWindowOptions = {
      content,
      position,
      pixelOffset: new google.maps.Size(0, -50),
      disableAutoPan: true
    };
    this.infoWindow = new google.maps.InfoWindow(opt);
    setTimeout(() => this.infoWindow.open(this.map), 100);
  }

  /***
   * close the current infoWindow
   */
  public closeInfoWindow(): void {
    if (this.infoWindow) {
      this.infoWindow.close();
    }
  }

  /***
   * create Place Autocomplete
   * ref: https://developers.google.com/maps/documentation/javascript/examples/places-autocomplete
   * @param addressEl
   * @returns {Observable}
   */
  public createAutocomplete(addressEl: HTMLInputElement): Observable<any> {
    const autocomplete = new google.maps.places.Autocomplete(addressEl);
    autocomplete.bindTo('bounds', this.map);
    return new Observable((sub: any) => {
      google.maps.event.addListener(autocomplete, 'place_changed', () => {
        const place = autocomplete.getPlace();
        if (!place.geometry) {
          sub.error({
            message: 'Autocomplete returned place with no geometry'
          });
        } else {
          sub.next(place.geometry.location);
          sub.complete();
        }
      });
    });
  }

  /***
   * set map position and the relative center and zoom
   * @returns {Promise<google.maps.LatLng>}
   */
  public setPosition(): Promise<google.maps.LatLng> {
    console.log('masuksetposition');
    return this.getCurrentPosition().then((coords: Coordinates) => {
      console.log('masuksetposition1');
      if (!coords) {
        console.warn('invalid coordinates: ', coords);
        console.log('masuksetposition2');
        return null;
      }
      console.log('masuksetposition3');
      const myLatLng = new google.maps.LatLng(coords.latitude, coords.longitude);
      this.map.setCenter(myLatLng);
      this.map.setZoom(MapConst.MAX_ZOOM);
      return this.mapCenter;
    });
  }

  /***
   * trigger map resize event
   */
  public resizeMap(): void {
    if (this.map) {
      google.maps.event.trigger(this.map, 'resize');
    }
  }

  /***
   * google map place searches
   * @returns {Observable}
   */
  public loadNearbyPlaces(): Observable<any> {
    const position: google.maps.LatLng = this.mapCenter;

    const placesService = new google.maps.places.PlacesService(this.map);
    const request: google.maps.places.PlaceSearchRequest = {
      location: position,
      radius: 500
    };

    return new Observable((sub: any) => {
      placesService.nearbySearch(request, (results, status) => {
        const _nearbyPlaces: Array<any> = [];
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          for (let i = 0; i < results.length; i++) {
            const place: any = results[i];
            const distance: number =
              google.maps.geometry.spherical.computeDistanceBetween(position, place.geometry.location);
            place.distance = distance.toFixed(2);
            _nearbyPlaces.push(place);
          }
          sub.next(_nearbyPlaces);
          sub.complete();
        } else {
          sub.error({
            message: `Invalid response status from nearbySearch : ${status}`
          });
        }
      });
    });
  }

  /***
   * Load Google Map Api in async mode
   * @returns {Promise}
   */
  private loadMap(): Promise<any> {
    return new Promise((resolve: Function, reject: Function) => {
      if ((<any>window).google && (<any>window).google.maps) {
        resolve();
      } else {
        this.loadGoogleMapApi().then(() => resolve()).catch(reason => {
          reject(reason);
        });
      }
    });
  }

  /***
   * get the current location using Geolocation cordova plugin
   * @param maximumAge
   * @returns {Promise<Coordinates>}
   */
  private getCurrentPosition(maximumAge: number = 10000): Promise<Coordinates> {
    console.log('getcurrent');
    const options = {
      timeout: 10000,
      enableHighAccuracy: true,
      maximumAge
    };
    return Geolocation.getCurrentPosition(options).then((pos: Geoposition) => {
      console.log('Geolocation');
      return pos.coords;
    });
  }

  /***
   * Create a script element to insert into the page
   * @returns {Promise}
   * @private
   */
  private loadGoogleMapApi(): Promise<any> {
    const _loadScript = () => {
      const script = document.createElement('script');
      // tslint:disable-next-line:max-line-length
      // script.src = `https://maps.googleapis.com/maps/api/js?libraries=places,geometry&language=it&components=country:IT&callback=initMap`;
      script.src =
      // tslint:disable-next-line:max-line-length
      `https://maps.googleapis.com/maps/api/js?key=AIzaSyDV5IIf5Y4TcyS1A6gmWkDL_NfuXb2hUYY&libraries=places,geometry&language=it&components=country:IT&callback=initMap`;
      // `https://maps.googleapis.com/maps/api/js?key=AIzaSyDV5IIf5Y4TcyS1A6gmWkDL_NfuXb2hUYY&libraries=places,geometry&language=it&components=country:IT&callback=initMap`;
      // if (this.apiKey) {
      //   script.src = 'http://maps.google.com/maps/api/js?key=' + this.apiKey + '&callback=mapInit';
      // } else {
        // tslint:disable-next-line:max-line-length
      //   script.src = 'http://maps.google.com/maps/api/js?libraries=places,geometry&language=it&components=country:IT&callback=mapInit';
      // }
      script.type = 'text/javascript';
      script.async = true;
      const s = document.getElementsByTagName('script')[0];
      s.parentNode.insertBefore(script, s);
    };

    return new Promise((resolve: Function) => {
      (<any>window).initMap = () => {
        return resolve();
      };
      _loadScript();
    });
  }
}
