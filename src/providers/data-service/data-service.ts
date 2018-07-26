import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import Config, { ApiHelper } from '../../config/global';
import { GlobalServiceProvider } from '../../providers/global-service/global-service';

/*
  Generated class for the DataServiceProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class DataServiceProvider {

  constructor(public http: Http, private connectivityService: GlobalServiceProvider, public api: ApiHelper) {}
feedback(token, data) {
    if (this.connectivityService.isOnline()) {
      let headers = new Headers();
      headers.append('Content-Type', 'application/x-www-form-urlencoded');
      headers.append('Authorization', 'Bearer ' + token);
      let options = new RequestOptions({headers: headers});
      let body = this.formData(data);
      return this.http.post(this.api.getApiUrl (Config.apis.feedback), body, options).map(res => res.json());
    } else {
      this.connectivityService.toastInfo('You are offline, please check your internet connection', 3000, 'top');
    }
  }
  // Get user by user_id
getUser(token, id) {
  if (this.connectivityService.isOnline()) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    headers.append('Authorization', 'Bearer ' + token);
    let options = new RequestOptions({headers: headers});
    return this.http.get(this.api.getApiUrl (Config.apis.users + id), options).map(res => res.json());
  } else {
    this.connectivityService.toastInfo('You are offline, please check your internet connection', 3000, 'top');
  }
}
getUsers(token, id) {
  if (this.connectivityService.isOnline()) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    headers.append('Authorization', 'Bearer ' + token);
    let options = new RequestOptions({headers: headers});
    return this.http.get(this.api.getApiUrl(Config.apis.user +
    // tslint:disable-next-line:max-line-length
'?filter_groups[0][filters][0][key]=id&filter_groups[0][filters][0][value]=' + id + '&filter_groups[0][filters][0][operator]=eq'), options).map(res => res.json());

  } else {
    this.connectivityService.toastInfo('You are offline, please check your internet connection', 3000, 'top');
  }
}
getdriver(token) {
  if (this.connectivityService.isOnline()) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    headers.append('Authorization', 'Bearer ' + token);
    let options = new RequestOptions({headers: headers});
    return this.http.get(this.api.getApiUrl
      (Config.apis.drivers), options).map(res => res.json());
  } else {
    this.connectivityService.toastInfo('You are offline, please check your internet connection', 3000, 'top');
  }
}

createstatus(token, data, id) {
  if (this.connectivityService.isOnline()) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Bearer ' + token);
    let options = new RequestOptions({headers: headers});
    console.log(options);
    // let body =  this.formData(data);
    let body =  data;
    console.log(body);
    return this.http.patch(this.api.getApiUrl (Config.apis.driver + id), body, options).map(res => res.json());
  } else {
    this.connectivityService.toastInfo('You are offline, please check your internet connection', 3000, 'top');
  }
}
divisions(token) {
  if (this.connectivityService.isOnline()) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    headers.append('Authorization', 'Bearer ' + token);
    let options = new RequestOptions({headers: headers});
    return this.http.get(this.api.getApiUrl (Config.apis.division), options).map(res => res.json());
  } else {
    this.connectivityService.toastInfo('You are offline, please check your internet connection', 3000, 'top');
  }
}
push(token, data, tokendriver) {
  if (this.connectivityService.isOnline()) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    headers.append('Authorization', 'Bearer ' + token);
    let options = new RequestOptions({headers: headers});
    let body = this.formData(data);
    return this.http.post(this.api.getApiUrl
      (Config.apis.push + tokendriver), body, options).map(res => res.json());
  } else {
    this.connectivityService.toastInfo('You are offline, please check your internet connection', 3000, 'top');
  }
}
trip(token, tripid) {
  if (this.connectivityService.isOnline()) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    headers.append('Authorization', 'Bearer ' + token);
    let options = new RequestOptions({headers: headers});
    return this.http.get(this.api.getApiUrl (Config.apis.trip + tripid), options).map(res => res.json());
  } else {
    this.connectivityService.toastInfo('You are offline, please check your internet connection', 3000, 'top');
  }
}
trips(token, userid) {
  if (this.connectivityService.isOnline()) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    headers.append('Authorization', 'Bearer ' + token);
    let options = new RequestOptions({headers: headers});
    // tslint:disable-next-line:max-line-length
    return this.http.get(this.api.getApiUrl (Config.apis.trips + '?filter_groups[0][filters][0][key]=passenger_id&filter_groups[0][filters][0][value]=' + userid + '&filter_groups[0][filters][0][operator]=eq&sort[0][key]=id&sort[0][direction]=ASC&limit=10&page=0'), options).map(res => res.json());
  } else {
    this.connectivityService.toastInfo('You are offline, please check your internet connection', 3000, 'top');
  }
}
offtrip(token, tripid) {
  if (this.connectivityService.isOnline()) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    headers.append('Authorization', 'Bearer ' + token);
    let options = new RequestOptions({headers: headers});
    return this.http.delete(this.api.getApiUrl (Config.apis.trip + tripid), options).map(res => res.json());
  } else {
    this.connectivityService.toastInfo('You are offline, please check your internet connection', 3000, 'top');
  }
}
createtrips(token, data) {
  if (this.connectivityService.isOnline()) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    headers.append('Authorization', 'Bearer ' + token);
    let options = new RequestOptions({headers: headers});
    let body = this.formData(data);
    // let body = data;
    return this.http.post(this.api.getApiUrl (Config.apis.trips), body, options).map(res => res.json());
  } else {
    this.connectivityService.toastInfo('You are offline, please check your internet connection', 3000, 'top');
  }
}
changepass(token, id, data) {
  if (this.connectivityService.isOnline()) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Bearer ' + token);
    let options = new RequestOptions({headers: headers});
    let body = data;
    console.log('bodychangepass', body);
    return this.http.patch(this.api.getApiUrl (Config.apis.users + id), body, options).map(res => res.json());
  } else {
    this.connectivityService.toastInfo('You are offline, please check your internet connection', 3000, 'top');
  }
}

waypoints(token, id) {
  if (this.connectivityService.isOnline()) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    headers.append('Authorization', 'Bearer ' + token);
    let options = new RequestOptions({headers: headers});
    // tslint:disable-next-line:max-line-length
    return this.http.get(this.api.getApiUrl (Config.apis.waypoint + '?filter_groups[0][filters][0][key]=trip_id&filter_groups[0][filters][0][value]=' + id + '&filter_groups[0][filters][0][operator]=eq&sort[0][key]=id&sort[0][direction]=DES&limit=1000&page=0'),
      options).map(res => res.json());
  } else {
    this.connectivityService.toastInfo('You are offline, please check your internet connection', 3000, 'top');
  }
}
waypointx(token, data) {
  if (this.connectivityService.isOnline()) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    headers.append('Authorization', 'Bearer ' + token);
    let options = new RequestOptions({headers: headers});
    let body = this.formData(data);
    // let body = data;
    return this.http.post(this.api.getApiUrl (Config.apis.waypoint), body, options).map(res => res.json());
  } else {
    this.connectivityService.toastInfo('You are offline, please check your internet connection', 3000, 'top');
  }
}
waypoint(token, data) {
  if (this.connectivityService.isOnline()) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    headers.append('Authorization', 'Bearer ' + token);
    let options = new RequestOptions({headers: headers});
    let body = this.formData(data);
    return this.http.post(this.api.getApiUrl (Config.apis.waypoint), body, options).map(res => res.json());
  } else {
    this.connectivityService.toastInfo('You are offline, please check your internet connection', 3000, 'top');
  }
}
vehicles(token, driverid) {
  if (this.connectivityService.isOnline()) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    headers.append('Authorization', 'Bearer ' + token);
    let options = new RequestOptions({headers: headers});
    // tslint:disable-next-line:max-line-length
    return this.http.get(this.api.getApiUrl (Config.apis.vehicles + '?filter_groups[0][filters][0][key]=driver_id&filter_groups[0][filters][0][value]=' + driverid + '&filter_groups[0][filters][0][operator]=eq'),
      options).map(res => res.json());
  } else {
    this.connectivityService.toastInfo('You are offline, please check your internet connection', 3000, 'top');
  }
}

  formData(data) {
    return Object.keys(data).map(function(key){
      return encodeURIComponent(key) + '=' + encodeURIComponent(data[key]);
    }).join('&');
  }

}
