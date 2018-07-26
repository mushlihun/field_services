export class OrderModel {
  constructor(public _id: string,
              public departure: string,
              public destination: string,
              public datetime: Date = new Date()
            ) {
  }
}
