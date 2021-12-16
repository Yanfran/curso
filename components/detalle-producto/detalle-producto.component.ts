import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular'
import { Storage } from '@ionic/storage';
import { NavController, ToastController, LoadingController, IonSlides} from '@ionic/angular';

@Component({
  selector: 'app-detalle-producto',
  templateUrl: './detalle-producto.component.html',
  styleUrls: ['./detalle-producto.component.scss'],
})
export class DetalleProductoComponent implements OnInit {
    public images;
    public name;
    public descripcion;
    public categorias;
    public dimensiones;
    public peso;
    public precio1;
    public precio2;
    public stock;
    public variaciones;
    selectedOptions: any = {};
    public atributos: any[] = [];
    public opciones;
    cuentaCarro=0;
    product: any;

  constructor(
    private modalController: ModalController,
    private storage: Storage, 
    private toastController: ToastController
    ) { 

    // this.CuentaCarroC();    

    }

  ngOnInit() {
    console.log("Modal");
    console.log(this.atributos);
//    this.opciones = this.atributos
  }

  async presentToast(pMessage) {
    const toast = await this.toastController.create({
      message: pMessage,
      duration: 3000
    });
    toast.present();
  }

  // CuentaCarroC(){
  //     this.storage.get("cart").then( (data) => {

  //       if(data==null){
  //         this.presentToast("Carrito Vacio");
  //         return;
  //       }

  //       this.prueba = data;
  //       console.log(this.prueba); 
  //       this.cuentaCarro = this.prueba.length;
  //     })
  // }

  close() {    
    this.modalController.dismiss({
      'dismissed': true
    });
  }

}
