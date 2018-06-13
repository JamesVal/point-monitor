import { Component, OnInit } from '@angular/core';
import { interval } from 'rxjs/observable/interval';

import CanvasAPI from './canvas-api';


const DEFAULT_PNT_WIDTH = 15;
const DEFAULT_RADIUS = 15;
const MAX_RADIUS = 100;
const RADIUS_RATE = 3;
const ALPHA_RATE = .03;
const POINT_INACTIVE = 0;
const POINT_ACTIVE = 1;
const ROBOT_INACTIVE = 0;
const ROBOT_ACTIVE = 1;

const DIRECTION_NONE = 0;
const DIRECTION_FORWARD = 1;
const DIRECTION_BACKWARD = 2;

const ROTATION_NONE = 0;
const ROTATION_COUNTERCLOCKWISE = 1;
const ROTATION_CLOCKWISE = 2;

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
    this.direction = DIRECTION_NONE;
    this.rotation = ROTATION_NONE;
  }
  
  setDirection(direction: number) {
    this.direction = direction;
  }
  
  setRotation(rotation: number) {
    this.rotation = rotation;
  }
  
  moveRobot() {
    if (this.direction == DIRECTION_FORWARD) {
      this.yCoord -= Math.cos(this.angle*Math.PI/180);
      this.xCoord += Math.sin(this.angle*Math.PI/180);
    } else if (this.direction == DIRECTION_BACKWARD) {
      this.yCoord += Math.cos(this.angle*Math.PI/180);
      this.xCoord -= Math.sin(this.angle*Math.PI/180);
    }
    if (this.rotation == ROTATION_COUNTERCLOCKWISE) {
      this.angle -= 1;
    } else if (this.rotation == ROTATION_CLOCKWISE) {
      this.angle += 1;
    }
  }

  stopRobot() {
    this.direction = DIRECTION_NONE;
    this.rotation = ROTATION_NONE;
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
  }
  
  setStatus(newSts: number) {
    this.curSts = newSts;
  }
  
  getStatus() {
    return this.curSts;
  }
  
  updateCircle() {
    this.circleRadius += RADIUS_RATE;
    this.circleAlpha -= ALPHA_RATE;
    
    if (this.circleAlpha < 0) {
      this.circleAlpha = 0;
    }
        
    if (this.circleRadius >= MAX_RADIUS) {
      this.circleRadius = DEFAULT_RADIUS;
      this.circleAlpha = 1.0;
    }
  }
  
  resetCircle() {
    this.circleRadius = MAX_RADIUS;
    this.circleAlpha = 0.0;
  }
}

@Component({
  selector: 'app-current-map',
  templateUrl: './current-map.component.html',
  styleUrls: ['./current-map.component.css']
})

export class CurrentMapComponent implements OnInit {
  MAP_ID: string = "map-canvas";
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
    this.robotActive = ROBOT_ACTIVE;
    this.robotBodyLocation.setDirection(direction);
    this.checkAnimate();
  }
   
  robotRotate(rotation: number): void {
    this.robotActive = ROBOT_ACTIVE;
    this.robotBodyLocation.setRotation(rotation);
    this.checkAnimate();
  }

  robotStop(): void {
    this.robotActive = ROBOT_INACTIVE;
    this.robotBodyLocation.stopRobot();
    this.checkAnimate();
  }
  
  toggleAlert(pointToBlink: number) {
    var newSts = this.mapLocations[pointToBlink].getStatus() ? POINT_INACTIVE : POINT_ACTIVE;
    
    this.mapLocations[pointToBlink].setStatus(newSts);
        
    this.pointActive = POINT_INACTIVE;
    
    for (var curPntIdx = 0; curPntIdx < this.mapLocations.length; curPntIdx++) {
      if (this.mapLocations[curPntIdx].getStatus()) {
        this.pointActive = POINT_ACTIVE;
      }
    }
    
    this.updateCanvas();
    this.checkAnimate();
  }
  
  updateRobot() {
    this.robotBodyLocation.moveRobot();
    this.canvasAPI.updateRobotBodyPosition(this.canvasEle,this.robotBodyLocation);
  }
  
  updatePoints() {
    for (var curPntIdx = 0; curPntIdx < this.mapLocations.length; curPntIdx++) {
      if (this.mapLocations[curPntIdx].getStatus()) {
        this.mapLocations[curPntIdx].updateCircle();
      } else {
        this.mapLocations[curPntIdx].resetCircle();
      }
      this.canvasAPI.updatePointLocation(this.canvasEle,this.mapLocations[curPntIdx]);
      this.canvasAPI.updatePingCircle(this.canvasEle,this.mapLocations[curPntIdx]);
    }
  }
  
  updateCanvas() {
    this.canvasAPI.initializeCanvas(this.canvasEle);

    this.updatePoints();
    this.updateRobot();
  }
    
  checkAnimate() {                    
    if ((this.pointActive == POINT_ACTIVE) || (this.robotActive == ROBOT_ACTIVE)) {
      this.animateCanvas();
    }

    if ((this.pointActive != POINT_ACTIVE) && (this.robotActive != ROBOT_ACTIVE)) {
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
    this.canvasEle = document.getElementById(this.MAP_ID);
    this.updateCanvas();
  }

}
