var AM = new AssetManager();

function distance(a, b) {
    var dx = a.x - b.x;
    var dy = a.y - b.y;
    return Math.sqrt(dx * dx + dy * dy);
}

function angleFromVectors(aX, aY, bX, bY) {
    var num = (aX * bX) + (aY * bY);
    var denom = Math.sqrt((aX * aX) + (aY * aY)) * Math.sqrt((bX * bX) + (bY * bY));
    var rtn = Math.acos(num / denom);
    return rtn;
}

function Animation(spriteSheet, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop, scale, that) {
    this.spriteSheet = spriteSheet;
    this.frameWidth = frameWidth;
    this.frameDuration = frameDuration;
    this.frameHeight = frameHeight;
    this.sheetWidth = sheetWidth;
    this.frames = frames;
    this.totalTime = frameDuration * frames;
    this.elapsedTime = 0;
    this.loop = loop;
    this.scale = scale;
    this.that = that;
}

Animation.prototype.drawFrame = function (tick, ctx, x, y) {
    this.elapsedTime += tick;
    if (this.isDone()) {
        if (this.loop) this.elapsedTime = 0;
    }


    var frame = this.currentFrame();
    var xindex = 0;
    var yindex = 0;
    xindex = frame % this.sheetWidth;
    yindex = Math.floor(frame / this.sheetWidth);
    if (this.that !== null) {
        var canvas = this.that.rotateAndCache(this.that, xindex * this.frameWidth, yindex * this.frameHeight,  // source from sheet
            this.frameWidth, this.frameHeight, this.that.myAngle);

        ctx.drawImage(canvas, x, y, this.frameWidth * this.scale,
            this.frameHeight * this.scale);
    }
    else {
        ctx.drawImage(this.spriteSheet,
            xindex * this.frameWidth, yindex * this.frameHeight,  // source from sheet
            this.frameWidth, this.frameHeight,
            x, y,
            this.frameWidth * this.scale,
            this.frameHeight * this.scale);
    }
}

Animation.prototype.currentFrame = function () {
    return Math.floor(this.elapsedTime / this.frameDuration);
}

Animation.prototype.isDone = function () {
    return (this.elapsedTime >= this.totalTime);
}

// no inheritance
function Background(game, spritesheet) {
    this.x = 0;
    this.y = 0;
    this.spritesheet = spritesheet;
    this.game = game;
    this.ctx = game.ctx;
};

Background.prototype.draw = function () {
    this.ctx.drawImage(this.spritesheet,
                   this.x, this.y, 1600, 900);
};

Background.prototype.update = function () {
};

Background.prototype.detectCollision = function () {}


// inheritance
function Survivor(game, spritesheet) {
    this.animation = new Animation(spritesheet, 258, 220, 6, 0.1, 18, true, .4,this);
    this.animation2 = new Animation(AM.getAsset("./src/img/survivor_move_handgun_sprite.png"), 258, 220, 6, 0.1, 18, true, .4, this);
    this.animation3 = this.animation;
    this.speed = 500;
    this.myAngle = 0;
    this.radius = 129 * this.animation.scale;
    this.w = false;
    this.s = false;
    this.a = false;
    this.d = false;
    this.ctx = game.ctx;
    this.mouseX = 0;
    this.mouseY = 0;
    var that = this;
    this.x = 0;
    this.y = 0;

    this.ctx.canvas.addEventListener("keydown", function (e) {
        if (e.code === "KeyD") {
            that.d = true;
            that.animation = that.animation2;
        }
        if (e.code === "KeyW") {
            that.w = true;
            that.animation = that.animation2;
        }
        if (e.code === "KeyA") {
            that.a = true;
            that.animation = that.animation2;
        }
        if (e.code === "KeyS") {
            that.s = true;
            that.animation = that.animation2;
        }
         }, false);
    this.ctx.canvas.addEventListener("keyup", function (e) {
        if (e.code === "KeyD") {
            that.d = false;
            that.animation = that.animation3;
        }
        if (e.code === "KeyW") {
            that.w = false;
            that.animation = that.animation3;
        }
        if (e.code === "KeyA") {
            that.a = false;
            that.animation = that.animation3;
        }
        if (e.code === "KeyS") {
            that.s = false;
            that.animation = that.animation3;
        }
        
        }, false);
    this.ctx.canvas.addEventListener("mousemove", function (e) {
        that.mouseX = e.x - 800 + that.x - 8;
        that.mouseY = e.y - 450 + that.y - 8;
    },false);
    Entity.call(this, game, 200, 200);
}

Survivor.prototype = new Entity();
Survivor.prototype.constructor = Survivor;

