import { Component, OnInit } from '@angular/core';

import CanvasAPI from './canvas-api';

class PointLocations {
  label: string;
  xCoord: number;
  yCoord: number;
  curSts: boolean;
  curFlow: number;
  
  constructor(lbl: string, xC: number, yC: number, cS: boolean, cF: number) {
    this.label = lbl;
    this.xCoord = xC;
    this.yCoord = yC;
    this.curSts = cS;
    this.curFlow = cF;
  };
}

@Component({
  selector: 'app-current-map',
  templateUrl: './current-map.component.html',
  styleUrls: ['./current-map.component.css']
})

export class CurrentMapComponent implements OnInit {

  mapId: string = "map-canvas";
  canvasAPI: any;
  mapLocations: PointLocations[] = [];

  // JJV DEBUG - dummy data
  createDummyLocations() {
    for (var i = 0; i < 3; i++) {
      var newLoc = new PointLocations("Point " + i, i*50, i*50, false, 0);

      this.mapLocations.push(newLoc);
    }
    
    console.log(this.mapLocations);
  }
      
  constructor() { }

  ngOnInit() {
    this.canvasAPI = new CanvasAPI();
    
    // JJV DEBUG - dummy data
    this.createDummyLocations();
  }

  ngAfterViewInit() {
    var c = document.getElementById(this.mapId);
    this.canvasAPI.initializeCanvas(c);
    this.canvasAPI.createPointLocation(c,this.mapLocations[1]);
    //this.canvasAPI.createAnimateCircle(c);
  }

}
