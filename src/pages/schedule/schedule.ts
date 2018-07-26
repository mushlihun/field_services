import { NavController, ModalController } from 'ionic-angular';
import { Component } from '@angular/core';
import { OrderPage } from '../order/order';
import { RideModel } from '../../providers/ride/ride.model';
import { RideService } from '../../providers/ride/ride.service';
@Component({
  templateUrl: 'schedule.html'
})
export class SchedulePage {
  public event = {
    month: '2018-04-27',
    timeStarts: '08:00',
    timeEnds: '2018-03-28'
  };
  private nav: NavController;
  constructor(public navCtrl: NavController,
              private modalCtrl: ModalController,
              private rideService: RideService,
  ) {
    //  constructor() {

  }
  goToOrder(model: RideModel, isValid: boolean): void {
    // this.rideService.addRide(model.departure, model.destination);
    this.nav.setRoot(OrderPage);
  }
}
