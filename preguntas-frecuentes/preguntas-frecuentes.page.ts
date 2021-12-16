import { Component, OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Router } from '@angular/router';
//import { HomePage } from '../home/home.page';

@Component({
  selector: 'app-preguntas-frecuentes',
  templateUrl: './preguntas-frecuentes.page.html',
  styleUrls: ['./preguntas-frecuentes.page.scss'],
})
export class PreguntasFrecuentesPage implements OnInit {

//  @ViewChild(IonSegment, { static: true}) segment: IonSegment;

  constructor(
    private router: Router,
    private menuCtrl: MenuController
    ) { }

  ngOnInit() {
    // this.segment.value = 'preguntas';
  }

    segmentChangedP(event){
      const valorSegmento = event.detail.value;
      console.log(valorSegmento);
      //this.hm.segmentChanged(event);
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
