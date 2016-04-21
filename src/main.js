var AM = new AssetManager();

function Animation(spriteSheet, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop, scale) {
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
    //var img = new Image();
    
    ctx.drawImage(this.spriteSheet,
                 xindex * this.frameWidth, yindex * this.frameHeight,  // source from sheet
                 this.frameWidth, this.frameHeight,
                 x, y,
                 this.frameWidth * this.scale,
                 this.frameHeight * this.scale);
}

Animation.prototype.drawFrameRotated = function (tick, ctx, x, y, angle) {
    this.elapsedTime += tick;
    if (this.isDone()) {
        if (this.loop) this.elapsedTime = 0;
    }
    var frame = this.currentFrame();
    var xindex = 0;
    var yindex = 0;
    xindex = frame % this.sheetWidth;
    yindex = Math.floor(frame / this.sheetWidth);

    
    ctx.drawImage(this.spriteSheet,
        xindex * this.frameWidth, yindex * this.frameHeight,  // source from sheet
        this.frameWidth, this.frameHeight,
        x, y,
        this.frameWidth * this.scale,
        this.frameHeight * this.scale);
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
    this.animation = new Animation(spritesheet, 258, 220, 6, 0.1, 18, true, .4);
    this.animation2 = new Animation(AM.getAsset("./img/survivor_move_handgun_sprite.png"), 258, 220, 6, 0.1, 18, true, .4);
    this.animation3 = this.animation;
    this.speed = 150;
    this.w = false;
    this.s = false;
    this.a = false;
    this.d = false;
    //this.myDir = 0;
    this.ctx = game.ctx;
    var that = this;
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
    Entity.call(this, game, 0, 250);
}

Survivor.prototype = new Entity();
Survivor.prototype.constructor = Survivor;

Survivor.prototype.update = function () {
    if (this.d === true) {
        this.x += this.speed * this.game.clockTick;
        //if (this.x > 600) this.myDir = 90;

    } if (this.s === true) {
        this.y += this.speed * this.game.clockTick;
        //if (this.y > 400) this.myDir = 180;
    } if (this.a === true) {
        this.x -= this.speed * this.game.clockTick;
        //if (this.x < 50) this.myDir = 270;
    } if (this.w === true) {
        this.y -= this.speed * this.game.clockTick;
        //if (this.y < 50) this.myDir = 360;
    }
    this.ctx.save();
    this.ctx.rotate(.5);
    Entity.prototype.update.call(this);
    this.ctx.restore();
}

Survivor.prototype.draw = function () {
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    Entity.prototype.draw.call(this);
}

function Feet(game, spritesheet) {
    this.animation = new Animation(spritesheet, 258, 220, 1, 0.1, 1, true, .4);
    this.animation2 = new Animation(AM.getAsset("./img/survivor_feet_walking_sprite.png"), 258, 220, 6, 0.1, 18, true, .4);
    this.animation3 = this.animation;
    this.speed = 150;
    this.w = false;
    this.s = false;
    this.a = false;
    this.d = false;
    this.ctx = game.ctx;
    var that = this;
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
    Entity.call(this, game, 0, 250);
}

Feet.prototype = new Entity();
Feet.prototype.constructor = Feet;

Feet.prototype.update = function () {
    if (this.d === true) {
        this.x += this.speed * this.game.clockTick;
        //if (this.x > 600) this.myDir = 90;
    } if (this.s === true) {
        this.y += this.speed * this.game.clockTick;
        //if (this.y > 400) this.myDir = 180;
    } if (this.a === true) {
        this.x -= this.speed * this.game.clockTick;
        //if (this.x < 50) this.myDir = 270;
    } if (this.w === true) {
        this.y -= this.speed * this.game.clockTick;
        //if (this.y < 50) this.myDir = 360;
    }
    Entity.prototype.update.call(this);
}

Feet.prototype.draw = function () {
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    Entity.prototype.draw.call(this);
}
AM.queueDownload("./img/background.jpg");
AM.queueDownload("./img/survivor_move_handgun_sprite.png");
AM.queueDownload("./img/survivor_handgun_idle_sprite.png");
AM.queueDownload("./img/survivor_feet_walking_sprite.png");
AM.queueDownload("./img/survivor_idle.png");

AM.downloadAll(function () {
    var canvas = document.getElementById("gameWorld");
    var ctx = canvas.getContext("2d");

    var gameEngine = new GameEngine();
    gameEngine.init(ctx);
    gameEngine.start();

    gameEngine.addEntity(new Background(gameEngine, AM.getAsset("./img/background.jpg")));
    gameEngine.addEntity(new Feet(gameEngine, AM.getAsset("./img/survivor_idle.png")));
    gameEngine.addEntity(new Survivor(gameEngine, AM.getAsset("./img/survivor_handgun_idle_sprite.png")));



    console.log("All Done!");
});