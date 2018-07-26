import { AuthService } from './../../providers/auth/auth-service';
import { GlobalServiceProvider } from './../../providers/global-service/global-service';
import { DataServiceProvider } from './../../providers/data-service/data-service';
import { Storage } from '@ionic/storage';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { Component } from '@angular/core';
import { AlertController, NavController, LoadingController, App } from 'ionic-angular';
import { ProfilePage } from '../profile/profile';
import * as BcryptJS from 'bcryptjs';
import * as CryptoJS from 'crypto-js';
import { Database } from './../../providers/database';

@Component({
  templateUrl: 'change.html',
  providers: [DataServiceProvider]
})
export class ChangePage {
  changeForm: FormGroup;
  newpassword: string;
  confirmpassword: string;
  passwordnew: any;
  passwordconfirm: any;
  tokenid: any;
  userid: any;
  kuncihash: any;
  kunci: any;
  constructor(private loadingCtrl: LoadingController,
    public appCtrl: App,
    private nav: NavController,
    protected alertCtrl: AlertController,
    public storage: Storage,
    public dataservice: DataServiceProvider,
    public auth: AuthService,
    public database: Database,
    public globalService: GlobalServiceProvider) {
    this.changeForm = new FormGroup({
        newpassword: new FormControl('', Validators.required),
        confirmpassword: new FormControl('', Validators.required)
      });
}
ionViewWillEnter() {
  this.presentRouteLoader('Tunggu sebentar ...');
  Promise.all([this.storage.get('access_token'), this.storage.get('user_id')]).then((res) => {
    console.log(res);
    this.tokenid = res[0];
    this.userid = res[1];
    console.log('this.token: ', this.tokenid);
    console.log('this.userid: ', this.userid);
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
  }, 1500);
}

update () {
  this.presentRouteLoader('Tunggu sebentar ...');
  console.log('userid: ', this.userid);
  console.log('acctoken: ', this.tokenid);
  if (this.changeForm.value.newpassword !== '' && this.changeForm.value.confirmpassword !== '') {
    if (this.changeForm.value.newpassword === this.changeForm.value.confirmpassword) {
    console.log('newpassword', this.changeForm.value.newpassword);
    console.log('confirmpassword', this.changeForm.value.confirmpassword);
    let salt = BcryptJS.genSaltSync();
    this.kuncihash = {
        user : {
        password : BcryptJS.hashSync(this.changeForm.value.newpassword, salt)
             }
       // tslint:disable-next-line:semicolon
       }
    console.log('kunci', this.kuncihash);
      // });
    this.dataservice.changepass(this.tokenid, this.userid, this.kuncihash).subscribe((result) => {
    console.log('hasil change pass', result);
    this.globalService.toastInfo('Selamat, password berhasil diubah', 3000, 'bottom');
    this.presentRouteLoader('Tunggu sebentar ...');
    this.profile();
      }, (error) => {
  console.log('ERROR: ', error);
  this.globalService.toastInfo(error.message ? error.message : 'Gagal, coba lagi masukkan password', 3000, 'bottom');
           });
       }
   }
}
change(kuncihash): void {
  console.log('password: ', this.userid);
  console.log('password: ', kuncihash);
  if (this.changeForm.value.newpassword !== '' && this.changeForm.value.confirmpassword !== '') {
    if (this.changeForm.value.newpassword === this.changeForm.value.confirmpassword) {
  console.log('newpassword', this.changeForm.value);
  console.log('confirmpassword', this.changeForm.value.confirmpassword);
  // tslint:disable-next-line:align
  this.dataservice.changepass(this.tokenid, this.userid, kuncihash).subscribe((result) => {
  console.log('hasil change pass', result);
  this.globalService.toastInfo('Selamat, password berhasil diubah', 3000, 'bottom');
  this.profile();
    }, (error) => {
console.log('ERROR: ', error);
this.globalService.toastInfo(error.message ? error.message : 'Gagal, coba lagi masukkan password', 3000, 'bottom');
         });
     }
 }
}
  profile(): void {
    // this.nav.push(ProfilePage);
    this.nav.setRoot(ProfilePage);
  }
  decryptencrypt () {
    let key = CryptoJS.enc.Utf8.parse('7061737323313233');
    let iv = CryptoJS.enc.Utf8.parse('7061737323313233');
    let encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse('It works'), key,
        {
            keySize: 128 / 8,
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });

    let decrypted = CryptoJS.AES.decrypt(encrypted, key, {
        keySize: 128 / 8,
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });

    console.log('Encrypted :' + encrypted);
    console.log('Key :' + encrypted.key);
    console.log('Salt :' + encrypted.salt);
    console.log('iv :' + encrypted.iv);
    console.log('Decrypted : ' + decrypted);
    console.log('utf8 = ' + decrypted.toString(CryptoJS.enc.Utf8));
  }
}