Survivor.prototype.shoot = function (target) {


    // var relativeX = this.x + (this.animation.frameWidth/2) * this.animation.scale;
    // var relativeY = this.y + (this.animation.frameHeight/2) * this.animation.scale;
    // var targetVX = target.x - relativeX;
    // var targetVY = target.y - relativeY;
    // var shotVX = this.mouseX - relativeX;
    // var shotVY = this.mouseY - relativeY;
    // var vectorAngle = angleFromVectors(targetVX, targetVY, shotVX, shotVY);
    // var playerToTargetDist = distance({x : relativeX, y : relativeY}, {x : targetVX, y : targetVY});
    // var targetToLineDist = playerToTargetDist * Math.sin(vectorAngle);
    //
    // if (targetToLineDist <= target.radius) {
    //     return true;
    // }
    // else return false;

}
Survivor.prototype.rotateAndCache = function (that, sx, sy, sw, sh, angle) {
    var offscreenCanvas = document.createElement('canvas');
    var size = Math.max(that.animation.frameWidth, that.animation.frameHeight);
    offscreenCanvas.width = size;
    offscreenCanvas.height = size;
    var offscreenCtx = offscreenCanvas.getContext('2d');
    offscreenCtx.save();
    offscreenCtx.translate(size / 2, size / 2);
    offscreenCtx.rotate(angle*Math.PI/180);
    offscreenCtx.translate(0, 0);
    offscreenCtx.drawImage(that.animation.spriteSheet, sx, sy, sw, sh, -(that.animation.frameWidth / 2),
        -(that.animation.frameHeight / 2), that.animation.frameWidth, that.animation.frameHeight);
    offscreenCtx.restore();
    //offscreenCtx.strokeStyle = "red";
    //offscreenCtx.strokeRect(0,0,size,size);
    return offscreenCanvas;
}

Survivor.prototype.detectCollision = function (theOther) {
    //If the other object is a square then let the square handle collision.
    // if (theOther.shape === "square") {
    //     theOther.detectCollision(this);
    // } else {
        var dist = distance(this, theOther);
        var collisionRange = this.radius;

        if (dist < collisionRange) {
            theOther.x += .03 * (theOther.x - this.x);
            theOther.y += .03 * (theOther.y - this.y);
            this.x -= .05 * (theOther.x - this.x);
            this.y -= .05 * (theOther.y - this.y);
        }
    //}
}

Survivor.prototype.update = function () {
    if (this.d === true) {
        this.x += this.speed * this.game.clockTick;
        this.mouseX += this.speed * this.game.clockTick;
    }
    if (this.s === true) {
        this.y += this.speed * this.game.clockTick;
        this.mouseY += this.speed * this.game.clockTick;
    }
    if (this.a === true) {
        this.x -= this.speed * this.game.clockTick;
        this.mouseX -= this.speed * this.game.clockTick;
    }
    if (this.w === true) {
        this.y -= this.speed * this.game.clockTick;
        this.mouseY -= this.speed * this.game.clockTick;
    }
    
    this.checkWalls();
    //Update my angle
    var x = (this.x +((this.animation.frameWidth/2) * this.animation.scale)) - this.mouseX;
    var y = (this.y + ((this.animation.frameHeight/2) * this.animation.scale)) - this.mouseY;
    this.myAngle = ((Math.atan2(y, x) - Math.atan2(0, 0)) * 180/ Math.PI) + 180;
    Entity.prototype.update.call(this);
}

