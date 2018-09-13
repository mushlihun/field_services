import { DirectPage } from './../direct/direct';
import { AuthService } from './../../providers/auth/auth-service';
import { BackgroundMode } from '@ionic-native/background-mode';
import { FCM } from '@ionic-native/fcm';
import { OrderModel } from '../../providers/order/order.model';
import { OrderService } from '../../providers/order/order.service';
import { DataServiceProvider } from './../../providers/data-service/data-service';
import { Storage } from '@ionic/storage';
import { TabsPage } from './../tabs/tabs';
import { FeedbackPage } from './../feedback/feedback';
import { SchedulePage } from './../schedule/schedule';
import { Component, ElementRef, ViewChild, NgZone, Renderer } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MapComponent } from '../../components/map/map';
import { Vibration } from 'ionic-native';
import { MapService } from '../../providers/map/map.service';
import { LoadingController, ViewController, AlertController, ModalController,
         NavController, Platform, DateTime } from 'ionic-angular';
import { GeocoderService } from '../../providers/map/geocoder.service';
import { Geolocation } from '@ionic-native/geolocation';
import { BasePage } from '../base-page';
import { CallNumber } from '@ionic-native/call-number';
import { RideModel } from '../../providers/ride/ride.model';
import { RideService } from '../../providers/ride/ride.service';
import { GlobalServiceProvider } from '../../providers/global-service/global-service';
import { MAX_LENGTH_VALIDATOR } from '@angular/forms/src/directives/validators';
import { dateDataSortValue } from 'ionic-angular/util/datetime-util';
import { SMS } from '@ionic-native/sms';
declare var google: any;
declare var window;
@Component({
  templateUrl: 'home.tpl.html',
  providers: [AuthService, DataServiceProvider]
})
export class HomePage extends BasePage {
  @ViewChild('map') mapElement: ElementRef;
  // @ViewChild('destination', {read: ElementRef}) destination: ElementRef;
  @ViewChild('searchbar', {read: ElementRef}) searchbar: ElementRef;
  form: FormGroup;
  position: google.maps.LatLng;
  departure: any;
  departures: string = null;
  destination: string = null;
  destinations: any = null;
  start = 'chicago, il';
  end = 'chicago, il';
  ordered = 'checked';
  localized: boolean = false;
  orderTowait: boolean = true;
  waiting: boolean = false;
  onSuccess: boolean = false;
  ontrips: boolean = false;
  oneclick: boolean= false;
  onstart: any;
  endtrip: boolean = false;
  isLoggedIn: boolean = false;
  returningUser: boolean = false;
  distances: any;
  driversmileage: any = [];
  driverdistance: any = [];
  assignedIndex: any;
  backupIndex: any;
  driverCounter: any;
  directionsService: any;
  directionsDisplay: any;
  driver: any;
  drivers: any;
  driverid: any;
  iddriver: any;
  drivername: any;
  gender: any;
  availableDrivers: any = [];
  availableDrivers2: any;
  title: any;
  jarak: any;
  seconds: any;
  driverlatitude: any;
  driverlongitude: any;
  deplat: any;
  deplng: any;
  deslat: any;
  deslng: any;
  tokenuser: any;
  acctoken: any;
  time: any;
  calldriver: any;
  callno: any;
  // tslint:disable-next-line:variable-name
  passenger_id: any;
  // tslint:disable-next-line:variable-name
  driver_id: any;
  note: any = [];
  status: any ;
  statustrip: any;
  tokenid: any;
  tokenfcm: any;
  fcmtoken: any;
  tripstart: any;
  tripend: any;
  datapoint: any = [];
  waypointid: any;
  latlng: any;
  pushnot: any = [];
  tokendriver: any;
  userid: any;
  tripid: any;
  tripsid: any;
  trip: any = [];
  information: any;
  searchs: any;
  searched: any;
  siteid: any;
  qsearch: any;
  searchQuery: any;
  waktu: any;
  iduser: any;
  eta: any;
  public onstarted: any = 'onwaiting';
  public nearbyPlaces: Array<any> = [];
  public number: any;
  public plat: any;
  public plate: any;
  private addressElement: HTMLInputElement = null;
  private showposition: any;
  // private directionsService: google.maps.DirectionsService;
  // private directionsDisplay: google.maps.DirectionsRenderer;
  // let directionsService = new google.maps.DirectionsService;
  // let directionsDisplay = new google.maps.DirectionsRenderer;
  private map: google.maps.Map = null;
  constructor(private fb: FormBuilder,
              public auth: AuthService,
              private zone: NgZone,
              private platform: Platform,
              public dataservice: DataServiceProvider,
              private nav: NavController,
              private geocoderService: GeocoderService,
              private mapService: MapService,
              private modalCtrl: ModalController,
              private loadingCtrl: LoadingController,
              protected alertCtrl: AlertController,
              private callNumber: CallNumber,
              private rideService: RideService,
              private orderService: OrderService,
              private viewCtrl: ViewController,
              private renderer: Renderer,
              private backgroundMode: BackgroundMode,
              private globalService: GlobalServiceProvider,
              private fcm: FCM,
              private smsVar: SMS,
              public storage: Storage) {
    super(alertCtrl);
  }
  ionViewWillEnter() {
    this.isOrdered();
    this.isFinishorderd();
    // this.isOnwaiting();
    this.backgroundMode.enable();
    if (typeof FCMPlugin !== 'undefined') {
    this.fcm.getToken().then(token => {
    console.log('tokenfcm', token);
    Promise.all([this.storage.get('access_token'), this.storage.get('user_id')]).then((res) => {
    console.log(res);
    this.tokenid = res[0];
    this.userid = res[1];
    });
    this.tokenfcm = token;
    let tokenfcm = token;
    this.fcmtoken = {
          user: {
          token : tokenfcm
              }
          // tslint:disable-next-line:semicolon
          }
    console.log('update token', this.fcmtoken);
        // tslint:disable-next-line:no-shadowed-variable
    this.auth.updatetokenFCm(this.tokenid, this.userid, this.fcmtoken).subscribe((res) => {
    console.log('update status1', res);
    this.storage.set('tokenfcm', res.token);
    console.log('hasil update token = ' + res.token);
      }, (err) => {
    console.log('gagal update token', err);
      });
    this.fcm.onNotification().subscribe(data => {
    console.log('tes:' + JSON.stringify(data));
    this.storage.set('datafcm', data);
    let status = '';
    for (let key in data) {
    if (key === 'status') {
        status = data[key];
        }
      }
    if (status === 'onstart') {
    this.onstarte('ontransport');
    console.log('jalan onstarte1');
      } else if (status ===  'oncompleted') {
    this.oncompleted();
    console.log('jalan oncompleted1');
      }
    console.log('tes:' + data.wasTapped);
    if (data.wasTapped) {
      console.log('Received in background');
      let status = '';
      for (let key in data) {
      if (key === 'status') {
          status = data[key];
          }
        }
      if (status === 'onstart') {
      this.onstarte('ontransport');
      console.log('jalan onstarte2');
        } else if (status ===  'oncompleted') {
      this.oncompleted();
      console.log('jalan oncompleted2');
        }
      } else {
      let status = '';
      for (let key in data) {
      if (key === 'status') {
          status = data[key];
          }
        }
      if (status === 'onstart') {
      this.onstarte('ontransport');
      console.log('jalan onstarte3');
        } else if (status ===  'oncompleted') {
      this.oncompleted();
      console.log('jalan oncompleted3');
        }
      console.log('Received in foreground');
        }
          });
        });
      }
  }
  ionViewDidLoad() {
  }
  isOrdered() {
    console.log('this.isOrdered(homepage);');
    this.storage.get('ordered').then((ordered) => {
    console.log('isOrdered(homepage);', ordered);
    if (ordered === true) {
      this.isOnwaiting();
      console.log('masuk halaman direct1');
     } else if (ordered === null) {
      console.log('tidak order');
          }
      });
    }
  isOnwaiting() {
    console.log('this.isOnwaiting();');
    Promise.all([this.storage.get('access_token'), this.storage.get('user_id')]).then((res) => {
      this.tokenid = res[0];
      this.userid = res[1];
    });
    this.storage.get('waypointid').then((waypointid) => {
    if (waypointid === null) {
    console.log('waypointid kosong');
    } else {
    this.orderTowait = false;
    this.onSuccess = true;
    // this.storage.get('statustrip').then((tripstatus) => {
    this.dataservice.waypointx(this.tokenid, waypointid).subscribe((datas) => {
    this.departures = datas.waypoint.pickup_location;
    this.destination = datas.waypoint.dropoff_location;
    this.directionsService = new google.maps.DirectionsService;
    console.log('origin : ' + this.departures);
    console.log('destination : ' + this.destination);
    this.directionsService.route({
      origin: this.departures,
      destination: this.destination,
      travelMode: 'DRIVING'
    }, (response, status) => {
      console.log(response);
      // if (status === 'OK') {
      if (status === google.maps.DirectionsStatus.OK) {
        console.log('data distance', response.routes[0].legs[0].distance);
        console.log('data duration', response.routes[0].legs[0].duration);
        let vtimes = response.routes[0].legs[0].duration.value;
        this.getEstimatedTimeOfArrival2(vtimes);
        console.log('distancesssss', vtimes);
        console.log('distancesssss', vtimes);
        let route = response.routes[0].legs[0];
        // this.mapService.createMarker(route.start_location);
        this.mapService.createMarker1(route.end_location);
        this.mapService.directions(response);
      } else {
        // window.alert('Directions request failed due to ' + status);
      }
    });
  });
    this.storage.get('wpickup_location').then((wpickup) => {
    this.departure = wpickup;
    });
    this.storage.get('wdropoff_location').then((wdropoff) => {
    this.destination = wdropoff;
    });
    this.storage.get('drivername').then((name) => {
    console.log('name : ' + name);
    this.drivername = name;
    });
    this.storage.get('gender').then((genders) => {
    this.gender = genders;
    if (this.gender === 'Male') {
      this.title = 'Mr.';
    } else {
      this.title = 'Mrs.';
    }
  });
    this.storage.get('noted').then((noted) => {
      console.log('noted : ' + noted);
      this.note = noted;
    });
    this.storage.get('waktus').then((waktus) => {
      console.log('waktus : ' + waktus);
      this.waktu = waktus;
    });
    this.storage.get('plates').then((plates) => {
      console.log('plates : ' + plates);
      this.plate = plates;
    });
    this.storage.get('tripid').then((tripid) => {
      console.log('tripid isOnwaiting: ' + tripid);
      this.trip = tripid;
    });
    this.dataservice.trip(this.tokenid, this.trip).subscribe((data) => {
      console.log('data trip di waiting : ' + data.trip);
      let tripstatus = data.trip.status;
      if (tripstatus === 'ontransport') {
        this.onstarted = 'ontransport';
        console.log('lagi dijalan', tripstatus);
      } else if (tripstatus === 'oncompleted') {
        console.log('udh masuk ke feedback', tripstatus);
        this.oncompleted();
      } else if (tripstatus === 'onwaiting') {
        console.log('masih nunggu driver', tripstatus);
        this.nav.push(DirectPage);
      }
    });

  } // else waypoint ada
      });
    this.storage.get('waypointid').then((waypointid) => {
    if (waypointid === null) {
    console.log('waypointid kosong tetap di tabspage');
    } else {
    console.log('masuk halaman direct');
    this.nav.push(DirectPage);
  }
      });
  }
  isFinishorderd() {
  Promise.all([this.storage.get('access_token'), this.storage.get('user_id')]).then((res) => {
    this.tokenid = res[0];
    this.userid = res[1];
  });
  this.storage.get('feedbackPage').then((feedback) => {
  console.log('masuk ke feedback isFinishorderd: ' + feedback);
  if (feedback === true) {
  this.nav.push(FeedbackPage);
  } else if (feedback === null) {
    console.log('tidak ada feedback', feedback);
  }
  });
  this.storage.get('tripid').then((tripid) => {
  console.log('masuk ke feedback isFinishorderd: tripid : ' + tripid);
  if (tripid === null) {
  console.log('stay aja : ' + tripid);
  } else if (tripid !== null) {
    this.storage.get('access_token').then((res) => {
      this.tokenid = res;
    });
    this.dataservice.trip(this.tokenid, tripid).subscribe((data) => {
    console.log('data trip di isFinishorderd : ' + JSON.stringify(data));
    this.statustrip = data.trip.status;
    console.log('statustrip', this.statustrip);
    // this.tripsid = data.trip.id;
    if (this.statustrip === 'oncompleted' ) {
      console.log('go feedback isFinishorderd : ' + tripid);
      this.nav.push(FeedbackPage);
    } else if (this.statustrip === 'ontransport' ) {
      this.onstarted = 'onstarted';
      console.log('stay aja isFinishorderd : ' + tripid);
    } else if (this.statustrip === 'onwaiting') {
      console.log('masih nunggu driver', this.statustrip);
      this.nav.push(DirectPage);
    }
  }, (err) => {
    console.log(err);
  });
  }
  });
  }
  ionViewDidEnter() {
  }
  /***
   * This event is fired when map has fully loaded
   */
  onMapReady(): Promise<any> {
    // I must wait platform.ready() to use plugins ( in this case Geolocation plugin ).
    return this.platform.ready().then(() => {
      return this.locate().then(() => {
        this.position = this.mapService.mapCenter;
        if (this.position) {
          this.deplat = this.position.lat();
          this.deplng = this.position.lng();
          this.mapService.addMarkersToMap(this.position.lat(), this.position.lng());
          this.geocoderService.addressForlatLng(this.position.lat(), this.position.lng())
          .subscribe((address: string) => {
          this.departure = address;
          console.log('departure' + this.position);
            }, (error) => {
              this.displayErrorAlert();
              console.error(error);
            });
          // let cobamaps = new google.maps.Latlng(59.33, 18.05);
          // this.mapService.createMarker(59.33, 18.05);
          console.log('data', this.deplat, this.deplng);
        }
        // this.mapService.removeMarker(this.position);
        this.keberangkatan();
        // this.initAutocomplete();
        const mapElement: Element = this.mapService.mapElement;
        if (mapElement) {
          mapElement.classList.add('show-map');
          this.mapService.resizeMap();
        }
      });
    });
  }

