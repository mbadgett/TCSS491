window.requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (/* function */ callback, /* DOMElement */ element) {
                window.setTimeout(callback, 1000 / 60);
            };
})();

function GameEngine() {
    this.entities = [];
    this.player = null;
    this.maze = null;
    this.ctx = null;
    this.level = 1;
    this.click = null;
    this.surfaceWidth = null;
    this.surfaceHeight = null;
    this.HUD = null;
    this.running = false;
    this.win = false;
}

GameEngine.prototype.init = function (ctx) {
    this.ctx = ctx;
    this.surfaceWidth = this.ctx.canvas.width;
    this.surfaceHeight = this.ctx.canvas.height;
    this.timer = new Timer();
    console.log('game initialized');
};

GameEngine.prototype.start = function (name) {
    console.log("starting " + name);
    this.running = true;
    var that = this;
    (function gameLoop() {
        that.loop();
            requestAnimFrame(gameLoop, that.ctx.canvas);
    })();
};

GameEngine.prototype.addEntity = function (entity) {
    console.log('added entity');
    this.entities.push(entity);
};

GameEngine.prototype.draw = function () {

    this.ctx.clearRect(0, 0, this.surfaceWidth, this.surfaceHeight);
    this.ctx.save();
    if (this.player != null) {
        this.ctx.translate(-this.player.x + (this.surfaceWidth / 2), -this.player.y + (this.surfaceHeight / 2));
    }
    if (this.maze != null) {
        this.maze.draw(this.ctx);
    } else {
        this.entities[0].draw(this.ctx);
    }
    for (var i = 0; i < this.entities.length; i++) {
        var entity = this.entities[i];
        if (distance(entity, this.player) < 700)
            entity.draw(this.ctx);
    }

    if (this.HUD != null) {
        this.HUD.draw();
    }
    this.ctx.restore();
};

GameEngine.prototype.update = function () {
    var entitiesCount = this.entities.length;
    for (var i = 0; i < entitiesCount; i++) {
        var entity = this.entities[i];
        if (!entity.removeFromWorld) {
            entity.update();
        }
    }
    for (i = this.entities.length - 1; i >= 0; --i) {
        if (this.entities[i].removeFromWorld) {
            this.entities.splice(i, 1);
        }
    }
};

GameEngine.prototype.loop = function () {
    if (this.running) {
        this.clockTick = this.timer.tick();
        this.update();
        this.draw();
        this.click = null;
        this.wheel = null;
    }
};

GameEngine.prototype.initMaze = function (size) {
    this.maze = new Maze(size, this);
};

GameEngine.prototype.reset = function(referenceEngine, isNewGame) {
    if (!referenceEngine.gameStarted) {
        this.entities = [];
        if (isNewGame) {
            this.initMaze(this.level * 5);
            this.win = false;
        }
        this.player.x = 200;
        this.player.y = 200;
        this.player.health = 1000;
        this.player.ammo = 60;
        this.player.water = 100;
        this.hasGPS = false;
        this.hasMap = false;
        this.entities.push(this.player);
        for (var i = 0; i < 10 + (20 * (this.level - 1) * (this.level - 1)); i++) {
            var zombie = new Zombie(this, AM.getAsset("./src/img/zombie_sprite.png"));
            if (distance(this.player, zombie) > 500) {
                this.addEntity(zombie);
            } else i--;
        }
        for (i = 0; i < 10 * this.level; i++) {
            this.addEntity(new Pickup(this));
        }
        referenceEngine.gameStarted = true;
        this.running = true;
    }
};

function Timer() {
    this.gameTime = 0;
    this.maxStep = 0.05;
    this.wallLastTimestamp = 0;
}

Timer.prototype.tick = function () {
    var wallCurrent = Date.now();
    var wallDelta = (wallCurrent - this.wallLastTimestamp) / 1000;
    this.wallLastTimestamp = wallCurrent;

    var gameDelta = Math.min(wallDelta, this.maxStep);
    this.gameTime += gameDelta;
    return gameDelta;
};

function Entity(game, x, y) {
    this.game = game;
    this.x = x;
    this.y = y;
    this.removeFromWorld = false;
}

Entity.prototype.detectCollision = function () {};

Entity.prototype.update = function () {
    for (var i = 0; i < this.game.entities.length; i++) {
        this.detectCollision(this.game.entities[i]);
    }
};

Entity.prototype.draw = function (ctx) {
    if (this.game.showOutlines && this.radius) {
        this.game.ctx.beginPath();
        this.game.ctx.strokeStyle = "green";
        this.game.ctx.arc(this.x + (this.animation.frameWidth * this.animation.scale / 2),
            this.y + (this.animation.frameHeight * this.animation.scale / 2),
            this.radius * this.animation.scale, 0, Math.PI * 2, false);
        this.game.ctx.stroke();
        this.game.ctx.closePath();
    }
};

Entity.prototype.rotateAndCache = function (image, angle) {
    var offscreenCanvas = document.createElement('canvas');
    var size = Math.max(image.width, image.height);
    offscreenCanvas.width = size;
    offscreenCanvas.height = size;
    var offscreenCtx = offscreenCanvas.getContext('2d');
    offscreenCtx.save();
    offscreenCtx.translate(size / 2, size / 2);
    offscreenCtx.rotate(angle);
    offscreenCtx.translate(0, 0);
    offscreenCtx.drawImage(image, -(image.width / 2), -(image.height / 2));
    offscreenCtx.restore();
    //offscreenCtx.strokeStyle = "red";
    //offscreenCtx.strokeRect(0,0,size,size);
    return offscreenCanvas;
};