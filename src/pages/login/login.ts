import { AuthService } from './../../providers/auth/auth-service';
import { DataServiceProvider } from './../../providers/data-service/data-service';
import { TabsPage } from './../tabs/tabs';
import { Component, Input } from '@angular/core';
import { Storage } from '@ionic/storage';
import { GlobalServiceProvider } from '../../providers/global-service/global-service';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { Headers, Http, RequestOptions } from '@angular/http';
import { LoadingController, AlertController, NavController,
  ToastController, App, NavParams, Events } from 'ionic-angular';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'page-login',
  templateUrl: 'login.html',
  providers: [AuthService]
})
export class LoginPage {
  loginForm: FormGroup;
  loading: any;
  data: any;
  project: any;
  userid: any;
  // user: any;
  username: string;
  password: string;
  account: {username: string, password: string};
  constructor(
    public app: App,
    private nav: NavController,
    public navParams: NavParams,
    public dataservice: DataServiceProvider,
    private loadingCtrl: LoadingController,
    protected alertCtrl: AlertController,
    private auth: AuthService,
    private globalService: GlobalServiceProvider,
    public toastCtrl: ToastController,
    public storage: Storage,
    public http: Http,
    public events: Events) {
      this.loginForm = new FormGroup({
        username: new FormControl('', Validators.required),
        password: new FormControl('', Validators.required)
      });
  }
  submitLogin() {

    this.account = {
      username: this.username,
      password: btoa(this.password)
    };
    console.log(btoa(this.password));
    console.log(this.account);
    this.auth.authenticate(this.account).subscribe((res) => {
      this.storage.set('access_token', res.access_token);
      this.storage.set('user_id', res.user_id);
      this.storage.set('user_id', res.user_id);
      this.storage.set('division_id', res.user_id);
      console.log(res);
      this.goToHome();
    }, (err) => {
      let error = err.json();
      // this.globalService.toastInfo(error.message ? error.message : 
      // 'Failed, please check your internet connection...', 3000, 'bottom');
      console.log(err);
    });
  }
  doLogin() {
    this.loginForm.value.password = btoa(this.loginForm.value.password);
    console.log(this.loginForm.value);
    this.auth.authenticate(this.loginForm.value).subscribe((res) => {
    this.presentRouteLoader('Berhasil masuk...');
    // this.auth.getDriver(res.access_token).subscribe((data) => {
    // console.log(data);
    // let driverindex = data.drivers;
    // let listdivisions = driverindex.users.divisions;
    // console.log('driver', listdivisions);
    //   }, (err) => {
    // let error = err.json();
    // this.globalService.toastInfo(error.message ? error.message :
    // 'Failed, please check your internet connection...', 3000, 'top');
    // });
    console.log(res);
    this.storage.set('isLoggedIn', true);
    this.storage.set('access_token', res.access_token);
    this.storage.set('user_id', res.user_id);
    this.storage.set('division_id', res.access_level);
    this.userid = res.user_id;
    if (res.user_id !== undefined) {
      // this.app.getRootNavs()[0].setRoot('TabsMenuPage');
      this.nav.setRoot(TabsPage);
    } else {
      this.globalService.toastInfo('Gagal login, username atau password salah', 3000, 'top');
    }
    }, (err) => {
      let error = err.json();
      this.globalService.toastInfo(error.message ? error.message :
      'Gagal, mohon cek koneksi internet anda...', 3000, 'top');
    });
  }

  showLoader() {
    this.loading = this.loadingCtrl.create({
        content: 'Yeah! Berhasil masuk . . .'
    });

    this.loading.present();
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
  goToHome(): void {
    this.nav.push(TabsPage);
  }
}
