var AM = new AssetManager();

function distance(a, b) {
    if (b != null) {
        var dx = (a.x + a.animation.frameWidth * a.animation.scale / 2) - (b.x + b.animation.frameWidth * b.animation.scale / 2);
        var dy = (a.y + a.animation.frameHeight * a.animation.scale / 2) - (b.y + b.animation.frameHeight * b.animation.scale / 2);
        return Math.sqrt(dx * dx + dy * dy);
    } else {
        return 100000;
    }
}

function mouseDist(a, b) {
    if (b != null) {
        var dx = (a.x + a.animation.frameWidth * a.animation.scale / 2) - (b.x);
        var dy = (a.y + a.animation.frameHeight * a.animation.scale / 2) - (b.y);
        return Math.sqrt(dx * dx + dy * dy);
    } else {
        return 100000;
    }
}

// function angleFromVectors(aX, aY, bX, bY) {
//     var num = (aX * bX) + (aY * bY);
//     var denom = Math.sqrt((aX * aX) + (aY * aY)) * Math.sqrt((bX * bX) + (bY * bY));
//     return Math.acos(num / denom);
// }

function Animation(spriteSheet, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop, scale, that) {
    this.spriteSheet = spriteSheet;
    this.frameWidth = frameWidth;
    this.frameDuration = frameDuration;
    this.frameHeight = frameHeight;
    this.sheetWidth = sheetWidth;
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
    var xindex = frame % this.sheetWidth;
    var yindex = Math.floor(frame / this.sheetWidth);
    if (this.that != null) {
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
};

Animation.prototype.currentFrame = function () {
    return Math.floor(this.elapsedTime / this.frameDuration);
};

Animation.prototype.isDone = function () {
    return (this.elapsedTime >= this.totalTime);
};

// no inheritance
function Background(game, spritesheet) {
    this.x = 0;
    this.y = 0;
    this.spritesheet = spritesheet;
    this.game = game;
    this.ctx = game.ctx;
}

Background.prototype.draw = function () {
    this.ctx.drawImage(this.spritesheet,
                   this.x, this.y, 1600, 900);
};

Background.prototype.update = function () {
};

Background.prototype.detectCollision = function () {};

AM.queueDownload("./src/img/background.jpg");
AM.queueDownload("./src/img/survivor_move_handgun_sprite.png");
AM.queueDownload("./src/img/survivor_handgun_idle_sprite.png");
AM.queueDownload("./src/img/zombie_sprite.png");
AM.queueDownload("./src/img/Glenos-G_160_bullet.png");
AM.queueDownload("./src/img/3x3.png");
AM.queueDownload("./src/img/3x1.png");
AM.queueDownload("./src/img/1x3.png");
AM.queueDownload("./src/img/zombie_attack_sprite.png");
AM.downloadAll(function () {
    var canvas = document.getElementById("gameWorld");
    var ctx = canvas.getContext("2d");

    var gameEngine = new GameEngine();
    gameEngine.init(ctx);
    gameEngine.initMaze(20);
    gameEngine.showOutlines = true;

    //gameEngine.addEntity(new Background(gameEngine, AM.getAsset("./src/img/background.jpg")));
    var player = new Survivor(gameEngine, AM.getAsset("./src/img/survivor_handgun_idle_sprite.png"));
    gameEngine.addEntity(player);
    gameEngine.player = player;

    for (var i = 0; i < 50; i++) {
        gameEngine.addEntity(new Zombie(gameEngine, AM.getAsset("./src/img/zombie_sprite.png")));
    }
    gameEngine.start();
    console.log("All Done!");
});