var AM = new AssetManager();

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
                   this.x, this.y);
};

Background.prototype.update = function () {
};

// inheritance
function Survivor(game, spritesheet) {
    this.animation = new Animation(spritesheet, 258, 220, 6, 0.1, 18, true, .4,this);
    this.animation2 = new Animation(AM.getAsset("./src/img/survivor_move_handgun_sprite.png"), 258, 220, 6, 0.1, 18, true, .4, this);
    this.animation3 = this.animation;
    this.speed = 150;
    this.myAngle = 0;
    this.radius = 258;
    this.w = false;
    this.s = false;
    this.a = false;
    this.d = false;
    this.myDir = 0;
    this.ctx = game.ctx;
    var that = this;

    var mouseX = 0;
    var mouseY = 0;

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
        that.mouseX = e.x - 8;
        that.mouseY = e.y - 8;
    },false);
    Entity.call(this, game, 0, 250);
}

Survivor.prototype = new Entity();
Survivor.prototype.constructor = Survivor;
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
    if (theOther.shape === "square") {
        theOther.detectCollision(this);
    } else {
        var vX = theOther.x - this.x;
        var vY = theOther.y - this.y;
        var dist = Math.sqrt(Math.pow(vX, 2) + Math.pow(vY, 2));
        var collisionRange = this.radius + theOther.radius;

        if (dist < collisionRange) {
            1===1;
        }
    }
}

Survivor.prototype.update = function () {
    if (this.d === true) {
        this.x += this.speed * this.game.clockTick;
    }
    if (this.s === true) {
        this.y += this.speed * this.game.clockTick;
    } 
    if (this.a === true) {
        this.x -= this.speed * this.game.clockTick;
    } 
    if (this.w === true) {
        this.y -= this.speed * this.game.clockTick;
    }
    //Update my angle
    var x = (this.x +((this.animation.frameWidth/2) * this.animation.scale)) - this.mouseX;
    var y = (this.y + ((this.animation.frameHeight/2) * this.animation.scale)) - this.mouseY;
    this.myAngle = ((Math.atan2(y, x) - Math.atan2(0, 0)) * 180/ Math.PI) + 180;
    Entity.prototype.update.call(this);
}

Survivor.prototype.draw = function () {
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    this.game.ctx.beginPath();
    this.game.ctx.moveTo(this.x + ((this.animation.frameWidth/2) * this.animation.scale), this.y + ((this.animation.frameHeight/2) * this.animation.scale));
    this.game.ctx.lineTo(this.mouseX, this.mouseY);
    this.game.ctx.stroke();
    Entity.prototype.draw.call(this);
}

function zombie(game, spritesheet){
    this.animation = new Animation(spritesheet, 288, 314, 5, 0.11, 15, true, 0.4,null);
    this.speed = 70;
    this.game = game;
    this.direction = 1;
    //this.x = 1;
    //this.y = 1;
    this.ctx = game.ctx;
    Entity.call(this,game,0,50);
}

zombie.prototype = new Entity();
zombie.prototype.constructor = zombie;

zombie.prototype.update = function() {
    
    Entity.prototype.update.call(this);
}

zombie.prototype.draw = function () {
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
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
    gameEngine.init(ctx);
    gameEngine.start();

    gameEngine.addEntity(new Background(gameEngine, AM.getAsset("./src/img/background.jpg")));
    gameEngine.addEntity(new Survivor(gameEngine, AM.getAsset("./src/img/survivor_handgun_idle_sprite.png")));
    gameEngine.addEntity(new zombie(gameEngine, AM.getAsset("./src/img/zombie_sprite.png")));

    
    console.log("All Done!");
});