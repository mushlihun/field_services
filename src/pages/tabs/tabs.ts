import { Component, ViewChild } from '@angular/core';
import { OrderPage } from '../order/order';
import { ProfilePage } from '../profile/profile';
import { HomePage } from '../home/home';
import { NavController, NavParams, Tabs } from 'ionic-angular';
import { DataServiceProvider } from '../../providers/data-service/data-service';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  tabHomeRoot: any = HomePage;
  tabOrderRoot: any = OrderPage;
  tabProfileRoot: any = ProfilePage;
  activeRoot: any;
  @ViewChild('tabsMenu') tabRef: Tabs;
  constructor(public navCtrl: NavController, public navParams: NavParams, public dataservice: DataServiceProvider) {
    // if (!localStorage.getItem('token')) {
    //   navCtrl.setRoot(TabsPage);
    // }
    this.activeRoot = this.navParams.get('activeRoot') || 0;
    this.tabRef = this.navCtrl.parent;
  }
}