Survivor.prototype.checkWalls = function () {
    var i = Math.floor((this.x + 50) / 400);
    var j = Math.floor((this.y + 50) / 400);
    var currentCell = this.game.maze.grid[i][j];

    /*
    First we are checking the gaps between our main cells that we draw.
    we must update the mouse xy relative to the player.
    */
    if ((this.x + this.animation.frameWidth * this.animation.scale / 2 > 400 * i + 300) &&
        (this.y + this.animation.frameHeight * this.animation.scale / 4 > 400 * j + 262.5)) {
        var difY = this.y + this.animation.frameHeight * this.animation.scale / 4 - (400 * j + 262.5);
        this.y -= difY;
        this.mouseY -= difY;
    }

    if ((this.x + this.animation.frameWidth * this.animation.scale / 2 > 400 * i + 300) &&
        (this.y + this.animation.frameHeight * this.animation.scale / 4 < 400 * j)) {
        var difY = (400 * j) - (this.y + this.animation.frameHeight * this.animation.scale / 4);
        this.y += difY;
        this.mouseY += difY;
    }

    if ((this.y + this.animation.frameHeight * this.animation.scale / 2 > 400 * j + 300) &&
        (this.x + this.animation.frameWidth * this.animation.scale / 4 > 400 * i + 250)) {
        var difX = this.x + this.animation.frameWidth * this.animation.scale / 4 - (400 * i + 250);
        this.x -= difX;
        this.mouseX -= difX;
    }

    if ((this.y + this.animation.frameHeight * this.animation.scale / 2 > 400 * j + 300) &&
        (this.x + this.animation.frameWidth * this.animation.scale / 4 < 400 * i)) {
        var difX = (400 * i) - (this.x + this.animation.frameWidth * this.animation.scale / 4);
        this.x += difX;
        this.mouseX += difX;
    }


    /*
    Now we check collision in the main cell walls.
    we must also update the mouse xy.
     */
    if (!currentCell.east && this.x + this.animation.frameWidth / 2 > 400 * i + 350) {
        var difX = this.x + this.animation.frameWidth / 2 - (400 * i + 350);
        this.x -= difX;
        this.mouseX -= difX;
    }
    if (!currentCell.south && this.y + this.animation.frameHeight / 2 > 400 * j + 350) {
        var difY = this.y + this.animation.frameHeight / 2 - (400 * j + 350);
        this.y -= difY;
        this.mouseY -= difY;
    }
    if (!currentCell.west && this.x + this.animation.frameWidth * this.animation.scale / 4 < 400 * i) {
        var difX = (400 * i) - (this.x + this.animation.frameWidth * this.animation.scale / 4);
        this.x += difX;
        this.mouseX += difX;
    }
    if (!currentCell.north && this.y + this.animation.frameHeight * this.animation.scale / 4 < 400 * j) {
        var difY = (400 * j) - (this.y + this.animation.frameHeight * this.animation.scale / 4);
        this.y += difY;
        this.mouseY += difY;
    }
}

Survivor.prototype.draw = function () {
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    this.game.ctx.beginPath();
    this.game.ctx.moveTo(this.x + ((this.animation.frameWidth/2) * this.animation.scale), this.y + ((this.animation.frameHeight/2) * this.animation.scale));
    var px = (this.x + ((this.animation.frameWidth/2) * this.animation.scale));
    var py = (this.y + ((this.animation.frameHeight/2) * this.animation.scale));
    var dx = px - 1600 / 2;
    var dy = py - 900 / 2;
    var lx = dx + this.mouseX;
    var ly = dy + this.mouseY;
    this.game.ctx.lineTo( this.mouseX, this.mouseY) ;
    this.game.ctx.strokeStyle = "#FFFFFF";
    this.game.ctx.stroke();
    Entity.prototype.draw.call(this);
}

function Shot(game, vX, vY) {
    
}

function Zombie(game, spritesheet){
    this.animation = new Animation(spritesheet, 288, 314, 5, 0.11, 15, true, 0.4,this);
    this.speed = .5 + Math.random() * 5;
    this.radius = 157 * this.animation.scale;
    this.shape = "circle";
    this.player = game.player;
    this.ctx = game.ctx;
    this.myAngle = 0;
    Entity.call(this, game, Math.floor(Math.random() * game.maze.grid.length) * 400 + 200, Math.floor(Math.random() * game.maze.grid[0].length) * 400 + 200);
}

Zombie.prototype = new Entity();
Zombie.prototype.constructor = Zombie;

Zombie.prototype.update = function() {
    if (distance(this, this.player) > this.radius) {
        this.x += this.speed * (this.player.x - this.x) /
            (distance(this, this.player));
        this.y += this.speed * (this.player.y - this.y) /
            (distance(this, this.player));
    }
    this.checkWalls();
    var x = (this.x +((this.animation.frameWidth/2) * this.animation.scale)) -
        (this.player.x + (this.player.animation.frameWidth / 2) * this.player.animation.scale);
    var y = (this.y + ((this.animation.frameHeight/2) * this.animation.scale)) -
        (this.player.y + (this.player.animation.frameHeight / 2) * this.player.animation.scale);
    this.myAngle = ((Math.atan2(y, x) - Math.atan2(0, 0)) * 180/ Math.PI) + 180;
    Entity.prototype.update.call(this);
}

