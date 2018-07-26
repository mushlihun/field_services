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
import { BasePage } from '../base-page';
import { CallNumber } from '@ionic-native/call-number';
import { RideService } from '../../providers/ride/ride.service';
import { GlobalServiceProvider } from '../../providers/global-service/global-service';
import { SMS } from '@ionic-native/sms';
declare var google: any;

@Component({
  templateUrl: 'direct.html',
  providers: [AuthService, DataServiceProvider]
})
export class DirectPage extends BasePage {
  @ViewChild('map') mapElement: ElementRef;
  // @ViewChild('destination', {read: ElementRef}) destination: ElementRef;
  @ViewChild('searchbar', {read: ElementRef}) searchbar: ElementRef;
  form: FormGroup;
  position: google.maps.LatLng;
  departure: any;
  destination: any;
  destinations: any;
  start = 'chicago, il';
  end = 'chicago, il';
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
  availableDrivers: any;
  title: any;
  jarak: any;
  seconds: any;
  latitude: any;
  longitude: any;
  deplat: any;
  deplng: any;
  deslat: any;
  deslng: any;
  tokenuser: any;
  acctoken: any;
  time: any;
  calldriver: any;
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
  respon: any;
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
    this.backgroundMode.enable();
    if (typeof FCMPlugin !== 'undefined') {
    this.fcm.getToken().then(token => {
    console.log('tokenfcm', token);
    Promise.all([this.storage.get('access_token'), this.storage.get('user_id')]).then((res) => {
    console.log(res);
    this.tokenid = res[0];
    this.userid = res[1];
    console.log('this.tokenid: ', this.tokenid);
    console.log('this.userid: ', this.userid);
    });
    this.tokenfcm = token;
    let tokenfcm = token;
    this.fcmtoken = {
          user: {
          token : tokenfcm
              }
          };
    console.log('update token', this.fcmtoken);
    this.auth.updatetokenFCm(this.tokenid, this.userid, this.fcmtoken).subscribe((res) => {
    console.log('update status1', res);
    this.storage.set('tokenfcm', res.token);
    console.log('hasil update token = ' + res.token);
      }, (err) => {
    console.log('gagal update token', err);
      });
    this.fcm.onNotification().subscribe(data => {
    console.log('tes:' + JSON.stringify(data));
    let statusfcm = data;
    console.log('tes:' + data.wasTapped);
    if (data.wasTapped) {
      console.log('Received in background');
      } else {
      let status = '';
      for (let key in data) {
      if (key === 'status') {
          status = data[key];
          }
        }
      if (status === 'onstart') {
      this.onstarte('onstart');
      console.log('jalan onstarte');
        } else if (status ===  'oncompleted') {
      this.oncompleted();
      console.log('jalan oncompleted');
        }
      console.log('Received in foreground');
        }
          });
        });
      }
  }
  ionViewDidLoad() {
    this.directionsService = new google.maps.DirectionsService;
    this.directionsDisplay = new google.maps.DirectionsRenderer;
    this.mapService.closeInfoWindow();
    this.position = this.mapService.mapCenter;
    if (this.position) {
      this.storage.get('departures').then((start) => {
      this.departure = start;
      });
      this.storage.get('destinations').then((finish) => {
      this.destination = finish;
      });
      this.storage.get('plates').then((plates) => {
        this.plate = plates;
      });
      this.storage.get('gender').then((genders) => {
        this.gender = genders;
        if (this.gender === 'Male') {
           this.title = 'Mr.';
        } else {
           this.title = 'Mrs.';
        }
      });
      this.storage.get('drivername').then((drivername) => {
        this.drivername = drivername;
      });
      this.storage.get('waktus').then((waktus) => {
        this.waktu = waktus;
      });
      // this.calculateAndDisplayRoute(desti);
    }
  }
  ionViewDidEnter(respon) {
    Promise.all([this.storage.get('access_token'), this.storage.get('user_id')]).then((res) => {
      console.log('access_token2', res[0]);
      this.tokenid = res[0];
      console.log('user_id2', res[1]);
      this.userid = res[1];
    });
    this.directionsService.route({
      origin: this.departure,
      destination: this.destination,
      travelMode: 'DRIVING'
      }, (response, status) => {
      console.log(response);
      this.respon = response;
  // if (status === 'OK') {
      if (status === google.maps.DirectionsStatus.OK) {
      console.log('distances', response.routes[0].legs[0].distance);
      console.log('duration', response.routes[0].legs[0].duration);
      this.distances = response.routes[0].legs[0].distance.text;
      console.log('distances', this.distances);
      this.jarak = response.routes[0].legs[0].duration.text;
      this.storage.set('jarak', this.jarak);
      this.storage.set('distance', this.distances);
      console.log('times', this.jarak);
      let route = response.routes[0].legs[0];
      console.log('route', route);
      this.mapService.createMarker(route.start_location);
      console.log('origin', route.start_location);
      this.mapService.createMarker1(route.end_location);
      this.directionsDisplay.setDirections(response);
      this.mapService.directions(response);
    }
  });
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
          // this.mapService.addMarkersToMap(this.deplat, this.deplng);
          // let cobamaps = new google.maps.Latlng(59.33, 18.05);
          // this.mapService.createMarker(59.33, 18.05);
          console.log('data', this.deplat, this.deplng);
        }
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
    // this.mapService.addMarkersToMap(this.deplat, this.deplng);
    this.geocoderService.addressForlatLng(this.position.lat(), this.position.lng())
        .subscribe((address: string) => {
         this.departure = address;
         this.storage.set('departure', address);
         console.log('departure' + this.position);
            }, (error) => {
              this.displayErrorAlert();
              console.error(error);
            });
        }
}
  // tslint:disable-next-line:max-line-length
  direct(model: OrderModel, orderTowait: boolean, onSuccess: boolean, ontrips: boolean, endtrip: boolean, oneclick: boolean) {
    this.oneclick = true;
    this.presentRouteLoader('Tunggu sebentar ...');
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
    this.presentRouteLoader('Waiting...');
    console.log('telah waiting');
    this.getassignedDriver();
    let getAssignedDriverTask = this.getassignedDriver();
    if (getAssignedDriverTask !== undefined) {
      console.log(getAssignedDriverTask);
      let listassigndriver = this.getassignedDriver;
      if (listassigndriver != null) {
    console.log('telah waiting');
    // buka command sini
    Promise.all([this.storage.get('access_token')]).then((res) => {
        this.auth.getDriver(res[0]).subscribe((data) => {
          if (data.drivers.length === 0) {
          this.drivernot();
          this.globalService.toastInfo('Belum ada pengemudi yang tersedia', 3000, 'bottom');
          }
          Vibration.vibrate(1000);
          console.log(data);
          this.orderTowait = true;
          // this.ontrips = true;
          if (data.drivers && data.drivers.length > 0) {
            this.drivers = data.drivers;
            this.drivers.push({showDetails: false});
            this.driverid = this.drivers[0].user_id;
            this.iddriver = this.drivers[0].id;
            this.status = this.drivers[0].status;
            this.latitude = this.drivers[0].latitude;
            this.longitude = this.drivers[0].longitude;
            this.jarak = this.drivers[0].mileage;
            this.waktu = this.getEstimatedTimeOfArrival(this.jarak);
            this.storage.set('waktus', this.getEstimatedTimeOfArrival(this.jarak) );
            console.log(this.jarak);
            console.log(this.getEstimatedTimeOfArrival(this.jarak));
            for (let i = 0; i < data.drivers.length - 1; i++) {
              // tslint:disable-next-line:radix
              this.driverid = parseInt(this.drivers[i].user_id);
            }
          }
          this.dataservice.getUser(this.tokenid, this.driverid).subscribe((result) => {
          this.orderTowait = false;
          this.onSuccess = true;
          console.log(result);
          Vibration.vibrate(1000);
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

    //       // this.driver.status =  'available';
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
          console.log('update status', this.status);
          this.dataservice.createstatus(this.tokenid, this.status, this.iddriver).subscribe((resu) => {
            console.log('update status', resu);
          }, (err) => {
            console.log(err);
          });
// buka command sini
          this.trip = {
            'trip[a]' : '',
            'trip[passenger_id]' : this.userid,
            'trip[driver_id]' : this.driverid,
            'trip[information]' : this.note,
            'trip[status]' : 'onwaiting',
            'trip[b]' : ''
          };
          console.log(this.trip);
          // tslint:disable-next-line:no-shadowed-variable
          this.dataservice.createtrips(this.tokenid, this.trip).subscribe((trips) => {
            console.log(trips);
            this.storage.set('trip_id', trips.id);
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
            console.log(this.datapoint);
            console.log(JSON.stringify(this.datapoint));
            console.log('Sukses create trips');
            this.waypoint(this.datapoint);
            console.log('lanjut waypoint');
          }, (err) => {
            console.log(err);
          });
        }, (err) => {
          console.log(err);
        });
        }, (err) => {
          console.log(err);
          console.log('menunggu pengemudi available');
        });
      }, (err) => {
        console.log('error', err);
        });
  }}
}

