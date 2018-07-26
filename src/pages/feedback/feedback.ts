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
  times: any;
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
    Promise.all([this.storage.get('access_token')]).then((res) => {
      this.accesstoken = res[0];
      console.log('accesstoken', res[0]);
    });
    this.storage.get('trip_id').then((tripid) => {
      this.tripid = tripid;
      console.log('tripid', tripid);
    });
    this.storage.get('departure').then((depart) => {
      this.departure = depart;
      console.log('departure', depart);
    });
    this.storage.get('destinations').then((desti) => {
      this.destination = desti;
      console.log('destinations', desti);
    });
    this.storage.get('drivername').then((name) => {
      this.drivername = name;
      console.log('drivername', name);
    });
    this.storage.get('distance').then((distance) => {
      this.distances = distance;
      console.log('distance', distance);
    });
    this.storage.get('jarak').then((jarak) => {
      this.times = jarak;
      console.log('time', jarak);
    });
  }
  goToHome(): void {
    this.nav.push(TabsPage);
  }

  Feedback($event) {
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
      console.log('Sukses feedback', data);
      this.goToHome();
      }, (err) => {
        console.log(err);
      });
  }

  starClicked(value) {
    this.rate = value;
    console.log('Rated :', value);
 }

}
