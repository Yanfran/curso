import { Component, OnInit } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { ToastController, LoadingController, MenuController } from '@ionic/angular';
import { LinkService } from '../link.service';
import { ViewChild } from '@angular/core';
//import { IonSegment } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.page.html',
  styleUrls: ['./orders.page.scss'],
})
export class OrdersPage implements OnInit {

//  @ViewChild(IonSegment, { static: true}) segment: IonSegment;

  id: number;
  orders: any[] = [];
  page: number = 2;
  loaders = [null, null];
  
  orders_link = "wp-json/wc/v2/orders?customer=";

  constructor(private httpClient: HttpClient,
    private toastController: ToastController,
    private storage: Storage,
    private loadingController: LoadingController,
    private linkService: LinkService,
    private router: Router,
    private menuCtrl: MenuController
    ) {
    this.storage.get("userLoginInfo").then((userLoginInfo) => {
      this.id = userLoginInfo.user.id;

      // this.presentLoader(0);
      this.httpClient.get(this.linkService.getAPILink() + this.orders_link+ this.id + '&consumer_key='+ this.linkService.getConsumerKey() + '&consumer_secret='+this.linkService.getConsumerSecret()).subscribe((data: any)=>{
        // this.dismissLoader(0);
        this.orders  = data;
          console.log(this.orders);
      },
      (err)=>{
        this.dismissLoader(0);
        console.log(err);
      });
    })
   }

  ngOnInit() {
//    this.segment.value = 'ordenes';
  }

  async presentLoader(num) {
    this.loaders[num] = await this.loadingController.create({
      message: 'Por favor espere...'
    });
    await this.loaders[num].present();
  }

  async dismissLoader(num) {
    if(this.loaders[num]==null) return;
      await this.loaders[num].dismiss()
      .then(()=>{
        this.loaders[num] = null;
      })
      .catch(e => console.log(e));
  }

  async presentToast(pMessage) {
    const toast = await this.toastController.create({
      message: pMessage,
      duration: 5000
    });
    toast.present();
  }

  loadMoreOrders(event){
    this.presentLoader(1);
    this.httpClient.get(this.linkService.getAPILink() + this.orders_link+ this.id + "&page=" + this.page + '&consumer_key='+ this.linkService.getConsumerKey() + '&consumer_secret='+this.linkService.getConsumerSecret()).subscribe((data: any)=>{
      this.dismissLoader(1);
      this.orders  = this.orders.concat(data);
      console.log(this.orders);

      if(data.length < 10 && event != null){
        event.target.disabled = true;
        this.presentToast("No more orders!");

      }
      event.target.complete();
      this.page ++;
    },
    (err)=>{
      this.dismissLoader(1);
      console.log(err);
    });

  }


  segmentChangedO(event){
//      const valorSegmento = event.detail.value;
//      console.log(valorSegmento);
    }

  home(){
      this.router.navigate(['/home'])
    }

    preguntas(){
      this.router.navigate(['/preguntas-frecuentes'])
    }

    ordenes(){
      this.router.navigate(['/orders'])
    }

    onClick() {
    this.menuCtrl.toggle();
  }

}