  /***
   * This event is fired when the map becomes idle after panning or zooming.
   */
  onMapIdle(): void {
    if (!this.localized) return;
    const position = this.mapService.mapCenter;
    this.geocoderService.addressForlatLng(position.lat(), position.lng())
      .subscribe((address: string) => {
        const content = `<div padding><strong>${address}</strong></div>`;
        this.mapService.createInfoWindow(content, position);
      }, (error) => {
        this.displayErrorAlert();
        console.error(error);
      });
  }

  /***
   * This event is fired when the user starts dragging the map.
   */
  onDragStart(): void {
    this.mapService.closeInfoWindow();
    this.position = this.mapService.mapCenter;
    if (this.position) {
      this.geocoderService.addressForlatLng(this.position.lat(), this.position.lng())
        .subscribe((address: string) => {
          this.destination = address;
          // this.mapService.addMarkersToMap(this.position.lat(), this.position.lng());
          // this.calculateAndDisplayRoute(desti);
        }, (error) => {
          this.displayErrorAlert();
          console.error(error);
        });
    }
  }

keberangkatan(): void {
  this.position = this.mapService.mapCenter;
  if (this.position) {
    this.deplat = this.position.lat();
    this.deplng = this.position.lng();
    this.geocoderService.addressForlatLng(this.position.lat(), this.position.lng())
        .subscribe((address: string) => {
        this.initAutocomplete();
        this.departure = address;
        console.log('departure' + this.position);
          }, (error) => {
            this.displayErrorAlert();
            console.error(error);
          });
      }
}
  // tslint:disable-next-line:max-line-length
  direct(orderTowait: boolean, onSuccess: boolean, ontrips: boolean, endtrip: boolean, oneclick: boolean) {
    this.presentRouteLoader('Tunggu sebentar ...');
    if (this.destination !== null) {
    this.fcmtoken = {
      user: {
      token : this.tokenfcm
          }
      // tslint:disable-next-line:semicolon
      }
    console.log('update token2', this.fcmtoken);
    this.auth.updatetokenFCm(this.tokenid, this.userid, this.fcmtoken).subscribe((res) => {
    console.log('update status2', res);
    this.storage.set('tokenfcm', res.token);
    console.log('hasil update token2 = ' + res.token);
      }, (err) => {
    console.log('gagal update token', err);
      });
    console.log('telah waiting');
    // this.getassignedDriver();
    this.getAvailableDrivers();
} else {
    let confirm = this.alertCtrl.create({
      title: 'Peringatan!',
      message: 'Apakah anda yakin sudah mengisi perjalanan anda? Klik Ok untuk mengisi tujuan?',
      buttons: [
        {
          text: 'Ok',
          handler: () => {
            console.log('Isi tujuan');
          }
        }
      ]
    });
    confirm.present();
  }

}
directs() {
  let eta = 630;
  this.getEstimatedTimeOfArrival(eta);
  let times = this.getEstimatedTimeOfArrival(eta);
  console.log('times', times);
  this.waktu = times;
}

waypoint(datapoint) {
  console.log('datapoint', JSON.stringify(datapoint));
  this.dataservice.waypoint(this.tokenid, datapoint).subscribe((waypoints) => {
    console.log('hasil create waypoint', waypoints);
    this.waypointid = waypoints.id;
    this.storage.set('waypointid', waypoints.id);
    this.storage.set('wpickup_location', waypoints.pickup_location);
    this.storage.set('wdropoff_location', waypoints.dropoff_location);
    this.pushnot = {
        'payloads[a]' : '',
        'notification[title]' : '',
        'notification[body]' : '',
        'notification[sound]' : '',
        'payloads[title]' : 'Order',
        'payloads[message]' : '',
        'payloads[trip_id]' : this.tripid,
        'payloads[passenger_id]' : this.userid,
        'payloads[driver_id]' : this.driverid,
        'payloads[information]' : this.note,
        'payloads[pickup_location]' : this.departure,
        'payloads[pickup_lat]' : this.position.lat(),
        'payloads[pickup_lng]' : this.position.lng(),
        'payloads[dropoff_location]' : this.addressElement.value,
        'payloads[dropoff_lat]' : this.deslat,
        'payloads[dropoff_lng]' : this.deslng,
        'payloads[status]' : 'ondispatch',
        'payloads[b]' : ''
      };
  }, (err) => {
    console.log(err);
  });
}
pushnotif(pushnot) {
  console.log('push' + JSON.stringify(pushnot));
  console.log('this.note' + this.note);
  console.log('tokendriver', this.tokendriver);
  this.dataservice.push(this.tokenid, pushnot, this.tokendriver).subscribe((pushdata) => {
  console.log('pushdata', pushdata);
  }, (err) => {
  console.log('pushnotif', err);
  });
}
getAvailableDrivers() {
  // filterarray berupa status
  this.storage.get('access_token').then((res) => {
    this.auth.getDriver(res).subscribe((data) => {
      console.log('getAvailableDrivers', data);
      console.log('getAvailableDrivers', data.drivers);
      if (data.drivers.length === 0) {
        this.drivernot();
        this.globalService.toastInfo('Belum ada driver tersedia', 3000, 'top');
      } else if (data.drivers.length > 0) {
      this.driverid = data.drivers[0].user_id;
      this.iddriver = data.drivers[0].id;
      this.status = data.drivers[0].status;
      this.jarak = data.drivers[0].mileage;
      this.driverlatitude = data.drivers[0].latitude;
      this.driverlongitude = data.drivers[0].longitude;
      this.storage.get('site_id').then((siteid) => {
      console.log('siteid', siteid); // harusnya pake data ini
      this.auth.getDivisions(res, 7).subscribe((datas) => {
        console.log(datas);
        for (let driverItem = 0; driverItem < data.drivers.length; driverItem++) {
          for (let divisionsItem = 0; divisionsItem < datas.divisions.length; divisionsItem++) {
          console.log ('data.drivers[0].users.division_id', data.drivers[0].users.division_id);
          console.log ('data.divisions[0].id', datas.divisions[0].id);
          if (data.drivers[0].users.division_id === datas.divisions[0].id) {
              // this.availableDrivers.push.apply(this.availableDrivers, data.drivers[driverItem]);
              this.availableDrivers = data.drivers;
              this.availableDrivers2 = data.drivers[0].user_id;
            }
          }
          console.log ('push available', this.availableDrivers);
          console.log ('push 2', this.availableDrivers2);
          console.log(JSON.stringify(data.drivers[driverItem]));
        }
        this.getassignedDriver(this.availableDrivers);
      }, (err) => {
        console.log('error division', err);
      });
    }, (err) => {
      console.log(err);
    });
      }
    }, (err) => {
      this.drivernot();
      console.log('menunggu driver available', err);
    });
  }, (err) => {
    console.log(err);
  });
  // return this.availableDrivers;
}
getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    let R = 6371; // Radius of the earth in km
    let dLat = this.deg2rad(lat2 - lat1);  // deg2rad below
    let dLon = this.deg2rad(lon2 - lon1);
    let a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2 ) * Math.sin(dLon / 2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    let d = R * c; // Distance in km
    return d;
  }
  deg2rad(deg) {
    return deg * (Math.PI / 180);
  }
