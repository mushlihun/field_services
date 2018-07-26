export class RideModel {
  constructor(public _id: string,
              public departure: string,
              public destination: string,
              public rideDate: Date = new Date(),
              // public pickup: string,
              // public dropoff: string,
              // public driverId: string,
              // public datetime: Date
            ) {
  }
}
