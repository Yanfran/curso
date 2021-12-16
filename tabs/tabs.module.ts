import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TabsPageRoutingModule } from './tabs-routing.module';

import { TabsPage } from './tabs.page';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome' 
// import { ProductDetailsPage } from '../product-details/product-details.page';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    TabsPageRoutingModule,
    FontAwesomeModule
  ],
  declarations: [TabsPage]  
})
export class TabsPageModule {}
