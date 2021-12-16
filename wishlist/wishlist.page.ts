import { Component, OnInit } from '@angular/core';
import { NavController, ModalController, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { NavigationExtras } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.page.html',
  styleUrls: ['./wishlist.page.scss'],
})
export class WishlistPage implements OnInit {

  selectedVal;
  cartItems: any[] = [];
  total: any;
  showEmptyCartMessage: boolean = false;
  peso: any;
  public metodosEnvio: any;
  formMetodo = new FormGroup({
    metodo: new FormControl('', [Validators.required])
  });

  constructor(
    private navController: NavController, 
    private storage: Storage, 
    private modalController: ModalController, 
    private toastController: ToastController
    ) {
      this.total = 0.0;      
      this.storage.ready().then(()=>{

        this.storage.get("wishList").then( (data)=>{
          if(data==null){
            this.showEmptyCartMessage = true;
            return;
          }
          this.cartItems = data;
          console.log(this.cartItems);              

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
        this.metodosEnvio = [
          /////// INICIO DE METODOS DE PAGO
          { 
            id: "tables_rate",
            title: "Precio por peso", 
            peso: [
              {
                min: 0.0,
                max: 0.5,
                precio: 14.5
              },
              {
                min: 0.50001,
                max: 9999999,
                precio: 28.99
              }
            ] 
          }
          /////// FIN DE METODOS DE PAGO
        ];
        console.log(this.metodosEnvio);
      })
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
          this.storage.set("wishList", this.cartItems).then( ()=> {
            this.total = this.total - (price * qty);
          });

          if(this.cartItems.length == 0){
            this.showEmptyCartMessage = true;
          }
          if(this.formMetodo.get("metodo").value!=""){
            // this.cambioSelect();
          }
        }

        closeModal(){
          this.modalController.dismiss({
            'dismissed': true
          });
        }


      changeQty(item, i, change){    

        let price;
        
        
        if(!item.variation) {
          price = item.product.price;            
          
          
         // } else {
          // price = parseFloat(item.variation.price);             
            

          let  qty = item.qty;
          if(change < 0 && item.qty == 1){
            return;
          }
          qty = qty + change;
          item.qty = qty;
          item.amount = qty * price;
          this.cartItems[i] = item;
          this.storage.set("wishList", this.cartItems).then( ()=> {
            this.presentToast("Producto actualizado.");
          });
          this.total = (parseFloat(this.total.toString()) + (parseFloat(price.toString()) * change));
        }
        if(this.formMetodo.get("metodo").value!=""){
          // this.cambioSelect();
        }

      }

      async presentToast(pMessage) {
        const toast = await this.toastController.create({
          message: pMessage,
          duration: 2000
        });
        toast.present();
      }

  ngOnInit() {
  }


    close() {    
/*    this.modalController.dismiss({
      'dismissed': true
    });*/
    this.navController.navigateForward('home');
  }

}
