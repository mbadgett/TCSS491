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
        var image = new Image();
        image.src = canvas.toDataURL("image/png");

        ctx.drawImage(image, x, y, this.frameWidth * this.scale,
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
    this.animation2 = new Animation(AM.getAsset("./img/survivor_move_handgun_sprite.png"), 258, 220, 6, 0.1, 18, true, .4, this);
    this.animation3 = this.animation;
    this.speed = 300;
    this.myAngle = 0;
    this.w = false;
    this.s = false;
    this.a = false;
    this.d = false;
    this.myDir = 0;
    this.ctx = game.ctx;
    var that = this;
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
    offscreenCtx.rotate(angle);
    offscreenCtx.translate(0, 0);
    offscreenCtx.drawImage(that.animation.spriteSheet, sx, sy, sw, sh, -(that.animation.frameWidth / 2),
        -(that.animation.frameHeight / 2), that.animation.frameWidth, that.animation.frameHeight);
    offscreenCtx.restore();
    //offscreenCtx.strokeStyle = "red";
    //offscreenCtx.strokeRect(0,0,size,size);
    return offscreenCanvas;
}

Survivor.prototype.update = function () {
    if (this.myDir === 0) {
        this.x += this.speed * this.game.clockTick;
        if (this.x > 600) {
            this.myDir = 90;
            this.myAngle += 90 * Math.PI / 180;
        }
    }
    if (this.myDir === 90) {
        this.y += this.speed * this.game.clockTick;
        if (this.y > 400) {
            this.myDir = 180;
            this.myAngle += 90 * Math.PI / 180;
        }
    }
    if (this.myDir === 180) {
        this.x -= this.speed * this.game.clockTick;
        if (this.x < 50) {
            this.myDir = 270;
            this.myAngle += 90 * Math.PI / 180;
        }
    }
    if (this.myDir === 270) {
        this.y -= this.speed * this.game.clockTick;
        if (this.y < 50) {
            this.myDir = 0;
            this.myAngle += 90 * Math.PI / 180;
        }
    }
}

Survivor.prototype.draw = function () {
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    Entity.prototype.draw.call(this);
}

AM.queueDownload("./src/img/background.jpg");
AM.queueDownload("./src/img/survivor_move_handgun_sprite.png");
AM.queueDownload("./src/img/survivor_handgun_idle_sprite.png");
AM.queueDownload("./src/img/survivor_idle.png");

AM.downloadAll(function () {
    var canvas = document.getElementById("gameWorld");
    var ctx = canvas.getContext("2d");

    var gameEngine = new GameEngine();
    gameEngine.init(ctx);
    gameEngine.start();

    gameEngine.addEntity(new Background(gameEngine, AM.getAsset("./src/img/background.jpg")));
    gameEngine.addEntity(new Survivor(gameEngine, AM.getAsset("./src/img/survivor_handgun_idle_sprite.png")));



    console.log("All Done!");
});