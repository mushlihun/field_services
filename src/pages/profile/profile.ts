import { DataServiceProvider } from './../../providers/data-service/data-service';
import { Storage } from '@ionic/storage';
import { AuthService } from './../../providers/auth/auth-service';
import { Component } from '@angular/core';
import { LoginPage } from '../login/login';
import { ChangePage } from '../change/change';
import { LoadingController, AlertController, ModalController, NavParams, NavController, Platform } from 'ionic-angular';
import { App, ToastController } from 'ionic-angular';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import * as firebase from 'firebase';
import { GlobalServiceProvider } from '../../providers/global-service/global-service';

@Component({
  templateUrl: 'profile.html',
  providers: [AuthService]
})
export class ProfilePage {
  loginForm: FormGroup;
  loading: any;
  token: any;
  id: any;
  public fullname: any;
  public email: any;
  public phone: any;
  public divisionid: any;
  private userid: any;
     constructor(
      public app: App,
      private platform: Platform,
      private nav: NavController,
      private modalCtrl: ModalController,
      public navParams: NavParams,
      public globalService: GlobalServiceProvider,
      private loadingCtrl: LoadingController,
      protected alertCtrl: AlertController,
      public auth: AuthService,
      public dataservice: DataServiceProvider,
      public storage: Storage,
      private toastCtrl: ToastController,
      public appCtrl: App) {
  }
  ionViewDidLoad() {
    Promise.all([this.storage.get('user_id'), this.storage.get('access_token')]).then((res) => {
      console.log(res);
      this.userid = res[0];
      console.log('userid', this.userid);
      this.token = res[1];
      console.log('token', this.token);
      this.dataservice.getUser(this.token, this.userid).subscribe((data) => {
      this.fullname = data.user.full_name;
      this.email = data.user.email;
      this.phone = data.user.phone_number;
      console.log(data);
      console.log(data.user.full_name);
      this.auth.getDivisions(this.token, data.user.division_id).subscribe((result) => {
        this.storage.set('name', result.division.name);
        this.divisionid = result.division.name;
        console.log(result);
      }, (err) => {
        console.log(err);
      });
      // this.getProfile();
      }, (err) => {
        console.log(err);
      });
    });
  }
  ionViewWillLeave() {
    // Promise.all([this.storage.get('user_id'), this.storage.get('access_token')]).then((res) => {
    //   console.log(res);
    //   this.dataservice.getUser(res[1], res[0]).subscribe((data) => {
    //   this.storage.set('full_name', '' || null);
    //   this.storage.set('email', '' || null);
    //   this.storage.set('phone_number', '' || null);
    //   this.storage.set('division_id', '' || null);
    //   this.storage.set('token', '' || null);
    //   console.log(data);
    //   console.log(data.user.full_name);
    //   this.auth.getDivisions(res[1], data.user.division_id).subscribe((result) => {
    //     this.storage.set('name', '' || null);
    //     console.log(result);
    //   }, (err) => {
    //     console.log(err);
    //   });
    //   this.getProfile();
    //   }, (err) => {
    //     console.log(err);
    //   });
    // });
  }
  ionViewDidEnter() {
  }
  ionViewWillEnter() {
    this.presentRouteLoader('Tunggu sebentar ...');
  }
  getProfile() {
    this.storage.get('full_name').then((fullname) => {
      this.fullname = fullname;
    });
    this.storage.get('email').then((email) => {
      this.email = email;
    });
    this.storage.get('phone_number').then((phone) => {
      this.phone = phone;
    });
    this.storage.get('name').then((divisionid) => {
      this.divisionid = divisionid;
    });
  }

  goToChange(): void {
    this.presentRouteLoader('Tunggu sebentar ...');
    Promise.all([this.storage.get('user_id'), this.storage.get('access_token')]).then((res) => {
      console.log('data', res);
      this.token = res[1];
      this.userid = res[0];
      this.dataservice.getUser(res[1], res[0]).subscribe((data) => {
      this.storage.set('password', data.user.password);
      console.log(data);
      }, (err) => {
        console.log(err);
      });
    });
    this.nav.push(ChangePage);
  }
  goToLogin(): void {
    this.presentRouteLoader('Tunggu sebentar ...');
    // this.nav.setRoot(LoginPage);
    this.appCtrl.getRootNav().setRoot(LoginPage);
  }
  isReadonly() {
    return this.isReadonly;   // return true/false 
  }
  logUserOut() {
     this.presentRouteLoader('Tunggu sebentar ...');
    // pop to confirm if user really wishes to logout
     let confirm = this.alertCtrl.create({
        title: 'Are you sure you want to logout?',
        message: '',
        buttons: [
          {
            text: 'Cancel',
            handler: () => {
              // do nothing 
            }
          },
          {
            text: 'Yes',
            handler: () => {
              // call user logout service
    Promise.all([this.storage.get('user_id'), this.storage.get('access_token')]).then((res) => {
      console.log('data', res);
      this.token = res[1];
      this.userid = res[0];
      }, (err) => {
        console.log(err);
      });
    let datatoken = {
    user: {
    token : ''
    }
    // tslint:disable-next-line:semicolon
    }
    this.auth.logout(this.token, this.userid, datatoken).subscribe((data) => {
    this.storage.clear();
    console.log('data', data);
    this.goToLogin();
    }, (err) => {
      console.log(err);
    });
      // show toast before redirecting 
            }
          }
        ]
      });
      // tslint:disable-next-line:align
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

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'bottom',
      dismissOnPageChange: true
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }
}
