class CanvasAPI {
  
  initializeCanvas(canvas_element) {
    var ctx = canvas_element.getContext("2d");
    ctx.fillStyle = "black";
    ctx.fillRect(0,0,canvas_element.width, canvas_element.height);
  }
  
  createPointLocation(canvas_element, current_point) {
    var ctx = canvas_element.getContext("2d");
    
    
    ctx.fillStyle = "lightgray";
    ctx.beginPath();
    ctx.arc(current_point.xCoord, current_point.yCoord, 6, 0, 2 * Math.PI);
    ctx.fill();
    
    if (current_point.curSts) {
      ctx.fillStyle = "red";
    } else {
      ctx.fillStyle = "green";
    }
    ctx.beginPath();
    ctx.arc(current_point.xCoord, current_point.yCoord, 5, 0, 2 * Math.PI);
    ctx.fill();
  }
  
  createAnimateCircle(canvas_element, current_point) {
  }
  
  startAnimateCircle(canvas_element, current_point) {
  }
  
}

exports.default = CanvasAPI;