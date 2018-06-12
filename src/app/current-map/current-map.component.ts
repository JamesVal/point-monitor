import { Component, OnInit } from '@angular/core';
import { interval } from 'rxjs/observable/interval';

import CanvasAPI from './canvas-api';

const DEFAULT_PNT_WIDTH = 15;
const DEFAULT_RADIUS = 15;
const MAX_RADIUS = 100;
const RADIUS_RATE = 3;
const ALPHA_RATE = .03;

class PointLocations {
  label: string;
  xCoord: number;
  yCoord: number;
  curSts: number;
  curFlow: number;
  pntWidth: number;
  circleRadius: number;
  circleAlpha: number;
  
  constructor(lbl: string, xC: number, yC: number, cS: number, cF: number) {
    this.label = lbl;
    this.xCoord = xC;
    this.yCoord = yC;
    this.curSts = cS;
    this.curFlow = cF;
    this.pntWidth = DEFAULT_PNT_WIDTH;
    this.circleRadius = DEFAULT_RADIUS;
    this.circleAlpha = 1.0;
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
  frameInterval: number = -1;
  
  // JJV DEBUG - dummy data
  createDummyLocations() {
    for (var i = 0; i < 3; i++) {
      var newLoc = new PointLocations("Point " + (i+1), 100, (i+1)*125, 0, 0);

      this.mapLocations.push(newLoc);
    }
    
    console.log(this.mapLocations);
  }
  
  isOdd(idx: number): boolean {
    return ((idx & 0x01) == 1);
  }
  
  getStsString(sts: number): string {
    if (sts) return "Alarm";
    else return "Clear";
  }
  
  updateCanvas() {
    this.canvasAPI.initializeCanvas(this.canvasEle);
    for (var curPntIdx = 0; curPntIdx < this.mapLocations.length; curPntIdx++) {
      this.canvasAPI.updatePointLocation(this.canvasEle,this.mapLocations[curPntIdx]);
      if (this.mapLocations[curPntIdx].curSts) {
        
        this.canvasAPI.updatePingCircle(this.canvasEle,this.mapLocations[curPntIdx]);
        this.mapLocations[curPntIdx].circleRadius += RADIUS_RATE;
        this.mapLocations[curPntIdx].circleAlpha -= ALPHA_RATE;
        
        if (this.mapLocations[curPntIdx].circleAlpha < 0) {
          this.mapLocations[curPntIdx].circleAlpha = 0;
        }
        
        if (this.mapLocations[curPntIdx].circleRadius >= MAX_RADIUS) {
          this.mapLocations[curPntIdx].circleRadius = DEFAULT_RADIUS;
          this.mapLocations[curPntIdx].circleAlpha = 1.0;
        }
      } else {
        this.mapLocations[curPntIdx].circleRadius = DEFAULT_RADIUS;
        this.mapLocations[curPntIdx].circleAlpha = 1.0
      }
    }
  }
  
  checkAnimate() {
    var activeSts = 0;
    
    for (var curPntIdx = 0; curPntIdx < this.mapLocations.length; curPntIdx++) {
      if (this.mapLocations[curPntIdx].curSts) {
        activeSts = 1;
      }
    }
                    
    if (activeSts == 1) {
      this.animatePingCircles();
    }

    if (activeSts != 1) {
      this.stopPingCircles();
    }
  }
  
  toggleAlert(pointToBlink: number) {
    this.mapLocations[pointToBlink].curSts = this.mapLocations[pointToBlink].curSts ? 0 : 1;
    this.updateCanvas();
    this.checkAnimate();
  }
  
  animatePingCircles() {
    if (this.frameInterval == -1) {
      var me = this;
      this.frameInterval = setInterval(function() {
        me.updateCanvas();
      }, 25);
    }
  }
  
  stopPingCircles() {
    if (this.frameInterval != -1 ) {
      clearInterval(this.frameInterval);
      this.frameInterval = -1;
    }
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
  }

}
