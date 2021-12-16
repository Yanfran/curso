import { Component } from '@angular/core';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  // Cantidad
  cartItems: any[] = [];
  showEmptyCartMessage: boolean = false;
  total: any;
  peso: any;

  constructor(    
  ) {}

}
