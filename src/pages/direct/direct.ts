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
  departures: any;
  destination: any;
  destinations: any;
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
  route: any;
  public onstarted: any;
  public nearbyPlaces: Array<any> = [];
  public number: any;
  public plat: any;
  public plate: any;
  private addressElement: HTMLInputElement = null;
  constructor(
              public auth: AuthService,
              private platform: Platform,
              public dataservice: DataServiceProvider,
              private nav: NavController,
              private geocoderService: GeocoderService,
              private mapService: MapService,
              private loadingCtrl: LoadingController,
              protected alertCtrl: AlertController,
              private backgroundMode: BackgroundMode,
              private fcm: FCM,
              private smsVar: SMS,
              public storage: Storage) {
    super(alertCtrl);
  }
  ionViewWillEnter() {
    this.storage.set('feedbackPage', false);
    this.isOrdered();
    this.backgroundMode.enable();
    if (typeof FCMPlugin !== 'undefined') {
    this.fcm.getToken().then(token => {
    console.log('tokenfcm', token);
    this.fcm.onNotification().subscribe(data => {
    console.log('tes:' + JSON.stringify(data));
    let status = '';
      for (let key in data) {
      if (key === 'status') {
          status = data[key];
          }
        }
      if (status === 'onstart') {
      this.onstarte('ontransport');
      console.log('jalan onstarte');
        } else if (status ===  'oncompleted') {
      this.oncompleted();
      console.log('jalan oncompleted');
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
      console.log('jalan onstarte');
        } else if (status ===  'oncompleted') {
      this.oncompleted();
      console.log('jalan oncompleted');
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
    this.isOnwaiting();
  }
  ionViewDidEnter() {
  }
  isOrdered() {
    console.log('this.isOrdered(directpage);');
    this.storage.get('ordered').then((ordered) => {
    if (!ordered === true) {
      console.log('tidak order');
     } else {
      this.isOnwaiting();
      console.log('masuk halaman direct2');
          }
      });
    }
  isOnwaiting() {
    this.storage.set('feedbackPage', false);
    Promise.all([this.storage.get('access_token'), this.storage.get('user_id')]).then((res) => {
      this.tokenid = res[0];
      this.userid = res[1];
    });
    this.storage.get('waypointid').then((waypointid) => {
    if (waypointid === null) {
    console.log('waypointid kosong');
    } else {
    // this.orderTowait = false;
    // this.onSuccess = true;
    // this.storage.get('statustrip').then((tripstatus) => {
    this.dataservice.waypointx(this.tokenid, waypointid).subscribe((datas) => {
    this.departures = datas.waypoint.pickup_location;
    this.destination = datas.waypoint.dropoff_location;
    this.directionsService = new google.maps.DirectionsService
    this.directionsService.route({
      origin: this.departures,
      destination: this.destination,
      travelMode: 'DRIVING'
    }, (response, status) => {
      console.log(response);
      // if (status === 'OK') {
      if (status === google.maps.DirectionsStatus.OK) {
        let route = response.routes[0].legs[0];
        console.log('distancesssss', route);
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
  this.storage.get('times').then((times) => {
    console.log('this.waktus', times);
    this.waktu = times;
  });
  this.storage.get('plates').then((plates) => {
    console.log('plates : ' + plates);
    this.plate = plates;
  });
  this.storage.get('tripid').then((tripid) => {
    console.log('tripid : ' + tripid);
    this.trip = tripid;
  });
  console.log('tripid directpage: ' + this.trip);
  this.dataservice.trip(this.tokenid, this.trip).subscribe((data) => {
    console.log('status trip jalan/nunggu', data.trip);
    let tripstatus = data.trip.status;
    if (tripstatus === 'ontransport') {
      this.onstarted = 'ontransport';
      console.log('lagi dijalan', tripstatus);
    } else if (tripstatus === 'oncompleted') {
      console.log('udh masuk ke feedback', tripstatus);
      this.oncompleted();
    } else if (tripstatus === 'onwaiting') {
      console.log('masih nunggu driver', tripstatus);
      this.orderTowait = false;
      this.onSuccess = true;
    }
  });

  } //else waypoint ada
    
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
         console.log('departure' + this.position);
            }, (error) => {
              this.displayErrorAlert();
              console.error(error);
            });
        }
}
  // tslint:disable-next-line:max-line-length

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
  // this.auth.distance(this.departure, this.destination).subscribe((distanceMatrix) => {
  // this.eta = distanceMatrix.rows[0].elements[0].duration.value.ToString();
  // console.log(distanceMatrix.rows[0].elements[0].duration.value.ToString());
  // }, (err) => {
  //   console.log(err);
  // });
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
    if (this.onstarted === 'ontransport') {
      console.log('lagi dijalan');
      this.storage.get('wpickup_location').then((wpickup) => {
        this.departure = wpickup;
        });
      this.storage.get('wdropoff_location').then((wdropoff) => {
      this.destination = wdropoff;
      });
      this.storage.get('times').then((times) => {
      this.waktu = times;
      console.log('this.waktu', this.waktu);
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
    this.storage.get('plates').then((plates) => {
      console.log('plates : ' + plates);
      this.plate = plates;
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
    this.storage.set('feedbackPage', false);
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
    this.storage.get('contact').then((contact) => {
    console.log('call or sms:' + contact);
    let confirm = this.alertCtrl.create({
      title: 'Kontak Pengemudi',
      message: 'Panggil atau kirim pesan pengemudi ?',
      buttons: [
        {
          text: 'Call',
          handler: () => {
            console.log('call no hp:' + contact);
            // this.callNumber.callNumber(result.user.phone_number, true)
            // .then(res => console.log('Launched dialer!', res))
            // .catch(err => console.log('Error launching dialer', err));
            window.open('tel:' + contact);
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
  this.presentRouteLoader('Tunggu sebentar ...');
  this.storage.get('contact').then((contact) => {
  console.log('call or sms:' + contact);

  let options = {
        replaceLineBreaks: false, // true to replace \n by a new line, false by default
        android: {
             intent: 'INTENT'  // Opens Default sms app
            // intent: '' // Sends sms without opening default sms app
          }
  };
  this.smsVar.send(contact, 'Hai, Pengemudi ' +this.drivername+ '', options);
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
        console.log('data distance2', response.routes[0].legs[0].distance);
        console.log('data duration2', response.routes[0].legs[0].duration);
        let times = response.routes[0].legs[0].duration.value;
        // this.distances = this.getEstimatedTimeOfArrival(times);
        console.log('distances', response.routes[0].legs[0].distance.value);
        console.log('route', this.route);
        let route = response.routes[0].legs[0];
        console.log('data', route);
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