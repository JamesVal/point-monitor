import { Component, OnInit } from '@angular/core';
import { interval } from 'rxjs/observable/interval';

import CanvasAPI from './canvas-api';

const DEFAULT_PNT_WIDTH = 15;
const DEFAULT_RADIUS = 15;
const MAX_RADIUS = 100;
const RADIUS_RATE = 3;
const ALPHA_RATE = .03;

const ROBOT_WIDTH = 100;
const ROBOT_HEIGHT = 85;
const ROBOT_TREAD_WIDTH = 25;
const ROBOT_TREAD_HEIGHT = 95;

class RobotBodyLocation {
  id: number;
  label: string;
  xCoord: number;
  yCoord: number;
  width: number;
  height: number;
  tr_width: number;
  tr_height: number;
  angle: number;
  direction: number;
  rotation: number;
  
  constructor(_id: number, _label: string, _xCoord: number, _yCoord: number, _angle: number) {
    this.id = _id;
    this.label = _label;
    this.xCoord = _xCoord;
    this.yCoord = _yCoord;
    this.width = ROBOT_WIDTH;
    this.height = ROBOT_HEIGHT;
    this.tr_width = ROBOT_TREAD_WIDTH;
    this.tr_height = ROBOT_TREAD_HEIGHT;
    this.angle = _angle;
    this.direction = 0;
    this.rotation = 0;
  }
}

class PointLocations {
  id:number;
  label: string;
  xCoord: number;
  yCoord: number;
  curSts: number;
  curFlow: number;
  pntWidth: number;
  circleRadius: number;
  circleAlpha: number;
  
  constructor(_id:number, lbl: string, xC: number, yC: number, cS: number, cF: number) {
    this.id = _id;
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
  robotBodyLocation: RobotBodyLocation;
  mapLocations: PointLocations[] = [];
  pointActive: number = 0;
  robotActive: number = 0;
  frameInterval: number = -1;
  
  // JJV DEBUG - dummy data
  createDummyLocations() {
    for (var i = 0; i < 3; i++) {
      var newLoc = new PointLocations((i+1),"Point " + (i+1), 100, (i+1)*125, 0, 0);

      this.mapLocations.push(newLoc);
    }
    
    this.robotBodyLocation = new RobotBodyLocation(1, "Robot 1", 300, 500, 0);
    console.log(this.mapLocations);
    console.log(this.robotBodyLocation);
  }
  
  isOdd(idx: number): boolean {
    return ((idx & 0x01) == 1);
  }
  
  getStsString(sts: number): string {
    if (sts) return "Alarm";
    else return "Clear";
  }
  
  robotDirection(direction: number): void {
    this.robotActive = 1;
    this.robotBodyLocation.direction = direction;
    this.checkAnimate();
    //console.log("move");
  }
  
  robotRotate(rotation: number): void {
    this.robotActive = 1;
    this.robotBodyLocation.rotation = rotation;
    this.checkAnimate();
    //console.log("rotate");
  }

  robotStop(): void {
    this.robotActive = 0;
    this.robotBodyLocation.direction = 0;
    this.robotBodyLocation.rotation = 0;
    this.checkAnimate();
    //console.log("stop");
  }

  toggleAlert(pointToBlink: number) {
    this.mapLocations[pointToBlink].curSts = this.mapLocations[pointToBlink].curSts ? 0 : 1;
    
    this.pointActive = 0;
    
    for (var curPntIdx = 0; curPntIdx < this.mapLocations.length; curPntIdx++) {
      if (this.mapLocations[curPntIdx].curSts) {
        this.pointActive = 1;
      }
    }
    
    this.updateCanvas();
    this.checkAnimate();
  }
  
  updateRobot() {
    if (this.robotBodyLocation.direction == 1) {
      this.robotBodyLocation.yCoord -= Math.cos(this.robotBodyLocation.angle*Math.PI/180);
      this.robotBodyLocation.xCoord += Math.sin(this.robotBodyLocation.angle*Math.PI/180);
    } else if (this.robotBodyLocation.direction == 2) {
      this.robotBodyLocation.yCoord += Math.cos(this.robotBodyLocation.angle*Math.PI/180);
      this.robotBodyLocation.xCoord -= Math.sin(this.robotBodyLocation.angle*Math.PI/180);
    }
    
    if (this.robotBodyLocation.rotation == 1) {
      this.robotBodyLocation.angle -= 1;
    } else if (this.robotBodyLocation.rotation == 2) {
      this.robotBodyLocation.angle += 1;
    }
    
    this.canvasAPI.updateRobotBodyPosition(this.canvasEle,this.robotBodyLocation);
  }
  
  updatePoints() {
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
  
  updateCanvas() {
    this.canvasAPI.initializeCanvas(this.canvasEle);

    this.updatePoints();
    this.updateRobot();
  }
  
  checkAnimate() {                    
    if ((this.pointActive == 1) || (this.robotActive == 1)) {
      this.animateCanvas();
    }

    if ((this.pointActive != 1) && (this.robotActive != 1)) {
      this.stopAnimateCanvas();
    }
  }
  
  animateCanvas() {
    if (this.frameInterval == -1) {
      var me = this;
      this.frameInterval = setInterval(function() {
        me.updateCanvas();
      }, 25);
    }
  }
  
  stopAnimateCanvas() {
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
