
(function() {

  let nameofuser=localStorage.getItem("userName")
if(!nameofuser){
  nameofuser=prompt("Enter your name")
  localStorage.setItem("userName",nameofuser)

}

    var socket = io();
    var canvas = document.getElementsByClassName('whiteboard')[0];
    var colors = document.getElementsByClassName('color');
    var context = canvas.getContext('2d');
    var thickness= document.getElementById('range');

    let strokethick;
    const humanEmojis=["👨🏻","👩🏻","👨🏼","👩🏼","👨🏽","👩🏽","👨🏾","👩🏾","👨🏿","👩🏿"]
    var element = document.createElement("p");
    const randomEmoji=humanEmojis[Math.floor(Math.random()*humanEmojis.length)]
    element.textContent = randomEmoji ;

    element.style.position = "absolute";
element.style.fontSize = "50px"



    thickness.addEventListener('input', function() {
   strokethick= thickness.value;
      console.log('Current value:', strokethick);
      // You can do further processing with the value here
    });

    console.log(thickness)
 
  
    var current = {
      color: 'white'
    };
    var drawing = false;
  
    canvas.addEventListener('mousedown', onMouseDown, false);
    canvas.addEventListener('mouseup', onMouseUp, false);
    canvas.addEventListener('mouseout', onMouseUp, false);
    canvas.addEventListener('mousemove', onMouseMove, false);
    
    //Touch support for mobile devices
    canvas.addEventListener('touchstart', onMouseDown, false);
    canvas.addEventListener('touchend', onMouseUp, false);
    canvas.addEventListener('touchcancel', onMouseUp, false);
    canvas.addEventListener('touchmove', throttle(onMouseMove, 10), false);
  
    for (var i = 0; i < colors.length; i++){
      colors[i].addEventListener('click', onColorUpdate, false);
    }
  
    socket.on('drawing', onDrawingEvent);

  
    window.addEventListener('resize', onResize, false);
    onResize();
  
  
    function drawLine(x0, y0, x1, y1, color, thickness,emit){
      context.beginPath();
      context.moveTo(x0, y0);
      context.lineTo(x1, y1);
      context.strokeStyle = color;
      // context.fillStyle = color;  
      context.lineWidth = thickness;
      context.closePath();
      context.stroke();
  
      if (!emit) { return; }
      var w = canvas.width;
      var h = canvas.height;
  
      socket.emit('drawing', {
        x0: x0 / w,
        y0: y0 / h,
        x1: x1 / w,
        y1: y1 / h,
        color: color,
        thickness: strokethick,
        Username:nameofuser
        

      });
    }
  
    function onMouseDown(e){
      drawing = true;
      current.x = e.clientX||e.touches[0].clientX;
      current.y = e.clientY||e.touches[0].clientY;
    }
  
    function onMouseUp(e){
      if (!drawing) { return; }
      drawing = false;
      drawLine(current.x, current.y, e.clientX||e.touches[0].clientX, e.clientY||e.touches[0].clientY, current.color, true);
    }
  
    function onMouseMove(e){
      // console.log("mouse move",drawing,current.x, current.y, e.clientX||e.touches[0].clientX, e.clientY||e.touches[0].clientY, current.color,)
      if (!drawing) { return; }
      drawLine(current.x, current.y, e.clientX||e.touches[0].clientX, e.clientY||e.touches[0].clientY, current.color, strokethick,true);
      current.x = e.clientX||e.touches[0].clientX;
      current.y = e.clientY||e.touches[0].clientY;
    }
  
    function onColorUpdate(e){
      current.color = e.target.className.split(' ')[1];

      for (var i = 0; i < colors.length; i++){
        colors[i].style.border ="none"
      }
    
      // e.target.style.border ="1px 
      // set gradient border"
      e.target.style.border = "2px solid whitesmoke";
      // gradient border not solid


    }
  
    // limit the number of events per second
    function throttle(callback, delay) {
      var previousCall = new Date().getTime();
      return function() {
        var time = new Date().getTime();
  
        if ((time - previousCall) >= delay) {
          previousCall = time;
          callback.apply(null, arguments);
        }
      };
    }
  
    function onDrawingEvent(data){
        console.log(data)
      var w = canvas.width;
      var h = canvas.height;
// insert and icon 🚀 to the position of the mouse ie data.x1 and data.x2 to html

// create an Element
// // add icon to element
// element.classList.add("fas");
// add 15 icons to to array icons , the icons are emojis or man/women


element.style.left = data.x1 * w + "px";
element.style.top = data.y1 * h + "px";
// add tool tip to the element
element.setAttribute("data-tooltip",data.Username)
// show the data-tooltip name while hovering




// add elemnt to html
document.body.appendChild(element);


      drawLine(data.x0 * w, data.y0 * h, data.x1 * w, data.y1 * h, data.color,data.thickness,false);
    }
  
    // make the canvas fill its parent
    function onResize() {

      // clear canvas
      // var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      // context.clearRect(0, 0, canvas.width, canvas.height);

      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      
      // context.clearRect(0, 0, canvas.width, canvas.height);
      // context.putImageData(imageData, 0, 0);


    }
  
  })();