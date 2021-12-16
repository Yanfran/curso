import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { IonicStorageModule } from '@ionic/storage'; 

import { HttpClientModule } from '@angular/common/http';

import { CartPageModule } from './cart/cart.module';
import { WishlistPageModule } from './wishlist/wishlist.module';
import { MenuComponent } from './components/menu/menu.component';
import { MenuCategoryComponent } from './components/menu-category/menu-category.component';
import { SegmentComponent } from './components/segment/segment.component';
import { DetalleProductoComponent } from './components/detalle-producto/detalle-producto.component';
// import { ProductDetailsPage } from './product-details/product-details.page';
import { PayPal } from '@ionic-native/paypal/ngx';


import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'

@NgModule({
  declarations: [AppComponent, MenuComponent, MenuCategoryComponent, SegmentComponent, DetalleProductoComponent],
  entryComponents: [],
  imports: [
    BrowserModule, 
    IonicModule.forRoot(), 
    IonicStorageModule.forRoot(),
    AppRoutingModule,    
    HttpClientModule,
    CartPageModule,
    WishlistPageModule,
    FontAwesomeModule],
  providers: [
    PayPal,
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
    exports: [
      MenuComponent,
      MenuCategoryComponent,
      SegmentComponent
    ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(library: FaIconLibrary) { 
    library.addIconPacks(fas, fab, far);
  }
}
