import { Component, OnInit } from '@angular/core';
import { NavController, ToastController, LoadingController, IonSlides, MenuController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { NavigationExtras } from '@angular/router';
import { LinkService } from '../../link.service';
import { ViewChild } from '@angular/core';
import { Storage } from '@ionic/storage';

import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu-category',
  templateUrl: './menu-category.component.html',
  styleUrls: ['./menu-category.component.scss'],
})
export class MenuCategoryComponent implements OnInit {
  page: number;  
  loaders = [null, null];

  moreProducts: any[];  
  

  // CATEGORIAS
  categories: any[];
  categories2: any[];

  // CATEGORIAS SIDEBAR
  moreCategorias: any[];      
  // END CATEGORIAS SIDEBAR
  

  cartItems: any[] = [];
  showEmptyCartMessage: boolean = false;  

  products_categories_link_2 = "wp-json/wc/v3/products/categories?per_page=100&";

  constructor(
    private navController: NavController,
    private toastController: ToastController,
    private httpClient: HttpClient,
    private linkService: LinkService,
    private loadingController: LoadingController,      
    private menuCtrl: MenuController,
    private storage: Storage,
    private modalController: ModalController,
    private router: Router
    ) {
      this.categories2 = [];  
      this.loadMoreCategorias(null);          
     }

  ngOnInit() {}

  closeMenu() {
    this.menuCtrl.close('menuCategory').then();
  }


  openCategoryPage(category) {
    let navigationExtras: NavigationExtras = {
      state: {
        category
      }
    };
    this.navController.navigateForward('products-by-category', navigationExtras);
  }

  async presentToast(pMessage) {
    const toast = await this.toastController.create({
      message: pMessage,
      duration: 5000
    });
    toast.present();
  }

  
  loadMoreCategorias(event){
   // console.log(event);
    if(event == null)
    {
      this.page = 1;
      this.moreCategorias = [];      
    } else

      this.page++;                  
    // this.presentLoader(1);    
    this.httpClient.get(this.linkService.getAPILink() + this.products_categories_link_2 + '?page='+ this.page+'&consumer_key='+ this.linkService.getConsumerKey() + '&consumer_secret='+this.linkService.getConsumerSecret()).subscribe((data: any)=>{
      // this.dismissLoader(1);
      this.moreCategorias = this.moreCategorias.concat(data);

      // console.log(this.moreCategorias);
      console.log(event);
      let temp2 = data;

      for (let i = 0; i < temp2.length; i++) {
        if (temp2[i].parent == 0 && temp2[i].count >= 1) {

           temp2[i].subCategories = [];

          this.categories2.push(temp2[i]);
        } 
        if(temp2[i].parent > 0){
          // console.log(temp2[i]);          
        }
        
      }    

      for (let i = 0; i < this.categories2.length; i++){
        for (let j = 0; j < temp2.length; j++){
          //console.log("Checking " + j + " " + i)
          if(this.categories2[i].id == temp2[j].parent && temp2[j].parent != 0){

            this.categories2[i].subCategories.push(temp2[j]);


          }
        }
      }

        if(event != null)
        {
          event.target.complete();
        }

        if(data.length < 10 && event != null){
          event.target.disabled = true;
          this.presentToast("No hay más Categorias!");
        }

      
               
    },
    (err)=>{      
      // this.dismissLoader(1);
      console.log(err);
    });
  }

}
