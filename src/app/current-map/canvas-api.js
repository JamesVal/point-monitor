class CanvasAPI {
  
  initializeCanvas(canvas_element) {
    var ctx = canvas_element.getContext("2d");
    ctx.fillStyle = "black";
    ctx.fillRect(0,0,canvas_element.width, canvas_element.height);
  }
  
  createPointLocation(canvas_element, current_point) {
    var ctx = canvas_element.getContext("2d");
    ctx.fillStyle= "white";
    //ctx.strokeStyle = "white";
    ctx.beginPath();
    ctx.arc(95, 50, 40, 0, 2 * Math.PI);
    //ctx.stroke();
    ctx.fill();
  }
  
  createAnimateCircle(canvas_element, current_point) {
  }
  
  startAnimateCircle(canvas_element, current_point) {
  }
  
}

exports.default = CanvasAPI;