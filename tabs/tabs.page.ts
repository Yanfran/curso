import { Component, OnInit } from '@angular/core';
import { ToastController, ModalController, NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { NavigationExtras } from '@angular/router';
import { Tab1Page } from '../tab1/tab1.page';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage implements OnInit  {

  // Cantidad
  cartItems: any[] = [];
  showEmptyCartMessage: boolean = false;
  total: any;
  peso: any;  
  cuentaCarro=0;
  constructor(
    private navController: NavController, 
    private storage: Storage, 
    private modalController: ModalController, 
    private toastController: ToastController
  ) {
    // Cantidad de producto
    this.storage.ready().then(()=>{

      this.storage.get("cart").then( (data)=>{
        if(data==null){
          this.showEmptyCartMessage = true;
          return;
        }
        this.cartItems = data;
        console.log(this.cartItems);              
        this.cuentaCarro = this.cartItems.length;
        if(this.cartItems.length > 0){

          this.cartItems.forEach( (item, index)=> {

            if(item.variation){
              this.total = this.total + (parseFloat(item.variation.price) * item.qty);                
              // console.log(item.variation.weight);                
              this.peso = item.variation.weight;
              console.log(this.peso);

            } else {
              this.total = this.total + (item.product.price * item.qty)                
              // console.log(item.product.weight);
              this.peso = item.product.weight
              console.log(this.peso);

            }

          })

        } else {

          this.showEmptyCartMessage = true;

        }
      })
    })

    console.log(this.cartItems);
  }
  ngOnInit(){}
  ionViewWillEnter(){
    console.log("Entrando");
    this.actualizar();
  }
  removeFromCart(item, i){
    let price;
    
    if(item.variation){
      price = item.variation.price
    } else {
      price = item.product.price;
    }
    let qty = item.qty;
    this.cartItems.splice(i, 1);
    this.storage.set("cart", this.cartItems).then( ()=> {
      this.total = this.total - (price * qty);
    });

    if(this.cartItems.length == 0){
      this.showEmptyCartMessage = true;
    }
  }

  closeModal(){
    this.modalController.dismiss();
  }

  checkout(){
    this.storage.get("userLoginInfo").then( (data) => {
      if(data != null){
        this.modalController.dismiss().then(()=>{
          this.navController.navigateForward('checkout');
        });
      } else {
        let navigationExtras: NavigationExtras = {
          state: {
            next: 'checkout'
          }
        };
        this.navController.navigateForward('Login', navigationExtras)
      }
    })

  }

  changeQty(item, i, change){    

    let price;
    
    
    if(!item.variation) {
      price = item.product.price;            
            
     } else {
      price = parseFloat(item.variation.price);                             

      let  qty = item.qty;
      if(change < 0 && item.qty == 1){
        return;
      }
      qty = qty + change;
      item.qty = qty;
      item.amount = qty * price;
      this.cartItems[i] = item;
      this.storage.set("cart", this.cartItems).then( ()=> {
        this.presentToast("Carrito Actualizado.");
      });
      this.total = (parseFloat(this.total.toString()) + (parseFloat(price.toString()) * change));
    }  
  }
  async presentToast(pMessage) {
    const toast = await this.toastController.create({
      message: pMessage,
      duration: 2000
    });
    toast.present();
  }

  async actualizar(){
    this.cuentaCarro = this.cartItems.length;
  }


}
