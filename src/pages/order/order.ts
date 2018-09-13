import { GlobalServiceProvider } from './../../providers/global-service/global-service';
import { DataServiceProvider } from './../../providers/data-service/data-service';
import { Storage } from '@ionic/storage';
import { Component } from '@angular/core';
import { AlertController, NavController, LoadingController } from 'ionic-angular';
import { OrderService } from '../../providers/order/order.service';
import { BasePage } from '../base-page';
import { AuthService } from './../../providers/auth/auth-service';

@Component({
  templateUrl: 'order.html',
  providers: [AuthService, DataServiceProvider]
})
export class OrderPage extends BasePage {
  drivername: Array<any> = [];
  waypoints: Array<any> = [];
  // order: Array<OrderModel> = [];
  orderan: string = null;
  userTrips: any = [];
  listOrder: Boolean = false;
  accesstoken: any;
  passengerid: any;
  userid: any;
  trips: any = [];
  driverid: any = [];
  waypoint: any;
  updatedat: any;
  id: any;
  name: any = [];
  fullname: any;
  order: string = 'direct';
  public pickup: any;
  public dropoff: any;
  public datetime: any;
  constructor(private orderService: OrderService,
              public navCtrl: NavController,
              protected alertCtrl: AlertController,
              public storage: Storage,
              private loadingCtrl: LoadingController,
              public dataservice: DataServiceProvider,
              public globalService: GlobalServiceProvider ) {
    super(alertCtrl);
  }

