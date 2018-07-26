import { AlertController } from 'ionic-angular';

// The page the user lands on after opening the app and without a session
// export const FirstRunPage = LoginPage;

// // The main page the user will see as they use the app over a long period of time.
// // Change this if not using tabs
// export const MainPage = TabsPage;

// // The initial root pages for our tabs (remove if not using tabs)
// export const Tab1Root = HomePage;
// export const Tab2Root = OrderPage;
// export const Tab3Root = ProfilePage;

export class BasePage {

  constructor(protected alertCtrl: AlertController) {
  }

  displayErrorAlert(): void {
    const prompt = this.alertCtrl.create({
      title: 'ArmadaMAS User',
      message: 'Unknown error, please try again later',
      buttons: ['OK']
    });
    prompt.present();
  }
}
