import { TabsPage } from './../tabs/tabs';
import { DataServiceProvider } from './../../providers/data-service/data-service';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { LoadingController, AlertController, ModalController, NavController, Platform, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
@Component({
  templateUrl: 'feedback.html',
})
export class FeedbackPage {
  @ViewChild('komens', {read: ElementRef}) komens: ElementRef;
  datafeedback: any = [];
  accesstoken: any;
  departure: any;
  destination: any;
  drivername: any;
  komen: string = null;
  rate: any;
  tripid: any;
  distances: any;
  triptime: any;
  title: any;
  public feedback: any;
  constructor(private platform: Platform,
    private nav: NavController,
    private modalCtrl: ModalController,
    private loadingCtrl: LoadingController,
    protected alertCtrl: AlertController,
    public dataservice: DataServiceProvider,
    public storage: Storage,
    public navParams: NavParams) {
  }
// tslint:disable-next-line:max-line-length
// constructor(public navCtrl: NavController, public storage: Storage, public pop: PopUpProvider, public navParams: NavParams, public prof: ProfileProvider) {

  ionViewDidEnter() {
    this.storage.set('feedbackPage', true);
    this.storage.set('ordered', false);
    this.storage.get('tripid').then((tripid) => {
      this.tripid = tripid;
      console.log('tripid di feedbackpage', tripid);
    });
    Promise.all([this.storage.get('access_token')]).then((res) => {
    this.accesstoken = res[0];
    console.log('accesstoken', res[0]);
    console.log('tripid', this.tripid);
    this.storage.get('times').then((times) => {
      console.log('this.triptime1', times);
      this.triptime = times;
      });
    });
    this.storage.get('departure').then((depart) => {
      this.storage.get('wpickup_location').then((wpickuplocation) => {
      this.departure = depart;
      this.departure = wpickuplocation;
      console.log('departure', depart);
      console.log('wpickup_location', wpickuplocation);
      });
    });
    this.storage.get('destination').then((desti) => {
      this.storage.get('wdropoff_location').then((wdropofflocation) => {
      this.destination = wdropofflocation;
      console.log('wdropoff_location', wdropofflocation);
    });
  });
    this.storage.get('gender').then((gender) => {
      if (gender === 'Male') {
        this.title = 'Mr';
        console.log('pria', gender);
      } else if (gender === 'Female') {
        this.title = 'Mrs';
        console.log('wanita', gender);
      }
    });
    this.storage.get('drivername').then((name) => {
      this.drivername = name;
      console.log('drivername', name);
    });
    this.storage.get('distance').then((distance) => {
    this.distances = distance;
    console.log('distance', distance);
    });
    this.storage.get('times').then((times) => {
    console.log('this.triptime', times);
    this.triptime = times;
    });
  }
  goToHome(): void {
    this.nav.push(TabsPage);
  }

  submitfeedback() {
    this.storage.get('tripid').then((tripid) => {
      this.tripid = tripid;
      console.log('tripid', tripid);
    });
    this.storage.set('feedbackPage', false);
    let komen = this.komen;
    let bintang = this.rate;
    console.log('Nilai', bintang);
    this.datafeedback = {
      'feedback[a]' : '',
      'feedback[trip_id]' : this.tripid,
      'feedback[rating]' : bintang,
      'feedback[comment]' : komen,
      'feedback[b]' : ''
    };
    console.log('this.datafeedback', this.datafeedback);
    this.dataservice.feedback(this.accesstoken, this.datafeedback).subscribe((data) => {
      this.presentRouteLoader('Feedback berhasil masuk ...');
      console.log('Sukses feedback', data);
      this.storage.set('feedbackPage', false);
      this.storage.set('tripid', '' || null);
      this.storage.set('departure', '' || null);
      this.storage.set('destinations', '' || null);
      this.storage.set('drivername', '' || null);
      this.storage.set('distance', '' || null);
      this.storage.set('waypointid',  '' || null);
      this.storage.set('drivername',  '' || null);
      this.storage.set('gender',  '' || null);
      this.storage.set('noted',  '' || null);
      this.storage.set('plates',  '' || null);
      this.storage.set('times',  '' || null);
      this.storage.set('waktus',  '' || null);
      this.storage.set('wpickup_location',  '' || null);
      this.storage.set('wdropoff_location',  '' || null);
      this.storage.set('contact', '' || null);
      this.storage.set('statustrip', '' || null);
      this.storage.set('ordered', false);
      this.goToHome();
      }, (err) => {
        this.feedbacknot();
        console.log(err);
      });
  }

  starClicked(value) {
    this.rate = value;
    console.log('Rated :', value);
 }
 feedbacknot() {
  this.presentRouteLoader('Tunggu sebentar ...');
  const alert = this.alertCtrl.create({
    title: 'Armada User',
    subTitle: 'Mohon isi dahulu penilaian hasil perjalanan',
  });
  alert.present();
  let myInterval = setInterval(() => {
    alert.dismiss();
    clearInterval(myInterval);
  }, 1500);
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
}
