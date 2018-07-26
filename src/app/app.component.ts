import { TabsPage } from './../pages/tabs/tabs';
import { FeedbackPage } from './../pages/feedback/feedback';
import { ChangePage } from './../pages/change/change';
import { SchedulePage } from './../pages/schedule/schedule';
import { SplashPage } from '../pages/splash/splash';
import { LoginPage } from '../pages/login/login';
import { ProfilePage } from '../pages/profile/profile';
import { Component, ViewChild } from '@angular/core';
import { Platform, Nav, ModalController, LoadingController, AlertController, ToastController } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
import { HomePage } from '../pages/home/home';

export interface PageInterface {
  title: string;
  component: any;
  icon: string;
  logsOut?: boolean;
  index?: number;
  tabComponent?: any;
  LoginPage?: any;
}
@Component({
  templateUrl: 'app.template.html',
})
export class TaxiApp {
  // rootPage: any;
  appPages: PageInterface[] = [
    {title: 'Map', component: HomePage, index: 1, icon: 'map'},
    {title: 'Feedback', component: FeedbackPage, index: 3, icon: 'information-circle'},
    {title: 'Login', component: LoginPage, index: 4, icon: 'log-in'},
    {title: 'Change', component: ChangePage, index: 6, icon: 'key'},
    {title: 'Tab', component: TabsPage, index: 7, icon: 'keypad'},
  ];
  rootPage: any = LoginPage;
  // the root nav is a child of the root app component
  // @ViewChild(Nav) gets a reference to the app's root nav
  @ViewChild(Nav) private nav: Nav;

  constructor(private platform: Platform) {
    // check logged in status
    // var that = this;

  	// firebase.auth().onAuthStateChanged((user) => {
		// if(user){
		// 	that.rootPage = TabsPage;
    // }else 
    // {
			// this.rootPage = LoginPage;
        // this.rootPage = FirstRunPage;
		// }

	// });
    // Call any initial plugins when ready
    // this.rootPage = FirstRunPage;
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();
      // this.backgroundMode.enable();
      // if (typeof FCMPlugin !== 'undefined') {
      //   FCMPlugin.getToken((token) => {
      //   console.log(token);
      //   console.log('gettoken');
      //   }, (error) => {
      //   console.log('error', error);
      //   }
      //   );
      // // function onDeviceReady() {
      //   FCMPlugin.onNotification(function(data){
      //     // this.backgroundMode.enable();
      //     if (data.wasTapped) {
      //     console.log('Received in background');
      //     console.log(JSON.stringify(data));
      //     } else {
      //     console.log('Received in foreground');
      //     console.log(JSON.stringify(data));
      //     }
      //   },
      //     function(msg){
      //     console.log('onNotification callback successfully registered: ' + msg);
      //     },
      //     function(err){
      //     console.log('Error registering onNotification callback: ' + err);
      //     });
      //   FCMPlugin.onTokenRefresh((token) => {
      //   console.log(token);
      //   }, (error) => {
      //   console.log(error);
      //   console.log('error');
      // });
      // });
    // }
      // setTimeout(() => {
      //   this.Splashscreen.hide();
      // }, 500);
      // https://github.com/apache/cordova-plugin-inappbrowser
      // The cordova.InAppBrowser.open() function is defined to be a drop-in replacement for the window.open()
      // function. Existing window.open() calls can use the InAppBrowser window, by replacing window.open:
      if ((<any>window).cordova && (<any>window).cordova.InAppBrowser) {
        window.open = (<any>window).cordova.InAppBrowser.open;
      }
    });
  }
  // ngOnInit() {
  //   let _rootPage: any = LoginPage; // at the start it shows the tutorial page
  //   this.nav.setRoot(_rootPage);
  //   _rootPage = LoginPage;
  //   };
  openPage(page: PageInterface) {
    // openPage(page) {
    // the nav component was found using @ViewChild(Nav)
    // reset the nav to remove previous pages and only have this page
    // we wouldn't want the back button to show in this scenario
    if (page.index) {
      // this.nav.setRoot(page.component, { tabIndex: page.index });
      this.nav.setRoot(page.component, { tabIndex: page.index });
    } else {
      this.nav.setRoot(page.component).catch(() => {
        console.log("Didn't set nav root");
      });
    }
  }
}
