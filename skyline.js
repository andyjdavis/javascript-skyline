/*
 * A class that draws a simple stylized side scrolling city scene.
 *
 * This code does not come with any sort of warranty.
 * You are welcome to use it for whatever you like.
 * A credit would be nice but is not required.
 */


function drawRect(context, x, y, width, height, color) {
    context.fillStyle = color;
    context.fillRect(x, y, width, height);
}

function getRandomInt(minimum, maximum) {
    rand = minimum + Math.floor(Math.random() * (maximum - minimum + 1));
    return rand;
}

//http://ejohn.org/blog/simple-javascript-inheritance/#postcomment
/* Simple JavaScript Inheritance
 * By John Resig http://ejohn.org/
 * MIT Licensed.
 */
// Inspired by base2 and Prototype
(function(){
  var initializing = false, fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;
 
  // The base Class implementation (does nothing)
  this.Class = function(){};
 
  // Create a new Class that inherits from this class
  Class.extend = function(prop) {
    var _super = this.prototype;
   
    // Instantiate a base class (but only create the instance,
    // don't run the init constructor)
    initializing = true;
    var prototype = new this();
    initializing = false;
   
    // Copy the properties over onto the new prototype
    for (var name in prop) {
      // Check if we're overwriting an existing function
      prototype[name] = typeof prop[name] == "function" &&
        typeof _super[name] == "function" && fnTest.test(prop[name]) ?
        (function(name, fn){
          return function() {
            var tmp = this._super;
           
            // Add a new ._super() method that is the same method
            // but on the super-class
            this._super = _super[name];
           
            // The method only need to be bound temporarily, so we
            // remove it when we're done executing
            var ret = fn.apply(this, arguments);        
            this._super = tmp;
           
            return ret;
          };
        })(name, prop[name]) :
        prop[name];
    }
   
    // The dummy class constructor
    function Class() {
      // All construction is actually done in the init method
      if ( !initializing && this.init )
        this.init.apply(this, arguments);
    }
   
    // Populate our constructed prototype object
    Class.prototype = prototype;
   
    // Enforce the constructor to be what we expect
    Class.prototype.constructor = Class;
 
    // And make this class extendable
    Class.extend = arguments.callee;
   
    return Class;
  };
})();

Building = Class.extend({
    init: function(pos, size, color) {
        this.pos = pos;
        this.size = size;
        this.color = color;
    },
    update: function(dt) {
        this.pos[0] -= dt * 200;
        
        //is this building still on screen?
        return (this.pos[0] + this.size[0]) > 0;
    },
    draw: function(dt) {
        drawRect(gContext, this.pos[0], this.pos[1], this.size[0], this.size[1], this.color);
    }
});

City = Class.extend({
    buildings: null,
    spacer: 10,
    init: function() {
        this.buildings = Array();
    },
    update: function(dt) {
        var toRemove = Array(), nextX = 0;
        
        for (var i = 0;i < this.buildings.length;i++) {
            if (!this.buildings[i].update(dt)) {
                toRemove.push(i);
            } else {
                if (nextX < this.buildings[i].pos[0] + this.buildings[i].size[0] + this.spacer) {
                    nextX = this.buildings[i].pos[0] + this.buildings[i].size[0] + this.spacer;
                }
            }
        }
        //old buildings
        for (var j = 0;j < toRemove.length;j++) {
            this.buildings.splice(toRemove[j],1);
        }
        //new buildings
        var pos = null, size = null;
        while (nextX < gCanvas.width) {
            size = [getRandomInt(150, 400), getRandomInt(40, 250)];
            pos = [nextX, gCanvas.height - size[1]];
            this.buildings.push(new Building(pos, size, 'grey'));
            
            nextX = pos[0] + size[0] + this.spacer;
        }
    },
    draw: function() {
        for (var i = 0;i < this.buildings.length;i++) {
            this.buildings[i].draw();
        }
    }
});

var gCanvas = document.getElementById('gamecanvas');
var gContext = gCanvas.getContext('2d');

function updateGame(dt) {
    gCity.update(dt);
}

function drawGame() {
    gContext.fillStyle = "black";
    gContext.fillRect(0 , 0, gCanvas.width, gCanvas.height);
    //context.clearRect(0, 0, canvas.width, canvas.height);
    
    gCity.draw();
}

var gOldTime = Date.now();
var gNewTime = null;

var gCity = new City();

//executed 60/second
var mainloop = function() {
    gNewtime = Date.now();
    dt = (gNewtime - gOldTime)/1000;
    gOldTime = gNewtime;
        
    updateGame(dt);
    drawGame();
};

var ONE_FRAME_TIME = 1000 / 60; // 60 per second
setInterval( mainloop, ONE_FRAME_TIME );
