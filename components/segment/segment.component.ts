import { Component, OnInit } from '@angular/core';
import { ActivationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { IonSegment } from '@ionic/angular';
import { ViewChild } from '@angular/core';
//import { Router } from '@angular/router';
@Component({
  selector: 'app-segment',
  templateUrl: './segment.component.html',
  styleUrls: ['./segment.component.scss'],
})
export class SegmentComponent implements OnInit {

  @ViewChild(IonSegment, { static: true}) segment: IonSegment;

  value = '';

  constructor(
    private router: Router
  ) {
/*    this.getDataRoute().subscribe((data) => {
      this.value = data.path;
    });*/
  }

  ngOnInit() {
    this.segment.value = 'home';
  }

  segmentChanged(event){
      const valorSegmento = event.detail.value;
      console.log(valorSegmento);
    }

  getDataRoute() {
    return this.router.events
    .pipe(
      filter( event => event instanceof ActivationEnd),
      filter( (event: ActivationEnd) => event.snapshot.firstChild === null),
      map( (data: ActivationEnd) => data.snapshot.routeConfig)
    );
  }
  async irEnlace(url){
      this.router.navigate(['/'+url]);
  }


}
