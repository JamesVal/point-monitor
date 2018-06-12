import { Component, OnInit } from '@angular/core';

import CanvasAPI from './canvas-api';

class PointLocations {
  label: string;
  xCoord: number;
  yCoord: number;
  curSts: number;
  curFlow: number;
  
  constructor(lbl: string, xC: number, yC: number, cS: number, cF: number) {
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
  canvasEle: any;
  canvasAPI: any;
  mapLocations: PointLocations[] = [];

  // JJV DEBUG - dummy data
  createDummyLocations() {
    for (var i = 0; i < 3; i++) {
      var newLoc = new PointLocations("Point " + i, 100, (i+1)*100, 0, 0);

      this.mapLocations.push(newLoc);
    }
    
    console.log(this.mapLocations);
  }
  
  updateCanvas() {
    this.canvasAPI.initializeCanvas(this.canvasEle);
    for (var curPntIdx = 0; curPntIdx < this.mapLocations.length; curPntIdx++) {
      this.canvasAPI.createPointLocation(this.canvasEle,this.mapLocations[curPntIdx]);
    }
  }
  
  toggleAlert(pointToBlink: number) {
    this.mapLocations[pointToBlink].curSts = this.mapLocations[pointToBlink].curSts ? 0 : 1;
    this.updateCanvas();
  }
  
  setBlinkingAlert(pointToBlink: PointLocations) {
    //this.canvasAPI
  }
  
  stopsetBlinkingAlert(pointToBlink: PointLocations) {
  }
  
  constructor() { }

  ngOnInit() {
    this.canvasAPI = new CanvasAPI();
    
    // JJV DEBUG - dummy data
    this.createDummyLocations();
  }

  ngAfterViewInit() {
    this.canvasEle = document.getElementById(this.mapId);
    this.updateCanvas();
    //this.canvasAPI.createAnimateCircle(c);
  }

}
