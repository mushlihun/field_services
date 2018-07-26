import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Network } from '@ionic-native/network';
import { FormControl, AbstractControl, FormGroup } from '@angular/forms';
import { Platform, AlertController, ToastController, LoadingController, ActionSheetController } from 'ionic-angular';
import 'rxjs/add/operator/map';

declare var Connection;
declare var navigator;

interface ValidationResult {
    [key: string]: boolean;
}

@Injectable()
export class GlobalServiceProvider {
  onDevice: boolean;
  disconnect: boolean = false;
  loading: any;
  showFooter: boolean = false;
  tabIndex: any;

  constructor(
    public http: Http,
    public platform: Platform,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public actionSheetCtrl: ActionSheetController,
    private network: Network
  ) {
      this.onDevice = this.platform.is('cordova') || this.platform.is('android') || this.platform.is('ios');
    }

  // Network services
  isOnline(): boolean {
    if (this.onDevice && this.network.type) {
      return this.network.type !== Connection.NONE;
    } else {
      return navigator.onLine;
    }
  }

  isOffline(): boolean {
    if (this.onDevice && this.network.type) {
      return this.network.type === Connection.NONE;
    } else {
      return !navigator.onLine;
    }
  }

  // Toast services
  toastInfo(message, duration, position) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: duration,
      position: position
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }

  // Action sheet services
  presentActionSheet(title, firstIcon, firstText, secondIcon, secondText, firstCallback, secondCallback) {
    let actionSheet = this.actionSheetCtrl.create({
      title: title,
      buttons: [{
        icon: firstIcon,
        text: firstText,
        handler: firstCallback,
      }, {
        icon: secondIcon,
        text: secondText,
        handler: secondCallback,
      }]
    });

    return actionSheet.present();
  }

  // Alert loading services
  showLoader() {
    this.loading = this.loadingCtrl.create({
      content: '',
      showBackdrop: false,
      spinner: 'bubbles'
    });

    this.loading.present();
  }

  dismissLoader() {
    return this.loading.dismiss();
  }

  // Alert services
  presentAlert(title, message, text, customClass, callback) {
    let presentAlert = this.alertCtrl.create({
      title: title,
      message: message,
      cssClass: customClass,
      buttons: [{
        text: text,
        handler: callback
      }]
    });

    presentAlert.present();
  }

  // Alert with form input
  presentAlertInput(title, inputs, text, customClass, callback) {
    let presentAlert = this.alertCtrl.create({
      title: title,
      inputs: inputs,
      cssClass: customClass,
      buttons: [{
        text: text,
        handler: callback
      }]
    });

    presentAlert.present();
  }

  // Alert radio confirm services
presentRadioConfirm(title, message, customClass, inputType1, inputType2, inputType3,
  confirmCallback, cancelCallback, confirmText, dismissText) {
    let presentConfirm = this.alertCtrl.create({
      title: title,
      message: message,
      cssClass: customClass,
      buttons: [{
        text: confirmText,
        handler: confirmCallback
      }, {
        text: dismissText,
        role: 'cancel',
        handler: cancelCallback
      }]
    });

    presentConfirm.addInput(inputType1);
    presentConfirm.addInput(inputType2);
    presentConfirm.addInput(inputType3);

    presentConfirm.present();
  }

  presentConfirm(title, message, confirmCallback, cancelCallback, confirmText, dismissText) {
    let presentConfirm = this.alertCtrl.create({
      title: title,
      message: message,
      buttons: [{
        text: dismissText,
        role: 'cancel',
        handler: cancelCallback
      }, {
        text: confirmText,
        handler: confirmCallback
      }]
    });

    presentConfirm.present();
  }

  // Alert radio button
  presentRadio() {

  }

  // Alert checkbox
  presentCheckbox() {

  }

  // IDR curreny format
  toIDR(nominal) {
    let rev     = parseInt(nominal, 10).toString().split('').reverse().join('');
    let rev2    = '';
    for ( let i = 0; i < rev.length; i++) {
        rev2  += rev[i];
        if ((i + 1) % 3 === 0 && i !== (rev.length - 1)) {
            rev2 += '.';
        }
    }
    return  rev2.split('').reverse().join('') + '';
  }

  // Email validation
  validateEmail(control: FormControl): ValidationResult {
    // tslint:disable-next-line:max-line-length
    let checkMail = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (control.value !== '' && !checkMail.test(control.value)) {
      return {'incorrectMailFormat': true};
    }

    return null;
  }

  // Number only validation
  validateNumberOnly(control: FormControl): ValidationResult {
    let checkInputNumber = /^-?\d+?\d*$/;
    if (control.value !== '' && !checkInputNumber.test(control.value)) {
      return {'incorrectInputFormat': true};
    }

    return null;
  }

  validateMobilePhone(control: FormControl): ValidationResult {
    let checkInputNumber = /^[1-9][0-9 -+]*$/;

    if (control.value !== '' && !checkInputNumber.test(control.value)) {
      return {'incorrectInputFormat': true};
    }

    return null;
  }

  // Validate uppercase, lowercase, number & string characters
  validatePassword(control: FormControl): ValidationResult {
    let checkInputValue = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@!?])[A-Za-z\d@!?]{8,}/;
    if (control.value !== '' && !checkInputValue.test(control.value)) {
      return {'incorrectInputFormat': true};
    }

    return null;
  }

  validateMatchingPasswords(firstKey: string, secondKey: string) {
    return (group: FormGroup): {[key: string]: any} => {
      let first = group.controls[firstKey];
      let second = group.controls[secondKey];

      if (first.value !== second.value) {
        return {
          mismatchedPasswords: true
        };
      }
    };
  }

  // tslint:disable-next-line:member-ordering
  static areEqual(abstractControl: AbstractControl) {
    let newPassword = abstractControl.get('new_password').value;
    let confirmNewPassword = abstractControl.get('confirm_new_password').value;
    if (newPassword !== confirmNewPassword) {
      abstractControl.get('confirm_new_password').setErrors({areEqual: true});
    } else {
      return null;
    }
  }

  // Random string/number
  uniqueId() {
    let text = '';
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < 5; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
  }

  // Password validation
  passwordValidation(_password, _confirmPassword) {
if (_password.toUpperCase() !== _confirmPassword.toUpperCase()) {
return false;
}

return true;
}

  setActiveTabsIndex(_index) {
    return this.tabIndex = _index;
  }

  getActiveTabsIndex() {
    return this.tabIndex;
  }
}
