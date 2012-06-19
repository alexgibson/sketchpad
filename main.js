/**
 * @author Alex Gibson
 * @name SketchPad
 * @desc Multi-touch sketchpad demo for line drawing
 */
 
var sketch = (function () {

	var canvas, //canvas element.
		ctx, //drawing context.
		r = 0, //red stroke
		g = 0, //green stroke
		b = 0, //blue stroke
		a = 0.5, //alpha opacity
		started = false,
		size = 1,
		xPos,
		yPos,
		lines = [];
		
	return {
	
		init: function () {

			var doc = document,
				head = doc.getElementsByTagName('head')[0],
				pixelRatio = window.devicePixelRatio,
				meta = doc.createElement('meta');
		
			meta.setAttribute('name', 'viewport');
			meta.setAttribute('content', 'width=device-width, user-scalable=no, maximum-scale=' + (1 / pixelRatio) + ', initial-scale=' + (1 / pixelRatio));
			head.appendChild(meta);
	
			canvas = document.createElement('canvas');
			doc.querySelector('body').appendChild(canvas);
	
			canvas.setAttribute("height", window.innerHeight + "px"); 
			canvas.setAttribute("width",  window.innerWidth + "px");
			canvas.style.width = window.innerWidth + 'px';
			canvas.style.height = window.innerHeight + 'px';
	
			if (!canvas.getContext) {
				alert('Your browser does not support Canvas 2D drawing.');
			} else {
				ctx = canvas.getContext('2d');
				
				canvas.addEventListener('touchstart', sketch.onTouchStart, false);
				canvas.addEventListener('touchmove', sketch.onTouchMove, false);
				canvas.addEventListener('touchend', sketch.onTouchEnd, false);
				canvas.addEventListener('touchcancel', sketch.onTouchCancel, false);
				canvas.addEventListener('mousedown', sketch.onMouseDown, false);
			}
			
			//prevent default scrolling on document window
			document.addEventListener('touchmove', function(e) {
				e.preventDefault()
			}, false);
			
			//shake gesture
			window.addEventListener('shake', sketch.clearCanvas, false);
		},

		onTouchStart: function (e) {
			
			e.preventDefault();
				
			_.each(e.touches, function (touch) {
				lines[touch.identifier] = { 
					x: touch.clientX, 
		            y: touch.clientY 
		        };
			}, this);		
		},
			
		onTouchMove: function (e) {
			
			e.preventDefault();	
			
			_.each(e.touches, function (touch) {
				
				var id = touch.identifier,
					moveX = touch.clientX - lines[id].x,
			        moveY = touch.clientY - lines[id].y,
			        newPos = sketch.drawMulti(id, moveX, moveY);
		                
		        lines[id].x = newPos.x;
		        lines[id].y = newPos.y;
		
			}, this);
		},
		
		onTouchEnd: function (e) {
			if (e.touches.length === 0) {
				lines = [];
			}
		},
		
		onTouchCancel: function (e) {
			if (e.touches.length === 0) {
				lines = [];
			}
		},
			
		onMouseDown: function (e) {					
			canvas.addEventListener('mousemove', sketch.onMouseMove, false);
			canvas.addEventListener('mouseup', sketch.onMouseUp, false);			
		},
			
		onMouseMove: function (e) {
			sketch.drawLine(e.clientX, e.clientY);
		},
			
		onMouseUp: function (e) {
			sketch.endDraw();
			canvas.removeEventListener('mousemove', sketch.onMouseMove, false);
			canvas.removeEventListener('mouseup', sketch.onMouseUp, false);		
		},
		
		drawLine: function (x, y) {
			
			if (!xPos || !yPos) {
				xPos = x;
				yPos = y;
			}
			
			var grad1 = ctx.createLinearGradient(0, 0, window.innerWidth, window.innerHeight);
			grad1.addColorStop(0,    'yellow');
			grad1.addColorStop(0.25, 'red');
			grad1.addColorStop(0.50, 'blue');
			grad1.addColorStop(0.75, 'limegreen');
  
			ctx.strokeStyle = grad1;
		
			ctx.lineCap = 'round';
			ctx.lineJoin = 'round';
			ctx.lineWidth = size; 
			//ctx.strokeStyle = 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')'; 
			ctx.globalCompositeOperation = 'source-over';
			ctx.beginPath();
		    ctx.moveTo(xPos, yPos);
		    ctx.lineTo(x, y);
		    ctx.stroke();
		    ctx.closePath();
		    
		    xPos = x;
			yPos = y;
		},
		
		endDraw: function (x,y) {	
			xPos = null;
			yPos = null;			
		},
		
		drawMulti: function (id, moveX, moveY) {
			ctx.lineCap = 'round';
			ctx.lineJoin = 'round';
			ctx.lineWidth = size; 
			var grad1 = ctx.createLinearGradient(0, 0, window.innerWidth, window.innerHeight);
			grad1.addColorStop(0,    'yellow');
			grad1.addColorStop(0.25, 'red');
			grad1.addColorStop(0.50, 'blue');
			grad1.addColorStop(0.75, 'limegreen');
			ctx.strokeStyle = grad1;
			ctx.globalCompositeOperation = 'source-over';
		    ctx.beginPath();
		    ctx.moveTo(lines[id].x, lines[id].y);
		    ctx.lineTo(lines[id].x + moveX, lines[id].y + moveY);
		    ctx.stroke();
		    ctx.closePath();

		    return { x: lines[id].x + moveX, y: lines[id].y + moveY };
		},
		
		clearCanvas: function () {
			canvas.setAttribute("height", window.innerHeight + "px"); 
			canvas.setAttribute("width",  window.innerWidth + "px");
		}
	};
}());

window.addEventListener('DOMContentLoaded', sketch.init, true);