Zombie.prototype.checkWalls = function () {
    var i = Math.floor((this.x + 50) / 400);
    var j = Math.floor((this.y + 50) / 400);
    var currentCell = this.game.maze.grid[i][j];

    /*
     First we are checking the gaps between our main cells that we draw.
     we must update the mouse xy relative to the player.
     */
    if ((this.x + this.animation.frameWidth * this.animation.scale / 2 > 400 * i + 300) &&
        (this.y + this.animation.frameHeight * this.animation.scale / 4 > 400 * j + 262.5)) {
        var difY = this.y + this.animation.frameHeight * this.animation.scale / 4 - (400 * j + 262.5);
        this.y -= difY;
    }

    if ((this.x + this.animation.frameWidth * this.animation.scale / 2 > 400 * i + 300) &&
        (this.y + this.animation.frameHeight * this.animation.scale / 4 < 400 * j)) {
        var difY = (400 * j) - (this.y + this.animation.frameHeight * this.animation.scale / 4);
        this.y += difY;
    }

    if ((this.y + this.animation.frameHeight * this.animation.scale / 2 > 400 * j + 300) &&
        (this.x + this.animation.frameWidth * this.animation.scale / 4 > 400 * i + 237.5)) {
        var difX = this.x + this.animation.frameWidth * this.animation.scale / 4 - (400 * i + 237.5);
        this.x -= difX;
    }

    if ((this.y + this.animation.frameHeight * this.animation.scale / 2 > 400 * j + 300) &&
        (this.x + this.animation.frameWidth * this.animation.scale / 4 < 400 * i)) {
        var difX = (400 * i) - (this.x + this.animation.frameWidth * this.animation.scale / 4);
        this.x += difX;
    }


    /*
     Now we check collision in the main cell walls.
     we must also update the mouse xy.
     */
    if (!currentCell.east && this.x + this.animation.frameWidth / 2 > 400 * i + 350) {
        var difX = this.x + this.animation.frameWidth / 2 - (400 * i + 350);
        this.x -= difX;
    }
    if (!currentCell.south && this.y + this.animation.frameHeight / 2 > 400 * j + 387.5) {
        var difY = this.y + this.animation.frameHeight / 2 - (400 * j + 387.5);
        this.y -= difY;
    }
    if (!currentCell.west && this.x + this.animation.frameWidth * this.animation.scale / 4 < 400 * i) {
        var difX = (400 * i) - (this.x + this.animation.frameWidth * this.animation.scale / 4);
        this.x += difX;
    }
    if (!currentCell.north && this.y + this.animation.frameHeight * this.animation.scale / 4 < 400 * j) {
        var difY = (400 * j) - (this.y + this.animation.frameHeight * this.animation.scale / 4);
        this.y += difY;
    }
}

Zombie.prototype.detectCollision = function (theOther) {
    //If the other object is a square then let the square handle collision.
    // if (theOther.shape === "square") {
    //     theOther.detectCollision(this);
    // } else {
        var dist = distance(this, theOther);
        var collisionRange = this.radius;
        if (dist < collisionRange) {
            this.x -= this.speed * .009 * (theOther.x - this.x);
            this.y -= this.speed * .009 * (theOther.y - this.y);
        }
    //}
}

Zombie.prototype.rotateAndCache = function (that, sx, sy, sw, sh, angle) {
    var offscreenCanvas = document.createElement('canvas');
    var size = Math.max(that.animation.frameWidth, that.animation.frameHeight);
    offscreenCanvas.width = size;
    offscreenCanvas.height = size;
    var offscreenCtx = offscreenCanvas.getContext('2d');
    offscreenCtx.save();
    offscreenCtx.translate(size / 2, size / 2);
    offscreenCtx.rotate(angle*Math.PI/180);
    offscreenCtx.translate(0, 0);
    offscreenCtx.drawImage(that.animation.spriteSheet, sx, sy, sw, sh, -(that.animation.frameWidth / 2),
        -(that.animation.frameHeight / 2), that.animation.frameWidth, that.animation.frameHeight);
    offscreenCtx.restore();
    //offscreenCtx.strokeStyle = "red";
    //offscreenCtx.strokeRect(0,0,size,size);
    return offscreenCanvas;
}

Zombie.prototype.draw = function () {
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    this.ctx.rect(this.x, this.y, ((this.animation.frameWidth) * this.animation.scale), ((this.animation.frameHeight) * this.animation.scale));
    this.ctx.stroke();
    Entity.prototype.draw.call(this);
}

AM.queueDownload("./src/img/background.jpg");
AM.queueDownload("./src/img/survivor_move_handgun_sprite.png");
AM.queueDownload("./src/img/survivor_handgun_idle_sprite.png");
AM.queueDownload("./src/img/survivor_feet_walking_sprite.png");
AM.queueDownload("./src/img/survivor_idle.png");
AM.queueDownload("./src/img/zombie_sprite.png");

AM.downloadAll(function () {
    var canvas = document.getElementById("gameWorld");
    var ctx = canvas.getContext("2d");

    var gameEngine = new GameEngine();
    gameEngine.initMaze(10);
    gameEngine.init(ctx);
    gameEngine.start();

    //gameEngine.addEntity(new Background(gameEngine, AM.getAsset("./src/img/background.jpg")));
    var player = new Survivor(gameEngine, AM.getAsset("./src/img/survivor_handgun_idle_sprite.png"));
    gameEngine.addEntity(player);
    gameEngine.player = player;

    for (var i = 0; i < 10; i++) {
        gameEngine.addEntity(new Zombie(gameEngine, AM.getAsset("./src/img/zombie_sprite.png")));
    }

    console.log("All Done!");
});