  ionViewDidEnter() {
    this.presentRouteLoader('Tunggu sebentar ...');
    Promise.all([this.storage.get('user_id'), this.storage.get('access_token')]).then((res) => {
      console.log(res);
      let accesstoken = res[1];
      let userid = res[0];
     // this.auth.waypoints(res[0], res[1]).subscribe((data) => {
      // this.dataservice.getUsers(res[1], res[0]).subscribe((result) => {
      // this.passengerid =  result.user.id;
      // console.log(result);
      this.dataservice.trips(accesstoken, userid).subscribe((resu) => {
      this.storage.set('trip_id', resu.trips.id);
      console.log(resu);
      console.log(resu.trips[0].id);
      console.log(resu.trips[0].driver_id);
      // let driverid = resu.trips[0].driver_id;
      // if (resu.trips && resu.trips > 0) {
      let userTrips = resu.trips;
      this.waypoints = [];
      this.drivername = [];
      this.fullname = 0;
      for (let i = 0; i < userTrips.length; i++) {
        console.log ('i', i);
        // let tripss = userTrips[i].id;
        this.trips = userTrips[i].id;
        console.log (this.trips);
        let driveridd = userTrips[i].driver_id;
        this.driverid = userTrips[i].driver_id;
        console.log (driveridd);
        this.dataservice.waypoints(accesstoken, this.trips).subscribe((data) => {
        // this.waypoints = data.waypoints;
        console.log(JSON.stringify(data.waypoints));
        data.waypoints[0].sequence = i;
        console.log ('data.waypoints[0]', data.waypoints[0]);
        console.log ('data.waypoints[0]', data.waypoints[0].sequence);
        console.log (data.waypoints[0].pickup_location);
        this.dataservice.getUsers(accesstoken, driveridd).subscribe((datas) => {
          data.waypoints[0].mileage = datas.users[0].full_name;
          console.log (datas.users[0].full_name);
          this.waypoints.push.apply(this.waypoints, data.waypoints);
          console.log (this.waypoints);
          }, (err) => {
          console.log(err);
          });
      }, (err) => {
        console.log(err);
      });
        console.log(this.drivername);
  }
      // for (let w = 0; w < waypoints.length; w++) {
      // let waypointss = waypoints[w];
      // tslint:disable-next-line:radix
      // let waypointss = parseInt(waypoints[w].user_id);
      // console.log (waypointss);
      // this.pickup = waypoints[w].pickup_location;
      // this.id = waypoints[w].id;
      // this.dropoff = waypoints[w].dropoff_location;
      // this.waypoint = data.waypoints[0];
      // let waypoints = this.waypoint;
      // console.log(data.waypoints);
      // this.updatedat = waypoints.updated_at;
      // console.log(this.updatedat);
      // this.storage.set('updated_at', waypoints[w].updated_at);
      // this.storage.set('pickup_location', waypoints[w].pickup_location);
      // this.storage.set('id', waypoints[w].id);
      // this.storage.set('dropoff_location', waypoints[w].dropoff_location);
      // this.listorderan(); }
     // }
  });
});
    // if (this.order == null && this.order.length === 0) {
    //   this.order = this.orderService.listorderan();
    // } else {
    //   Promise.all([this.storage.get('user_id'), this.storage.get('access_token')]).then((res) => {
    //   this.dataservice.trips(res[1], res[0]).subscribe((data) => {
    //   if (data.trips && data.trips) {
    //     let userTrips = data.trips;
    //     console.log('userTrips', userTrips);
    //     for (let i = 0; i < data.trips.length - 1; i++) {
    //       // tslint:disable-next-line:radix
    //       console.log(parseInt(userTrips[i].driverid));
    //       // tslint:disable-next-line:radix
    //       this.drivername = this.drivername + parseInt(this.userTrips[i].driverid);
    //       console.log('drivername', this.drivername);
    //     }

    //   }

    //   this.dataservice.getUser(res[0], data.trips.driver_id).subscribe((result) => {
    //     let drivername = result.full_name;
    //     console.log('drivername', drivername);
    // });
      // this.dataservice.getUser(res[0], data.trips.driver_id).subscribe((result) => {
      //   this.storage.set('full_name', result.user.full_name);
      //   this.listorderan();
      //   console.log(data);
      //   }, (err) => {
      //     console.log(err);
      //   });
        // this.order = data.trips;
      // this.order = data.trips.filter((trips) => {
      //   return data.trips.passenger_id;
      // });
      // }
    //   }, (err) => {
    //     console.log(err);
    //   });
    // });
  //   for (let tripIndex = 0; tripIndex < this.userTrips.trips.Count; tripIndex++) {
  //   Promise.all([this.storage.get('driver_id'), this.storage.get('access_token')]).then((res) => {
  //     console.log(res);
  //     this.dataservice.getUser(res[1], res[0]).subscribe((data) => {
  //     this.storage.set('full_name', data.user.full_name);
  //     this.listorderan();
  //     console.log(data);
  //     }, (err) => {
  //       console.log(err);
  //     });
  //   });
  // // }
  //   Promise.all([this.storage.get('access_token')]).then((res) => {
  //     console.log(res);
  //     this.dataservice.waypoint(res[0]).subscribe((data) => {
  //     this.storage.set('pickup_location', data.waypoint.pickup_location);
  //     this.storage.set('dropoff_location', data.waypoint.dropoff_location);
  //     this.storage.set('start_time', data.waypoint.start_time);
  //     this.storage.set('end_time', data.waypoint.end_time);
  //     console.log(data);
  //     }, (err) => {
  //       console.log(err);
  //     });
  //   });
  //   }
  // }
  // listorderan() {
  //   this.storage.get('pickup_location').then((pickup) => {
  //     this.pickup = pickup;
  //   });
  //   this.storage.get('dropoff_location').then((dropoff) => {
  //     this.dropoff = dropoff;
  //   });
  //   this.storage.get('full_name').then((driverId) => {
  //     this.driverId = driverId;
  //   });
  //   this.storage.get('created_at').then((datetime) => {
  //     this.datetime = datetime;
  //   });
  }
  listorderan (): void {
    this.storage.get('updated_at').then((updatedat) => {
    this.updatedat = updatedat;
    this.storage.get('pickup_location').then((pickuplocation) => {
    this.pickup = pickuplocation;
      });
    this.storage.get('id').then((id) => {
    this.id = id;
      });
    this.storage.get('dropoff_location').then((dropofflocation) => {
    this.dropoff = dropofflocation;
      });
    });
  }
  presentRouteLoader(message) {
    let loading = this.loadingCtrl.create({
      content: message
    });
    loading.present();
    let myInterval = setInterval(() => {
      loading.dismiss();
      clearInterval(myInterval);
    }, 1000);
  }
}
