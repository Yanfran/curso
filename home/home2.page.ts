import { Component, OnInit } from '@angular/core';
import { NavController, ModalController, ToastController, LoadingController, IonSlides, MenuController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { NavigationExtras } from '@angular/router';
import { LinkService } from '../link.service';
import { ViewChild } from '@angular/core';
import { Storage } from '@ionic/storage';

import { DetalleProductoComponent } from '../components/detalle-producto/detalle-producto.component';
import { CartPage } from '../cart/cart.page';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

//  @ViewChild(IonSegment, { static: true}) segment: IonSegment;

  @ViewChild('slideWithNav', { static: false }) slideWithNav: IonSlides;
  sliderOne: any;  
  //Configuration for each Slider
  slideOptsOne = {
    initialSlide: 0,
    slidesPerView: 1,
    autoplay: true
  };  

  // Categorias
  catSlideOpts = {
    slidesPerView: 4.3,
    spaceBetween: 10,    
    loop: true,
    initialSlide: 0,    
    autoplay: true
    // slidesOffsetBefore: 11
    // freeMode: true
  };

  // Banner 
  highlightSlideOpts =  {
    slidesPerView: 1.05,
    spaceBetween: 10,
    centeredSlides: true,
    loop: true
  };

  // Destacados
  featuredSlideOpts = {
    slidesPerView: 2,
    spaceBetween: 10,
    centeredSlides: false,    
    loop: true
  };


  page: number;
  searchQuery: string = "";
  loaders = [null, null];

  moreProducts: any[];  

  // PRODUCTOS
  products: any[] = [];
  products2:any[] = [];
  productsOnSale: any[];
  products_link = "wp-json/wc/v3/products";

  // CATEGORIAS
  categories: any[];
  categories2: any[];
  products_categories_link = "wp-json/wc/v3/products/categories?per_page=100&";

  // CATEGORIAS SIDEBAR
  moreCategorias: any[];    
  contentLoaded = false;
  contentLoadedC= false;
  contentLoadedD= false;
  // END CATEGORIAS SIDEBAR

  // Cantidad
  prueba: any[] = [];
  cuentaCarro=0;

  cartItems: any[] = [];
  showEmptyCartMessage: boolean = false;
  total: any;
  peso: any;

  constructor(    
      private navController: NavController,
      private toastController: ToastController,
      private httpClient: HttpClient,
      private linkService: LinkService,
      private loadingController: LoadingController,      
      private menuCtrl: MenuController,
      private storage: Storage,
      private modalController: ModalController,
      private router: Router,      
        ) {           
          this.categories = []; 
          this.categories2 = [];          
          this.page = 2;      
          this.loadMoreProducts(null);

          // CATEGORIAS SIDEBAR
          // this.loadMoreCategorias(null);          
          // END CATEGORIAS SIDEBAR

          
          // this.presentLoader(0);
          this.httpClient.get(this.linkService.getAPILink() + this.products_link + '?consumer_key='+ this.linkService.getConsumerKey() + '&consumer_secret='+this.linkService.getConsumerSecret() + '&featured=true').subscribe((data: any)=>{
            // this.dismissLoader(0);
            // console.log(data);
            setTimeout(()=>{
              this.contentLoadedD = true;
            },1000);

            // if(data.total_sales => 1){
              this.products2 = data;
              console.log(data);
              const valor = [];
              this.products2.forEach(function callback(currentValue, index, array) {
                  if(currentValue.total_sales>0){
                    valor.push(currentValue);
                  }
              });

              this.products=valor;
            // }
            // console.log(this.products);
          },
          (err)=>{
            // this.dismissLoader(0);
            console.log(err);
          });


                    // this.presentLoader(0);
          this.httpClient.get(this.linkService.getAPILink() + this.products_link + '?consumer_key='+ this.linkService.getConsumerKey() + '&consumer_secret='+this.linkService.getConsumerSecret() + '&on_sale=true').subscribe((data: any)=>{
            // this.dismissLoader(0);
            // console.log(data);
            setTimeout(()=>{
              this.contentLoadedD = true;
            },1000);            
              this.productsOnSale = data;  
            
            
            // console.log(this.productsOnSale);
          },
          (err)=>{
            // this.dismissLoader(0);
            console.log(err);
          });


          // CATEGORIAS
          
            // this.presentLoader(0);
          this.httpClient.get(this.linkService.getAPILink() + this.products_categories_link + 'consumer_key='+ this.linkService.getConsumerKey() + '&consumer_secret='+this.linkService.getConsumerSecret()).subscribe((data: any)=>{
            // this.dismissLoader(0);
            // console.log(data);          
            let temp = data;          
            for (let i = 0; i < temp.length; i++) {
              if (temp[i].parent == 0 && temp[i].count > 0) {          

                this.categories.push(temp[i]);
              } 
            }
            setTimeout(()=>{
              this.contentLoadedC = true;          
            },1000);
          },
          (err)=>{
            // this.dismissLoader(0);
            console.log(err);
          });
                  
          this.CuentaCarroC();
       
      
    }

  ngOnInit() {
  }
    
  async pushear(item){
    this.products.push(item);
  }

  openCategoryPage(category) {
    let navigationExtras: NavigationExtras = {
      state: {
        category
      }
    };
    this.navController.navigateForward('products-by-category', navigationExtras);
  }

  openLogin(login) {
    let navigationExtras: NavigationExtras = {
      state: {
        login
      }
    };
    this.navController.navigateForward('login', navigationExtras);
  }

  async presentLoader(num) {
    this.loaders[num] = await this.loadingController.create({
      message: 'Please wait...'
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

  loadMoreProducts(event){
    // console.log(event);
    if(event == null)
    {
      this.page = 1;
      this.moreProducts = [];
    }
    else
      this.page++;

    // this.presentLoader(1);
    this.httpClient.get(this.linkService.getAPILink() + this.products_link + '?page='+ this.page+'&consumer_key='+ this.linkService.getConsumerKey() + '&consumer_secret='+this.linkService.getConsumerSecret()).subscribe((data: any)=>{
      // this.dismissLoader(1);
      this.moreProducts = this.moreProducts.concat(data);
  //    console.log(this.moreProducts);
  //    console.log(event);
      if(event != null) {
        event.target.complete();
      }

      if(data.length < 10 && event != null){
        event.target.disabled = true;
        this.presentToast("No more products!");
      }
      setTimeout(()=>{
        this.contentLoaded = true;
      },1000);
    },
    (err)=>{
      // this.dismissLoader(1);
      console.log(err);
    });
  }

  products_categories_link_2 = "wp-json/wc/v3/products/categories";

  loadMoreCategorias(event){

    if(event == null)
    {
      this.page = 1;
      this.moreCategorias = [];      
    }
    else
      this.page++;                      
    this.httpClient.get(this.linkService.getAPILink() + this.products_categories_link_2 + '?page='+ this.page+'&consumer_key='+ this.linkService.getConsumerKey() + '&consumer_secret='+this.linkService.getConsumerSecret()).subscribe((data: any)=>{
      
      this.moreCategorias = this.moreCategorias.concat(data);

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


  async presentToast(pMessage) {
    const toast = await this.toastController.create({
      message: pMessage,
      duration: 5000
    });
    toast.present();
  }

  

  openProductPage(product){
    let navigationExtras: NavigationExtras = {
      state: {
        product: product
      }
    };
    this.navController.navigateForward('product-details', navigationExtras);
  }

  onSearch(event){
    if(this.searchQuery.length > 0){
      let navigationExtras: NavigationExtras = {
        state: {
          searchQuery: this.searchQuery
        }
      };
      this.navController.navigateForward('search', navigationExtras);
    }
  }


  doRefresh(event){    
    console.log('Begin async operation');
    setTimeout(() => {
      this.loadMoreProducts(event);
      this.loadMoreCategorias(event);
      event.target.complete();
    },2000);
  }


  // FUNCIONES PARA CAROUSEL DE CATEGORIAS
  //Method called when slide is changed by drag or navigation
  SlideDidChange(object, slideView) {
    this.checkIfNavDisabled(object, slideView);
  }

  //Call methods to check if slide is first or last to enable disbale navigation  
  checkIfNavDisabled(object, slideView) {
    this.checkisBeginning(object, slideView);
    this.checkisEnd(object, slideView);
  }

  checkisBeginning(object, slideView) {
    slideView.isBeginning().then((istrue) => {
      object.isBeginningSlide = istrue;
    });
  }
  checkisEnd(object, slideView) {
    slideView.isEnd().then((istrue) => {
      object.isEndSlide = istrue;
    });
  }
  //END FUNCIONES PARA CAROUSEL DE CATEGORIAS


  onClick() {
    this.menuCtrl.toggle('menuPrincipal');
  }

  openCategory() {
    this.menuCtrl.toggle('menuCategory');
  }

  openPage(){
    this.presentModal();
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: CartPage
    });
    return await modal.present();
  }
  

  // closeMenu() {
  //   this.menuCtrl.close('menuCategory').then();
  // }



  CuentaCarroC(){
      this.storage.get("cart").then( (data) => {

        if(data==null){
          this.presentToast("Carrito Vacio");
          return;
        }


        this.prueba = data;
        console.log(this.prueba); 
        this.cuentaCarro = this.prueba.length;
        
      })
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

}