waypoint(datapoint) {
  console.log('datapoint', JSON.stringify(datapoint));
  this.dataservice.waypoint(this.tokenid, datapoint).subscribe((waypoints) => {
    console.log(waypoints);
    // this.pushnot = {
    //     'notification[a]' : '',
    //     'notification[b]' : ''
    //   };
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
    this.pushnotif(this.pushnot);
    console.log('Sukses waypoint');
  }, (err) => {
    console.log(err);
  });
}
distance() {
  this.auth.distance(this.departure, this.addressElement.value).subscribe((distanceMatrix) => {
console.log(distanceMatrix.rows[0].elements[0].duration.value.ToString());
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
  Promise.all([this.storage.get('access_token')]).then((res) => {
    this.auth.getDriver(res[0]).subscribe((data) => {
      console.log(data);
      console.log('driver', data.drivers.users);
      if (data === []) {
        this.globalService.toastInfo('Belum ada driver tersedia', 3000, 'top');
      }
      this.auth.getDivision(res[0], 1).subscribe((datas) => {
        console.log(datas);
        console.log('divisions', datas.divisions);
        for (let driverItem = 0; driverItem < data.drivers.length; driverItem++) {
          for (let divisionsItem = 0; divisionsItem < datas.divisions.length; divisionsItem++) {
            if (data.drivers[driverItem].users.division_id === datas.divisions[divisionsItem].id) {
              this.availableDrivers.push.apply(this.availableDrivers, data.drivers[driverItem]);
          } console.log ('data.drivers', this.availableDrivers);
          }
          console.log ('push available', this.availableDrivers);
        }
      }, (err) => {
        console.log(err);
      });
    }, (err) => {
      this.drivernot();
      console.log(err);
      console.log('menunggu driver available');
    });
  }, (err) => {
    console.log(err);
  });
  return this.availableDrivers;
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
    return this.time('{0} hrs', hours);
    } else if (hours === 1) {
    return this.time('{0} hr', hours);
    } else {
    if (minutes > 3) {
    return this.time('{0} mins', minutes);
    } else
    return '3 mins';
    }
}

getassignedDriver() {
  this.presentRouteLoader('Tunggu sebentar ...');
  this.getAvailableDrivers();
  let listdriver = this.availableDrivers;
  console.log('listdriver', listdriver);
  // list driver available
  if (listdriver > 0) {
  let assignedIndex = 0;
  let backupIndex = 0;
  let driverCounter = 0;
  for (let driverIndex = 0; driverIndex < listdriver.length; driverIndex++) {
    let targetLocationLatitude = listdriver[driverIndex].latitude;
    let targetLocationLongitude = listdriver[driverIndex].longitude;
    let mileages = listdriver[driverIndex].mileage;
    console.log('targetLocationLatitude', targetLocationLatitude);
    console.log('targetLocationLongitude', targetLocationLongitude);
    console.log('mileages', mileages);
    // tslint:disable-next-line:no-unused-expression
    // tslint:disable-next-line:max-line-length
    this.driverdistance[driverIndex] = this.getDistanceFromLatLonInKm(this.deplat, this.deplng, targetLocationLatitude, targetLocationLongitude);
    console.log(this.getDistanceFromLatLonInKm);
    this.driversmileage[driverIndex] = this.getEstimatedTimeOfArrival(mileages);
    if (this.driverdistance[driverIndex] <= 10000) {
      if (this.driversmileage[driverIndex] === this.driversmileage[assignedIndex]) {
          if (this.driverdistance[driverIndex] < this.driverdistance[assignedIndex])
              assignedIndex = driverIndex;
      }
    // tslint:disable-next-line:one-line
    else if (this.driversmileage[driverIndex] < this.driversmileage[this.assignedIndex])
          this.assignedIndex = driverIndex;
      driverCounter++;
  }
  // tslint:disable-next-line:one-line
  else {
      if (this.driverdistance[driverIndex] <= this.driverdistance[backupIndex])
          backupIndex = driverIndex;
  }

  }
  // tslint:disable-next-line:no-unused-expression
  this.driver === null;
    // tslint:disable-next-line:align
    if (driverCounter > 0) {
      // tslint:disable-next-line:max-line-length
      this.driver = (listdriver[assignedIndex].id, listdriver[assignedIndex].user_id, listdriver[assignedIndex].latitude, listdriver[assignedIndex].longitude, listdriver[assignedIndex].mileage, listdriver[assignedIndex].status);
    } else {
    // tslint:disable-next-line:max-line-length
    this.driver = (listdriver[backupIndex].id, listdriver[backupIndex].user_id, listdriver[backupIndex].latitude, listdriver[backupIndex].longitude, listdriver[backupIndex].mileage, listdriver[backupIndex].status);
    return this.driver;
    }
  } else
    return null;
}

  orderSuccess() {
    this.onSuccess = !this.onSuccess;
  }

  goToSchedule(): void {
    this.presentRouteLoader('Tunggu sebentar ...');
    this.nav.push(SchedulePage);
  }

  goToFeedback(): void {
    this.presentRouteLoader('Tunggu sebentar ...');
    this.nav.push(FeedbackPage);
  }
  onstarte(statustrips): void {
    this.presentRouteLoader('Tunggu sebentar ...');
    this.onstarted = statustrips;
    this.statustrip = statustrips;
    console.log('jalan onstarted', this.onstarted);
  }
  oncompleted() {
    this.presentRouteLoader('Tunggu sebentar ...');
    this.nav.push(FeedbackPage);
  }
  offtrip(): void {
    this.presentRouteLoader('Tunggu sebentar ...');
    this.dataservice.offtrip(this.tokenid, this.tripid).subscribe((data) => {
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
    let confirm = this.alertCtrl.create({
      title: 'Catatan untuk Pengemudi',
      message: '',
      inputs: [
        {
          // name: 'Silahkan masukan catatan anda',
          placeholder: 'Silahkan masukan catatan anda'
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
            // this.note.push(data);
            console.log(this.note);
            console.log('Saved clicked');
          }
        }
      ]
    });
    confirm.present();
  }
  doCall() {
    this.presentRouteLoader('Tunggu sebentar ...');
    console.log('call or sms:' + this.calldriver);
    let confirm = this.alertCtrl.create({
      title: 'Kontak Pengemudi',
      message: 'Panggil atau kirim pesan pengemudi ?',
      buttons: [
        {
          text: 'Call',
          handler: () => {
            console.log('call no hp:' + this.calldriver);
            window.open('tel:' + this.calldriver);
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
  }
  sendSMS() {
  console.log('sms no hp:' + this.calldriver);

  let options = {
        replaceLineBreaks: false, // true to replace \n by a new line, false by default
        android: {
             intent: 'INTENT'  // Opens Default sms app
            // intent: '' // Sends sms without opening default sms app
          }
  };
  this.smsVar.send(this.calldriver, 'Hai, Pengemudi', options);
   // .then(()=>
  // {
  // alert('success');
  // }
  // alert('failed');
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

  initMap() {

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
  selectPlace(place: any) {
    // this.dismiss(place.geometry.location);
    console.log(place);
  }
  calculateAndDisplayRoute() {
    this.directionsService = new google.maps.DirectionsService;
    // this.destination = this.addressElement.value;
    // const departure = this.position;
    // const destination = this.position;
    console.log('origin : ' + this.departure);
    console.log('destination : ' + this.addressElement.value);
    console.log('destination :', this.destination);
    console.log('destinations :', this.destinations);
    this.storage.set('destinations', this.destination);
    this.directionsService.route({
      origin: this.departure,
      destination: this.addressElement.value,
      travelMode: 'DRIVING'
    }, (response, status) => {
      console.log(response);
      // if (status === 'OK') {
      if (status === google.maps.DirectionsStatus.OK) {
        console.log('data', response.routes[0].legs[0].distance);
        console.log('data', response.routes[0].legs[0].duration);
        this.distances = response.routes[0].legs[0].distance.text;
        console.log('distances', this.distances);
        this.jarak = response.routes[0].legs[0].duration.text;
        this.storage.set('jarak', this.jarak);
        this.storage.set('distance', this.distances);
        console.log('times', this.jarak);
        let route = response.routes[0].legs[0];
        console.log('data', route);
        this.mapService.createMarker(route.start_location);
        console.log('origin', route.start_location);
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
  private drivernot() {
    const alert = this.alertCtrl.create({
      title: 'Pengemudi Tidak Tersedia',
      subTitle: 'Tunggu hingga pengemudi tersedia. Klik OK untuk mencoba lagi',
      enableBackdropDismiss: false,
      buttons: [{
        text: 'OK',
        handler: () => {
          // setTimeout(() => this.goToHome(), 500);
        }
      }],
    });
    alert.present();
  }
// tslint:disable-next-line:eofline
}