import { Observable } from 'rxjs/Observable';

export class GeocoderServiceMock {

  public fakeResponse: any = null;

  public addressForlatLng(): Observable<any> {
    return Observable.of(this.fakeResponse);
  }

  public setResponse(data: any): void {
    this.fakeResponse = data;
  }
}
