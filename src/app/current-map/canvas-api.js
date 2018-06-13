class CanvasAPI {
  
  createGrid(canvas_element) {
    var ctx = canvas_element.getContext("2d");
    
    ctx.globalAlpha = .25;
    ctx.strokeStyle = "#ccffcc";
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (var curX = 0; curX <= canvas_element.width; curX+=100) {
      ctx.moveTo(curX,0);
      ctx.lineTo(curX,canvas_element.height);
    }
    for (var curY = 0; curY <= canvas_element.height; curY+=100) {
      ctx.moveTo(0,curY);
      ctx.lineTo(canvas_element.width,curY);
    }
    ctx.stroke();
  }
  
  initializeCanvas(canvas_element) {
    var ctx = canvas_element.getContext("2d");
    
    ctx.globalAlpha = 1.0;
    //ctx.fillStyle = "#00004d";
    ctx.fillStyle = "black";
    ctx.fillRect(0,0,canvas_element.width, canvas_element.height);
    
    this.createGrid(canvas_element);
  }
  
  updatePointLocation(canvas_element, current_point) {
    var ctx = canvas_element.getContext("2d");

    ctx.globalAlpha = 1.0;
    ctx.fillStyle = "lightgray";
    ctx.beginPath();
    ctx.arc(current_point.xCoord, current_point.yCoord, current_point.pntWidth+1, 0, 2 * Math.PI);
    ctx.fill();
    
    if (current_point.curSts) {
      ctx.fillStyle = "red";
    } else {
      ctx.fillStyle = "green";
    }
    ctx.beginPath();
    ctx.arc(current_point.xCoord, current_point.yCoord, current_point.pntWidth, 0, 2 * Math.PI);
    ctx.fill();
    
    //if (current_point.curSts) {
      ctx.font = "22px Arial";
      ctx.fillStyle = "white";
      ctx.textAlign = "center";
      //ctx.fillText("!",current_point.xCoord-(current_point.pntWidth/2)+3, current_point.yCoord-(current_point.pntWidth/2)+18);
      ctx.fillText(current_point.id,current_point.xCoord, current_point.yCoord+(current_point.pntWidth/2)-1);
    //}
  }
  
  updatePingCircle(canvas_element, current_point) {
    var ctx = canvas_element.getContext("2d");
    
    ctx.strokeStyle = "red";
    ctx.lineWidth = 5;
    ctx.globalAlpha = current_point.circleAlpha;
    ctx.beginPath();
    ctx.arc(current_point.xCoord, current_point.yCoord, current_point.circleRadius, 0, 2 * Math.PI);
    ctx.stroke();
  }

  drawLogo(canvas_element, current_robot) {
    var ctx = canvas_element.getContext("2d");
    var logo_grid = [
      [1,1,1,1,1,0,0,1,1,1,0],
      [1,1,1,1,1,0,1,1,1,1,1],
      [1,1,0,0,0,0,1,1,0,1,1],
      [1,1,1,1,0,0,1,1,1,1,1],
      [0,1,1,1,1,0,0,1,1,1,1],
      [0,0,0,1,1,0,0,0,0,1,1],
      [0,1,1,1,1,0,0,1,1,1,1],
      [0,1,1,1,0,0,0,1,1,1,0]
    ];
    
    // JJV DEBUG - draw the 59 days of code logo
    ctx.fillStyle = "rgb(240,151,79)";
    ctx.lineWidth = 1;    
    for (var x = 0; x < 11; x++) {
      for (var y = 0; y < 8; y++) {
        ctx.beginPath();
        if (logo_grid[y][x])
          ctx.arc(0-(current_robot.width/2)+9.5+x*8, 0-(current_robot.height/2)+8+y*8, 3, 0, 2 * Math.PI);
        ctx.fill();
      }
    }
  }
  
  updateRobotBody(canvas_element, current_robot) {
    var ctx = canvas_element.getContext("2d");
    
    ctx.globalAlpha = 1.0;
    
    ctx.save();
    ctx.translate(current_robot.xCoord,current_robot.yCoord);
    ctx.rotate((current_robot.angle) * Math.PI / 180);
    ctx.fillStyle = "white";
    ctx.fillRect(0-(current_robot.width/2),0-(current_robot.height/2),current_robot.width, current_robot.height);
    ctx.fillRect((current_robot.width/2)+3,0-(current_robot.tr_height/2),current_robot.tr_width, current_robot.tr_height);
    ctx.fillRect(-((current_robot.width/2)+3+current_robot.tr_width),0-(current_robot.tr_height/2),current_robot.tr_width, current_robot.tr_height);
    this.drawLogo(canvas_element,current_robot);
    ctx.strokeStyle = "gray";
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (var i = current_robot.tr_seg_right_pos; i < current_robot.tr_height; i+=current_robot.tr_seg_length) {
      ctx.moveTo((current_robot.width/2)+3,0-(current_robot.tr_height/2)+i);
      ctx.lineTo((current_robot.width/2)+3+current_robot.tr_width,0-(current_robot.tr_height/2)+i);
    }
    for (var i = current_robot.tr_seg_left_pos; i < current_robot.tr_height; i+=current_robot.tr_seg_length) {
      ctx.moveTo(-((current_robot.width/2)+3+current_robot.tr_width),0-(current_robot.tr_height/2)+i);
      ctx.lineTo(-((current_robot.width/2)+3+current_robot.tr_width)+current_robot.tr_width,0-(current_robot.tr_height/2)+i);
    }
    ctx.stroke();
    ctx.restore();

    //ctx.fillRect(current_robot.xCoord-(current_robot.width/2),current_robot.yCoord-(current_robot.height/2),current_robot.width, current_robot.height);
  }
}

exports.default = CanvasAPI;