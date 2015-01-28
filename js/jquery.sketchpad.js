/**
 * @authors Alex Gibson, Tejas Kumar
 * @name SketchPad
 * @desc Multi-touch sketchpad demo for HTML5 Canvas drawing
 */

(function($){

  $.fn.sketchpad = function(options) {

    var canvas, //canvas element.
      ctx, //drawing context.
      xPos,
      yPos,
      parent = this,
      settings = $.extend({

        colors: {
          r: 0, //red stroke
          g: 0, //green stroke
          b: 0, //blue stroke
          a: 1 //alpha opacity
        },
        started: false,
        moved: false,
        width: window.innerWidth+'px',
        height: window.innerHeight+'px',
        size: 10,
        lines: [],
        optionsOpen: false,
        pixelRatio: 1

      }, options);
    
    console.log(settings);

    var plugin = {
      
      changeColor: function(r, g, b, a){
        settings.colors.r = r,
        settings.colors.g = g,
        settings.colors.b = b,
        settings.colors.a = a;
      },
      
      changeSize: function(newSize, add){
        if(add === true){
          console.log(settings.size);
          if(settings.size > 0 && settings.size + newSize > 0){
            settings.size += newSize;
          }
        }else{
          settings.size = newSize;
        }
      },

      init: function(options) {

        console.log(settings);

        var dataURL = null,
          image = new Image(),
          hasLocalStorage = 'localStorage' in window && window['localStorage'] !== null;

        pixelRatio = this.getPixelRatio();

        //meta.setAttribute('name', 'viewport');
        //meta.setAttribute('content', 'width=device-width, user-scalable=no, maximum-scale=' + (1 / pixelRatio) +
        //  ', initial-scale=' + (1 / pixelRatio));
        //head.appendChild(meta);

        canvas = document.createElement('canvas');
        parent.append(canvas);
        canvas.setAttribute("height", parseInt(parent.css('height')));
        canvas.setAttribute("width", parseInt(parent.css('width')));

        if (!canvas.getContext) {
          alert('Your browser does not support Canvas 2D drawing.');
        } else {
          ctx = canvas.getContext('2d');

          canvas.addEventListener('touchstart', this.onTouchStart, false);
          canvas.addEventListener('touchmove', this.onTouchMove, false);
          canvas.addEventListener('touchend', this.onTouchEnd, false);
          canvas.addEventListener('touchcancel', this.onTouchCancel, false);
          canvas.addEventListener('mousedown', this.onMouseDown, false);
        }

        //prevent default scrolling on document window
        document.addEventListener('touchmove', function(e) {
          e.preventDefault()
        }, false);

        //shake gesture
        window.addEventListener('shake', this.clearCanvas, false);

        if (hasLocalStorage) {
          dataURL = localStorage.getItem('sketchpad');
          if (dataURL) {
            image.onload = function() {
              ctx.drawImage(image, 0, 0);
            }
            image.src = dataURL;
          }

        }
      },

      getPixelRatio: function() {
        if ('devicePixelRatio' in window) {
          return window.devicePixelRatio;
        }
        return 1;
      },

      onTouchStart: function(e) {

        e.preventDefault();

        _.each(e.touches, function(touch) {
          settings.lines[touch.identifier] = {
            x: touch.clientX,
            y: touch.clientY
          };
        }, this);
        settings.moved = false;
        settings.started = true;
      },

      onTouchMove: function(e) {

        e.preventDefault();
      
        if (settings.started && !settings.optionsOpen) {
          _.each(e.touches, function(touch) {
            console.log(touch);
            var id = touch.identifier,
              moveX = touch.clientX - settings.lines[id].x,
              moveY = touch.clientY - settings.lines[id].y,
              newPos = plugin.drawMulti(id, moveX, moveY);

            settings.lines[id].x = newPos.x;
            settings.lines[id].y = newPos.y;

          }, this);
        }
        settings.moved = true;
      },

      onTouchEnd: function(e) {
        if (e.touches.length === 0) {
          settings.lines = [];
          settings.moved = false;
          settings.started = false;
        }
      },

      onTouchCancel: function(e) {
        if (e.touches.length === 0) {
          settings.lines = [];
          settings.moved = false;
          settings.started = false;
        }
      },

      onMouseDown: function(e) {
        settings.moved = false;
        settings.started = true;
        canvas.addEventListener('mousemove', plugin.onMouseMove, false);
        canvas.addEventListener('mouseup', plugin.onMouseUp, false);
      },

      onMouseMove: function(e) {
        if (settings.started && !settings.optionsOpen) {
          console.log(e);
          var x = e.offsetX,
              y = e.offsetY;
          plugin.drawLine(x, y);
        }
        settings.moved = true;
      },

      onMouseUp: function(e) {
        plugin.endDraw();
        settings.moved = false;
        settings.started = false;
        canvas.removeEventListener('mousemove', this.onMouseMove, false);
        canvas.removeEventListener('mouseup', this.onMouseUp, false);
      },

      drawLine: function(x, y) {

        if (!xPos || !yPos) {
          xPos = x;
          yPos = y;
        }
        
        
          console.log('x: '+xPos+', y: '+yPos);

        /*var grad1 = ctx.createLinearGradient(0, 0, settings.width, settings.height);
              grad1.addColorStop(0,    'yellow');
              grad1.addColorStop(0.25, 'red');
              grad1.addColorStop(0.50, 'blue');
              grad1.addColorStop(0.75, 'limegreen');*/
        //ctx.strokeStyle = grad1;

        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.lineWidth = settings.size;
        ctx.strokeStyle = 'rgba(' + settings.colors.r + ',' + settings.colors.g + ',' + settings.colors.b + ',' +
          settings.colors.a + ')';
        ctx.globalCompositeOperation = 'source-over';
        ctx.beginPath();
        ctx.moveTo(xPos, yPos);
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.closePath();

        xPos = x;
        yPos = y;
      },

      endDraw: function(x, y) {
        xPos = null;
        yPos = null;
      },

      drawMulti: function(id, moveX, moveY) {
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.lineWidth = settings.size;
        /*var grad1 = ctx.createLinearGradient(0, 0, settings.width, settings.height);
              grad1.addColorStop(0,    'yellow');
              grad1.addColorStop(0.25, 'red');
              grad1.addColorStop(0.50, 'blue');
              grad1.addColorStop(0.75, 'limegreen');*/
        //ctx.strokeStyle = grad1;
        ctx.strokeStyle = 'rgba(' + settings.colors.r + ',' + settings.colors.g + ',' + settings.colors.b + ',' +
          settings.colors.a + ')';
        ctx.globalCompositeOperation = 'source-over';
        ctx.beginPath();
        ctx.moveTo(settings.lines[id].x, settings.lines[id].y);
        ctx.lineTo(settings.lines[id].x + moveX, settings.lines[id].y + moveY);
        ctx.stroke();
        ctx.closePath();

        return {
          x: settings.lines[id].x + moveX,
          y: settings.lines[id].y + moveY
        };
      },

      /* Use this method with $.ajax to save an image 
      saveImageData: function() {
        var data = ctx.getImageData(0, 0, settings.width, settings.height);
        if (hasLocalStorage) {
          try {
            localStorage.setItem('sketchpad', canvas.toDataURL("image/png"));
          } catch (e) {
            if (e === 'QUOTA_EXCEEDED_ERR') {
              console.error('Could not save the image data as localStorage max quota has been exceeded.');
            }
          }
        }
      },
      
      */

      clearCanvas: function() {

        if (!confirm("Clear the drawing?")) {
          return;
        }
        canvas.setAttribute("height", settings.height);
        canvas.setAttribute("width", settings.width);
        this.saveImageData();
      }
    };

    return plugin;
    
  };
  
}( jQuery ));