getEstimatedTimeOfArrival(seconds) {
  let hours = Math.floor(seconds / 3600);
  let minutes = Math.floor(seconds / 60);
  if (hours > 1) {
    // return seconds('{0} hrs', hours);
    this.waktu = hours;
    console.log('hours1', hours);
    this.storage.set('waktus', hours);
    } else if (hours === 1) {
    console.log('hours2', hours);
    this.storage.set('waktus', hours);
    // return seconds('{0} hr', hours);
    this.waktu = hours;
    } else {
    if (minutes > 3) {
    console.log('minutes', minutes);
    this.waktu = minutes;
    this.storage.set('waktus', minutes);
    // return seconds('{0} mins', minutes);
    } else {
      // return '0';
    this.waktu = '0';
    this.storage.set('waktus', this.waktu);
    }
    }
}
getEstimatedTimeOfArrival2(seconds) {
  let hours = Math.floor(seconds / 3600);
  let minutes = Math.floor(seconds / 60);
  if (hours > 1) {
    // return seconds('{0} hrs', hours);
    this.waktu = hours;
    console.log('hours1', hours);
    this.storage.set('times', hours);
    } else if (hours === 1) {
    console.log('hours2', hours);
    this.storage.set('times', hours);
    // return seconds('{0} hr', hours);
    this.waktu = hours;
    } else {
    if (minutes > 3) {
    console.log('minutesss', minutes);
    this.waktu = minutes;
    this.storage.set('times', minutes);
    // return seconds('{0} mins', minutes);
    } else {
      // return '0';
    this.waktu = '0';
    this.storage.set('times', this.waktu);
    }
    }
}

