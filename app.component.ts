import { Component } from '@angular/core';
import { Platform, NavController, ModalController, ToastController, LoadingController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Storage } from '@ionic/storage';
import { EventsService } from './events.service';

import { HttpClient } from '@angular/common/http';

import { NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public router: Router
  ) {
    this.hola();
  }

  hola(){
    alert("Hola yan");
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.overlaysWebView(false);
      this.statusBar.backgroundColorByHexString('#D9D9D9');
      // this.statusBar.styleDefault();
      this.splashScreen.hide();      
      // this.router.navigateByUrl('splash');
      // if (this.platform.is('cordova')) {
      //   this.setupPush();
      // }
    });
  }
}
