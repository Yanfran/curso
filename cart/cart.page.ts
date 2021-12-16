import { Component } from '@angular/core';
import { NavController, ModalController, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { NavigationExtras } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
// import { ConsoleReporter } from 'jasmine';


@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage {
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
    private toastController: ToastController) { 
      this.total = 0.0;      
      this.storage.ready().then(()=>{

        this.storage.get("cart").then( (data)=>{
          if(data==null){
            this.showEmptyCartMessage = true;
            return;
          }
          this.cartItems = data;
          console.log('Productos añadidos al carrito: ', this.cartItems);              

          if(this.cartItems.length > 0){

            this.cartItems.forEach( (item, index)=> {

              if(item.variation){
                this.total = this.total + (parseFloat(item.variation.price) * item.qty);                
                // console.log(item.variation.weight);                
                this.peso = item.variation.weight;
                console.log('Peso de variacion: ',this.peso);

              } else {
                this.total = this.total + (item.product.price * item.qty)                
                // console.log(item.product.weight);
                this.peso = item.product.weight
                console.log('Peso de producto: ',this.peso);

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
    this.storage.set("cart", this.cartItems).then( ()=> {
      this.total = this.total - (price * qty);
    });

    if(this.cartItems.length == 0){
      this.showEmptyCartMessage = true;
    }
    if(this.formMetodo.get("metodo").value!=""){
      this.cambioSelect();
    }
  }

  closeModal(){
    this.modalController.dismiss({
      'dismissed': true
    });
  }

  // closeModal(){
  //   this.navController.navigateForward('tabs/tab1');
  // }


  checkout(){
    this.storage.get("userLoginInfo").then( (data) => {
      if(data != null){
        this.modalController.dismiss().then(()=>{
          this.navController.navigateForward('checkout');
        });

        this.modalController.dismiss({
          'dismissed': true
        });
        
      } else {
        let navigationExtras: NavigationExtras = {
          state: {
            next: 'checkout'
          }
        };
        this.navController.navigateForward('login', navigationExtras)

        this.modalController.dismiss({
          'dismissed': true
        });
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
        this.presentToast("Carrito actualizado.");
      });
      this.total = (parseFloat(this.total.toString()) + (parseFloat(price.toString()) * change));
    }  
    if(this.formMetodo.get("metodo").value!=""){
      this.cambioSelect();
    }

  }
  async presentToast(pMessage) {
    const toast = await this.toastController.create({
      message: pMessage,
      duration: 2000
    });
    toast.present();
  }
 cambioSelect(){
   var metodo = [];
   metodo = this.metodosEnvio;
  var valor = this.formMetodo.get("metodo").value;
  var total = 0;
  this.cartItems.forEach(function (elemento) {

        if(elemento.variation){
          let price = parseFloat(elemento.variation.price);
          let  qty = elemento.qty;
          //let subtotal = (qty * price);
          var acumEspecial=0;
          var acumEspecial2=0;
          var acumPeso=0;
          for(var i=0; i<metodo.length; i++){
            if(metodo[i].id==valor){
              for(var j=0; j<metodo[i].peso.length; j++){
                let pesoFloat = parseFloat(elemento.variation.weight) * qty;
                let pesoMin = parseFloat(metodo[i].peso[j].min);
                let pesoMax = parseFloat(metodo[i].peso[j].max);
                let precioMetodo = parseFloat(metodo[i].peso[j].precio);
                
                  if(pesoFloat > pesoMax) {
                    acumEspecial = acumEspecial + precioMetodo;
                    acumPeso = acumPeso + pesoMax;
                  }

                  if((pesoFloat >= pesoMin) && (pesoFloat <= pesoMax)){

                      acumEspecial2 = ((price * qty) + (precioMetodo * (pesoFloat - acumPeso))) + ( precioMetodo - acumEspecial);

                  }
              }
            }

          }

//          console.log(metodo);
//          console.log(valor);
          elemento.amount = acumEspecial2.toFixed(2);
          total = total + parseFloat(acumEspecial2.toFixed(2));
          console.log(elemento);          
        }
      });
      console.log(total);
      this.total = total;
/*    for(var i=0; i<this.cartItems.length; i++){
      if(this.cartItems[i].variation){
        console.log("Hay Variantes");
        console.log(this.cartItems[i].variation);
      }else{
        console.log("No hay Variantes");
        console.log(this.cartItems[i].product);
      }
    }*/

  }


}
