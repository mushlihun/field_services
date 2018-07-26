import * as uuid from 'node-uuid';
import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';
import { OrderModel } from './order.model';

@Injectable()
export class OrderService {
  listorder: Array<OrderModel> = [];

  constructor(public events: Events) {
  }

  addOrder(departure: string, destination: string): void {
    const model = new OrderModel(uuid.v4(), departure, destination);
    this.listorder.push(model);
  }

  listorderan(): Array<OrderModel> {
    return this.listorder;
  }
}
