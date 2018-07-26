import Config, { ApiHelper } from '../../config/global';
import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Storage } from '@ionic/storage';
import { GlobalServiceProvider } from '../../providers/global-service/global-service';
import 'rxjs/add/operator/map';

// let apiUrl = 'https://dbs.noxus.co.id/';

@Injectable()
export class AuthService {
  isLoggedIn = 'isLoggedIn';
  constructor(public http: Http,
              private connectivityService: GlobalServiceProvider,
              private storage: Storage,
              public events: Events,
              private api: ApiHelper) {}

  loggedIn(): Promise<boolean> {
    return this.storage.get(this.isLoggedIn).then((value) => {
      return value === true;
    });
  };

  logout(token, id, data) {
    if (this.connectivityService.isOnline()) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Bearer ' + token);
    let options = new RequestOptions({headers: headers});
    let body = data;
    console.log('bodylogout', body);
    return this.http.patch(this.api.getApiUrl (Config.apis.users + id), body, options).map(res => res.json());
    }else {
      this.connectivityService.toastInfo('You are offline, please check your internet connection', 3000, 'top');
    }
    this.storage.set('user_id', '' || null);
    this.storage.set('division_id', '' || null);
    this.storage.set('access_level', null);
    this.storage.set('access_token', null);
    this.storage.set(this.isLoggedIn, false);
  };
  broadcastUpdateAuth() {
    this.events.publish('user:loginFromUnitDetail');
    this.events.publish('user:loginFromProductDetail');
    this.events.publish('user:loginFromTransaction');
    this.events.publish('user:loginFromProfile');
  }

  authenticate(data) {
      if (this.connectivityService.isOnline()) {
        let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});
        let options = new RequestOptions({headers: headers});
        let body = this.formData(data);
        console.log('data' + this.formData(data));
        return this.http.post(this.api.getApiUrl(Config.apis.login), body, options).map(res => res.json());
      } else {
        this.connectivityService.toastInfo('You are offline, please check your internet connection', 3000, 'top');
      }
  }
  getUser(token, id) {
    if (this.connectivityService.isOnline()) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    headers.append('Authorization', 'Bearer ' + token);
    let options = new RequestOptions({headers: headers});
    return this.http.post(this.api.getApiUrl (Config.apis.users + id), null, options).map(res => res.json());
   } else {
     this.connectivityService.toastInfo('You are offline, please check your internet connection', 3000, 'top');
          }
  }
  updatetokenFCm(token, id, data) {
    if (this.connectivityService.isOnline()) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Bearer ' + token);
    let options = new RequestOptions({headers: headers});
    let body =  data;
    console.log('bodytokenfcm', body);
    return this.http.patch(this.api.getApiUrl (Config.apis.users + id), body, options).map(res => res.json());
   } else {
     this.connectivityService.toastInfo('You are offline, please check your internet connection', 3000, 'top');
          }
  }
  getDriver(token) {
    if (this.connectivityService.isOnline()) {
      let headers = new Headers();
      headers.append('Content-Type', 'application/x-www-form-urlencoded');
      headers.append('Authorization', 'Bearer ' + token);
      let options = new RequestOptions({headers: headers});
      // tslint:disable-next-line:max-line-length
      return this.http.get(this.api.getApiUrl (Config.apis.drivers + '?includes[]=users&filter_groups[0][filters][0][key]=status&filter_groups[0][filters][0][value]=available&filter_groups[0][filters][0][operator]=eq&sort[0][key]=mileage&sort[0][direction]=ASC&limit=10&page=0'),
        options).map(res => res.json());
    } else {
      this.connectivityService.toastInfo('You are offline, please check your internet connection', 3000, 'top');
    }
  }
  getDivisions(token, divisionid) {
    if (this.connectivityService.isOnline()) {
      let headers = new Headers();
      headers.append('Content-Type', 'application/x-www-form-urlencoded');
      headers.append('Authorization', 'Bearer ' + token);
      let options = new RequestOptions({headers: headers});
      return this.http.get(this.api.getApiUrl (Config.apis.division + divisionid), options).map(res => res.json());
    } else {
      this.connectivityService.toastInfo('You are offline, please check your internet connection', 3000, 'top');
    }
  }
  getDivision(token, siteid) {
    if (this.connectivityService.isOnline()) {
      let headers = new Headers();
      headers.append('Content-Type', 'application/x-www-form-urlencoded');
      headers.append('Authorization', 'Bearer ' + token);
      let options = new RequestOptions({headers: headers});
      // tslint:disable-next-line:max-line-length
      return this.http.get(this.api.getApiUrl (Config.apis.divisions + '?filter_groups[0][filters][0][key]=site_id&filter_groups[0][filters][0][value]=' + siteid + '&filter_groups[0][filters][0][operator]=eq'), options).map(res => res.json());
    } else {
      this.connectivityService.toastInfo('You are offline, please check your internet connection', 3000, 'top');
    }
  }
  sendNotification(token, data) {
    if (this.connectivityService.isOnline()) {
      let headers = new Headers();
      headers.append('Content-Type', 'application/x-www-form-urlencoded');
      headers.append('Authorization', 'Bearer ' + token);
      let options = new RequestOptions({headers: headers});
      let body = data;
      return this.http.post('https://fcm.googleapis.com/fcm/send', body, options).map(res => res.json());
    } else {
      this.connectivityService.toastInfo('You are offline, please check your internet connection', 3000, 'top');
    }
  }
  formData(data) {
    return Object.keys(data).map(function(key){
      return encodeURIComponent(key) + '=' + encodeURIComponent(data[key]);
    }).join('&');
  }
  distance(origin, destination) {
    if (this.connectivityService.isOnline()) {
      let headers = new Headers();
// tslint:disable-next-line:max-line-length
      return this.http.get('https://maps.googleapis.com/maps/api/distancematrix/json', '?origins=' + origin + '&destinations=' + destination + '&key=AIzaSyDV5IIf5Y4TcyS1A6gmWkDL_NfuXb2hUYY', ).map(res => res.json());
    } else {
      this.connectivityService.toastInfo('You are offline, please check your internet connection', 3000, 'top');
    }
  }

}