getassignedDriver(availableDrivers) {
  console.log('availaibledriver', JSON.stringify(availableDrivers));
  // this.getAvailableDrivers();
  let listdriver = availableDrivers;
  // list driver available
  if (listdriver.length > 0) {
  let assignedIndex = 0;
  let backupIndex = 0;
  let driverCounter = 0;
  for (let driverIndex = 0; driverIndex < listdriver.length; driverIndex++) {
    let targetLocationLatitude = listdriver[driverIndex].latitude;
    let targetLocationLongitude = listdriver[driverIndex].longitude;
    this.driversmileage[driverIndex] = listdriver[driverIndex].mileage;
    console.log('targetLocationLatitude', targetLocationLatitude);
    console.log('targetLocationLongitude', targetLocationLongitude);
    console.log('mileages', this.driversmileage[driverIndex]);
    // tslint:disable-next-line:max-line-length
    // this.driverdistance[driverIndex] = this.getDistanceFromLatLonInKm(this.deplat, this.deplng, targetLocationLatitude, targetLocationLongitude);
    this.driverdistance[driverIndex] = this.getDistanceFromLatLonInKm(this.deplat, this.deplng, targetLocationLatitude, targetLocationLongitude);
    console.log('distance', this.driverdistance[driverIndex]);
    // this.driversmileage[driverIndex] = this.getEstimatedTimeOfArrival(mileages);
    if (this.driverdistance[driverIndex] <= 10000) {
      console.log('mileages', this.driversmileage[assignedIndex]);
      if (this.driversmileage[driverIndex] === this.driversmileage[assignedIndex]) {
          if (this.driverdistance[driverIndex] < this.driverdistance[assignedIndex])
              assignedIndex = driverIndex;
          console.log('assignedIndex', assignedIndex);
          console.log('driverIndex', driverIndex);
      }
    // tslint:disable-next-line:one-line
    else if (this.driversmileage[driverIndex] < this.driversmileage[assignedIndex])
          assignedIndex = driverIndex;
      console.log('assignedIndex2', assignedIndex);
      console.log('driverIndex2', driverIndex);
      driverCounter++;
  }
  // tslint:disable-next-line:one-line
  else {
      if (this.driverdistance[driverIndex] <= this.driverdistance[backupIndex])
          backupIndex = driverIndex;
      console.log('backupIndex', backupIndex);
    }
  }
  // tslint:disable-next-line:no-unused-expression
  this.driver === null;
    // tslint:disable-next-line:align
    if (driverCounter > 0) {
      // tslint:disable-next-line:max-line-length
      this.driver = (listdriver[assignedIndex].id, listdriver[assignedIndex].user_id, listdriver[assignedIndex].latitude, listdriver[assignedIndex].longitude, listdriver[assignedIndex].mileage, listdriver[assignedIndex].status);
      console.log('this.driver', listdriver[assignedIndex].id);
      console.log('this.driver1', this.driver);
      this.listdriver(this.driver);
    } else {
    // tslint:disable-next-line:max-line-length
    this.driver = (listdriver[backupIndex].id, listdriver[backupIndex].user_id, listdriver[backupIndex].latitude, listdriver[backupIndex].longitude, listdriver[backupIndex].mileage, listdriver[backupIndex].status);
    console.log('this.driver2', this.driver);
    // return this.driver;
    this.listdriver(this.driver);
    }
  } else
    return null;
}
  listdriver(assignedDriver) {
  this.storage.get('access_token').then((res) => {
  this.tokenid = res;
  console.log('this.driver', assignedDriver);
  if (assignedDriver !== null) {
    let userDetails = null;
    let pgnMasVehicles = null;
    this.dataservice.getUser(this.tokenid, this.availableDrivers2).subscribe((result) => {
    this.storage.set('contact', result.user.phone_number);
    this.storage.set('ordered', true);
    this.orderTowait = false;
    this.onSuccess = true;
    console.log(result);
    // this.presentRouteLoader('Berhasil dapat driver, tunggu sebentar ...');
    this.findriver();
    this.storage.set('drivername', result.user.full_name);
    this.drivername =  result.user.full_name;
    this.tokendriver = result.user.token;
    this.calldriver = result.user.phone_number;
    this.gender = result.user.gender;
    if (this.gender === 'Male') {
      this.title = 'Mr.';
    } else {
      this.title = 'Mrs.';
    }
    this.storage.set('gender', result.user.gender);
      // this.driver.status =  'available';
    this.dataservice.vehicles(this.tokenid, this.driverid).subscribe((vehicle) => {
      console.log(vehicle);
      if (vehicle.vehicles && vehicle.vehicles.length) {
        this.plat = vehicle.vehicles;
        this.plate = this.plat[0].license_plate;
        this.storage.set('plates', this.plat[0].license_plate);
      }
    }, (err) => {
      console.log(err);
    });
    this.status = {
        driver: {
          status : 'ontrip'
        }
    // tslint:disable-next-line:semicolon
    }
    this.geocoderService.addressForlatLng(this.driverlatitude, this.driverlongitude)
        .subscribe((desti: string) => {
        let driverlatlong = desti;
        console.log('driverlatlong', desti);
        console.log('this.departure.distance', this.departure);
        this.auth.distance(driverlatlong, this.departure).subscribe((distanceMatrix) => {
          let eta = distanceMatrix.rows[0].elements[0].duration.value;
          this.getEstimatedTimeOfArrival(eta);
          console.log('this.eta', eta);
          }, (err) => {
            console.log(err);
          });

        }, (error) => {
          this.displayErrorAlert();
          console.error(error);
        });
    this.dataservice.createstatus(this.tokenid, this.status, this.iddriver).subscribe((resu) => {
    console.log('update status', resu);
    this.oneclick = true;
    // this.createtrip();
    this.trip = {
      'trip[a]' : '',
      'trip[passenger_id]' : this.userid,
      'trip[driver_id]' : this.driverid,
      'trip[information]' : this.note,
      'trip[status]' : 'onwaiting',
      'trip[b]' : ''
    };
    console.log(this.trip);
    this.dataservice.createtrips(this.tokenid, this.trip).subscribe((trips) => {
    console.log('Sukses create trips', trips);
    this.storage.set('tripid', trips.id);
    this.storage.set('statustrip', trips.status);
    this.storage.set('departure', this.departure);
    this.storage.set('destination', this.addressElement.value);
    this.tripid = trips.id;
    this.statustrip = trips.status;
    this.tripstart = trips.created_at;
    this.tripend = trips.updated_at;
    this.datapoint = {
      'waypoint[a]' : '',
      'waypoint[trip_id]' : this.tripid,
      'waypoint[pickup_location]' : this.departure,
      'waypoint[pickup_lat]' : this.position.lat(),
      'waypoint[pickup_lng]' : this.position.lng(),
      'waypoint[dropoff_location]' : this.addressElement.value,
      'waypoint[dropoff_lat]' : this.deslat,
      'waypoint[dropoff_lng]' : this.deslng,
      'waypoint[sequence]' : '1',
      'waypoint[mileage]' : '0',
      'waypoint[start_time]' : this.tripstart,
      'waypoint[end_time]' : this.tripend,
      'waypoint[updated_at]' : this.tripstart,
      'waypoint[created_at]' : this.tripend,
      'waypoint[checkpoints]' : '',
      'waypoint[b]' : ''
    };
    this.createwaypoint(this.datapoint);
    }, (err) => {
      console.log(err);
    });
    }, (err) => {
      console.log(err);
    });
    }, (err) => {
    console.log('oncompleted trips', err);
  });
  }
  });
  }
  createwaypoint(datapoint) {
    this.storage.get('access_token').then((res) => {
      this.tokenid = res;
      }, (err) => {
        console.log('oncompleted trips', err);
      });
    console.log('datapoint', JSON.stringify(datapoint));
    this.dataservice.waypoint(this.tokenid, datapoint).subscribe((waypoints) => {
    console.log('hasil create waypoint', waypoints);
    this.waypointid = waypoints.id;
    this.storage.set('waypointid', waypoints.id);
    this.storage.set('wpickup_location', waypoints.pickup_location);
    this.storage.set('wdropoff_location', waypoints.dropoff_location);
    }, (err) => {
      console.log(err);
    });
    this.pushnot = {
      'payloads[a]' : '',
      'notification[title]' : '',
      'notification[body]' : '',
      'notification[sound]' : '',
      'payloads[title]' : 'Order',
      'payloads[message]' : '',
      'payloads[trip_id]' : this.tripid,
      'payloads[passenger_id]' : this.userid,
      'payloads[driver_id]' : this.driverid,
      'payloads[information]' : this.note,
      'payloads[pickup_location]' : this.departure,
      'payloads[pickup_lat]' : this.position.lat(),
      'payloads[pickup_lng]' : this.position.lng(),
      'payloads[dropoff_location]' : this.addressElement.value,
      'payloads[dropoff_lat]' : this.deslat,
      'payloads[dropoff_lng]' : this.deslng,
      'payloads[status]' : 'ondispatch',
      'payloads[b]' : ''
    };
    console.log('this.pushnot', JSON.stringify(this.pushnot));
    this.pushnotif(this.pushnot);
  }
  orderSuccess() {
    this.onSuccess = !this.onSuccess;
  }

  goToSchedule(): void {
    this.presentRouteLoader('Tunggu sebentar ...');
    this.nav.push(FeedbackPage);
  }
  goschedule() {
    let confirm = this.alertCtrl.create({
      title: 'Perhatian!',
      message: 'Maaf fitur belum tersedia',
      buttons: [
        {
          text: 'Tutup',
          handler: () => {
            console.log('Close');
          }
        }
      ]
    });
    confirm.present();
    // this.nav.push(FeedbackPage);
  }

  goToFeedback(): void {
    this.presentRouteLoader('Tunggu sebentar ...');
    this.nav.push(FeedbackPage);
  }
  onstarte(statustrips): void {
    this.presentRouteLoader('Tunggu sebentar ...');
    this.onstarted = statustrips;
    this.storage.set('onstarted', this.onstarted);
    if (this.onstarted === 'ontransport') {
      console.log('lagi dijalan');
      this.storage.get('times').then((times) => {
      console.log('this.waktus', times);
      this.waktu = times;
      });
    } else {
      this.startrip();
    }
    console.log('status trip', this.onstarted);
  }
  startrip () {
    this.waktu = '0 min';
  }
  oncompleted() {
    this.presentRouteLoader('Tunggu sebentar ...');
    console.log('masuk halaman feedback');
    this.nav.push(FeedbackPage);
  }
  offtrip(): void {
    this.presentRouteLoader('Tunggu sebentar ...');
    this.storage.set('tripid', '' || null);
    this.storage.set('statustrip', '' || null);
    this.storage.set('ordered', false);
    this.storage.set('waypointid',  '' || null);
    this.storage.set('drivername',  '' || null);
    this.storage.set('gender',  '' || null);
    this.storage.set('noted',  '' || null);
    this.storage.set('plates',  '' || null);
    this.storage.set('waktus',  '' || null);
    this.storage.set('distance',  '' || null);
    this.storage.set('times',  '' || null);
    this.storage.set('wpickup_location',  '' || null);
    this.storage.set('wdropoff_location',  '' || null);
    this.storage.set('contact', '' || null);
    this.status = {
      driver: {
        status : 'available'
      }
    // tslint:disable-next-line:semicolon
    }
    console.log('update status cancel trip', this.status);
    this.dataservice.createstatus(this.tokenid, this.status, this.iddriver).subscribe((resu) => {
    console.log('update status', resu);
    }, (err) => {
      console.log(err);
    });
    this.statustrip = {
      trip: {
        status : 'oncanceled'
      }
    // tslint:disable-next-line:semicolon
    }
    this.dataservice.offtrip(this.tokenid, this.tripid, this.statustrip).subscribe((data) => {
      console.log('cancel trip berhasil', data);
      this.presentRouteLoader('Tunggu sebentar ...');
      this.nav.push(TabsPage);
    }, (err) => {
      console.log('cancel trip gagal', err);
    });
  }
  /**
   * Get the current position
   */
  private locate(): Promise<any> {
    const loader = this.loadingCtrl.create({
      content: 'Tunggu sebentar...',
    });
    loader.present();
    return this.mapService.setPosition().then(() => {
      this.localized = true;
      // Vibrate the device for a second
      Vibration.vibrate(1000);
    }).catch(error => {
      this.alertNoGps();
      console.warn(error);
    }).then(() => {
      // TODO why dismiss not working without setTimeout ?
      setTimeout(() => {
        loader.dismiss();
      }, 1000);
    });
  }

  // tslint:disable-next-line:member-ordering
  isReadonly() {
    return this.isReadonly;   // return true/false 
  }

  doNote() {
    console.log(this.note);
    let confirm = this.alertCtrl.create({
      title: 'Catatan untuk Pengemudi',
      inputs: [
        {
          value: this.note,
          placeholder: 'Silahkan masukan catatan anda',
        },
      ],
      buttons: [
        {
          text: 'Batal',
          handler: data => {
            console.log('Batal clicked');
          }
        },
        {
          text: 'Save',
          handler: data => {
            this.note = data[0];
            this.storage.set('noted', this.note);
            // this.note.push(data);
            console.log(this.note);
            console.log('data', data);
            console.log('Saved clicked');
          }
        }
      ]
    });
    confirm.present();
  }
  doCall() {
    this.dataservice.getUser(this.tokenid, this.driverid).subscribe((result) => {
    this.storage.set('contact', result.user.phone_number);
    this.presentRouteLoader('Tunggu sebentar ...');
    console.log('call or sms:' + result.user.phone_number);
    let confirm = this.alertCtrl.create({
      title: 'Kontak Pengemudi',
      message: 'Panggil atau kirim pesan pengemudi ?',
      buttons: [
        {
          text: 'Call',
          handler: () => {
            console.log('call no hp:' + result.user.phone_number);
            // this.callNumber.callNumber(result.user.phone_number, true)
            // .then(res => console.log('Launched dialer!', res))
            // .catch(err => console.log('Error launching dialer', err));
            window.open('tel:' + result.user.phone_number);
            console.log('Call clicked');
          }
        },
        {
          text: 'Message',
          handler: () => {
            this.sendSMS();
            console.log('Message clicked');
          }
        }
      ]
    });
    confirm.present();
  }, (err) => {
    console.log(err);
  });
  }

  sendSMS() {
  this.dataservice.getUser(this.tokenid, this.driverid).subscribe((result) => {
  console.log('sms no hp:' + result.user.phone_number);

  let options = {
        replaceLineBreaks: false, // true to replace \n by a new line, false by default
        android: {
             intent: 'INTENT'  // Opens Default sms app
            // intent: '' // Sends sms without opening default sms app
          }
  };
  this.smsVar.send(result.user.phone_number, 'Hai, Pengemudi ' + result.user.full_name + '', options);
   // .then(()=>
  // {
  // alert('success');
  // }
  // alert('failed');
  }, (err) => {
  console.log(err);
  });
  }

  canceltrip() {
    this.presentRouteLoader('Tunggu sebentar ...');
    let confirm = this.alertCtrl.create({
      title: 'Cancel Trip',
      message: 'Apakah anda yakin batalkan perjalanan?',
      buttons: [
        {
          text: 'Ya',
          handler: () => {
            this.offtrip();
            this.nav.push(TabsPage);
            console.log('Batal trip');
          }
        },
        {
          text: 'Tidak',
          handler: () => {
            console.log('Batal clicked');
          }
        }
      ]
    });
    confirm.present();
  }
  success() {
    let confirm = this.alertCtrl.create({
      title: 'Pengemudi Telah Ditemukan',
      message: 'Pengemudi akan menjemput di lokasimu?',
      buttons: [
        {
          text: 'Tutup',
          handler: () => {
            console.log('Close');
          }
        }
      ]
    });
    confirm.present();
  }
  presentRouteLoader(message) {
    let loading = this.loadingCtrl.create({
      content: message
    });
    loading.present();
    let myInterval = setInterval(() => {
      loading.dismiss();
      clearInterval(myInterval);
    }, 1500);
  }
  // ionViewDidLoad() {
    // this.storage.get('token').then((res) => {
    //   this.tokenuser = res;
    // });
    // console.log('ionViewDidLoad StartupPage');
    // this.initMap();
    // this.onMapReady();
  // }
  initMap() {
    // this.directionsDisplay.setMap(this.map);
    // this.directionsDisplay.map.setCenter(location);
  }
  showPayMentAlert(title, subtitle, canLeave ) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: subtitle,
      buttons: [ {
        text: 'Okay',
        role: 'cancel',
        handler: () => {
         if (canLeave) {
          this.nav.push(FeedbackPage);
         }
        }
      }, ],
      enableBackdropDismiss: false
    });
    alert.present();
  }
  dismiss(location?: google.maps.LatLng) {
    if (location) {
      this.mapService.mapCenter = location;
      this.destinations = location;
    }
    if (this.addressElement) {
      // this.addressElement.value = '';
    return this.addressElement.value;
    }
    this.viewCtrl.dismiss();
  }
  selectPlace(place: any) {
    // this.dismiss(place.geometry.location);
    console.log(place);
  }
  initAutocomplete(): void {
    // reference : https://github.com/driftyco/ionic/issues/7223
    // this.addressElement = this.destination.nativeElement.querySelector('.destination-input');
    this.addressElement = this.searchbar.nativeElement.querySelector('.searchbar-input');
    let btn = this.searchbar.nativeElement.querySelector('.searchbar-input');
    btn.addEventListener('click', (e: Event) => this.destination);
    this.mapService.createAutocomplete(this.addressElement).subscribe((location) => {
    this.dismiss(location);
    this.deslat = location.lat();
    this.deslng = location.lng();
    console.log('location : ' + location);
    // this.calculateAndDisplayRoute();
    this.geocoderService.addressForlatLng(this.deslat, this.deslng)
          .subscribe((desti: string) => {
            this.destination = desti;
            this.calculateAndDisplayRoute();
            console.log('desti' + this.destination);
          }, (error) => {
            this.displayErrorAlert();
            console.error(error);
          });
    // this.calculateAndDisplayRoute(location);
  }, (error) => {
    console.error(error);
  });
  }

  calculateAndDisplayRoute() {
    this.directionsService = new google.maps.DirectionsService;
    this.destination = this.addressElement.value;
    // const departure = this.position;
    // const destination = this.position;
    console.log('origin : ' + this.departure);
    console.log('destination : ' + this.addressElement.value);
    console.log('destination :', this.destination);
    console.log('destinations :', this.destinations);
    // this.mapService.removeMarker();
    this.directionsService.route({
      origin: this.departure,
      destination: this.addressElement.value,
      travelMode: 'DRIVING'
    }, (response, status) => {
      console.log(response);
      // if (status === 'OK') {
      if (status === google.maps.DirectionsStatus.OK) {
        console.log('data distance', response.routes[0].legs[0].distance);
        console.log('data distance', response.routes[0].legs[0].duration);
        let distance = response.routes[0].legs[0].distance.text;
        console.log('data distance', distance);
        this.storage.set('distance', response.routes[0].legs[0].distance.text);
        this.storage.set('distance', distance);
        let vtimes = response.routes[0].legs[0].duration.value;
        this.getEstimatedTimeOfArrival2(vtimes);
        let route = response.routes[0].legs[0];
        console.log('data', route);
        // this.mapService.removeMarker(route.start_location);
        // this.mapService.removeMarker(route.end_location);
        // this.mapService.createMarker(route.start_location);
        // console.log('origin', route.start_location);
        this.mapService.createMarker1(route.end_location);
        // this.directionsDisplay.setDirections(response);
        this.mapService.directions(response);
      } else {
        // window.alert('Directions request failed due to ' + status);
      }
    });

  }
  goToHome(): void {
    this.presentRouteLoader('Tunggu sebentar ...');
    this.nav.push(TabsPage);
  }
  private alertNoGps() {
    this.presentRouteLoader('Tunggu sebentar ...');
    const alert = this.alertCtrl.create({
      title: 'ArmadaMAS User',
      subTitle: 'GPS dan lokasi jaringan tidak tersedia. Klik OK untuk mencoba lagi',
      enableBackdropDismiss: false,
      buttons: [{
        text: 'OK',
        handler: () => {
          setTimeout(() => this.locate(), 1500);
        }
      }],
    });
    alert.present();
  }
  private findriver() {
    this.presentRouteLoader('Tunggu sebentar ...');
    const alert = this.alertCtrl.create({
      title: 'Armada User',
      subTitle: 'Akhirnya dapat pengemudi yang siap',
    });
    alert.present();
    let myInterval = setInterval(() => {
      alert.dismiss();
      clearInterval(myInterval);
    }, 1500);
  }
  private drivernot() {
    const alert = this.alertCtrl.create({
      title: 'Pengemudi Tidak Tersedia',
      subTitle: 'Tunggu hingga pengemudi tersedia. Klik OK untuk mencoba lagi',
      enableBackdropDismiss: false,
      buttons: [{
        text: 'OK',
        handler: () => {
          this.nav.push(TabsPage);
          // setTimeout(() => this.goToHome(), 500);
        }
      }],
    });
    alert.present();
  }
}
