// inheritance
function Survivor(game, spritesheet) {
    this.animation = new Animation(spritesheet, 258, 220, 6, 0.1, 18, true, .4,this);
    this.animation2 = new Animation(AM.getAsset("./src/img/survivor_move_handgun_sprite.png"), 258, 220, 6, 0.1, 18, true, .4, this);
    this.animation3 = this.animation;
    this.speed = 350;
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


    this.health = 1000;
    this.maxHealth = 1000;
    this.ammo = 21;
    this.water = 100;
    this.maxWater = 100;
    this.radiation = 0;

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
        if (e.code === "KeyF") {
            that.shoot();
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
    this.ctx.canvas.addEventListener("click", function () {
        that.shoot();
    });

    this.sfx = {};
    this.sfx.ninemm = [];

    this.sfx.ninemm[0] = new Audio('./src/aud/9mm.mp3');
    this.sfx.ninemm[1] = new Audio('./src/aud/9mm.mp3');
    this.sfx.ninemm[2] = new Audio('./src/aud/9mm.mp3');
    this.sfx.ninemm[3] = 0;
    this.sfx.noammo = new Audio('./src/aud/empty.mp3');

    Entity.call(this, game, 200, 200);
}

Survivor.prototype = new Entity();
Survivor.prototype.constructor = Survivor;

Survivor.prototype.shoot = function () {
    if (this.ammo <= 0) {
        this.sfx.noammo.pause();
        this.sfx.noammo.currentTime = 0;
        this.sfx.noammo.play();
    } else {
        var sound = this.sfx.ninemm[this.sfx.ninemm[3]];
        sound.pause();
        sound.currentTime = 0;
        sound.play();
        this.sfx.ninemm[3] = (this.sfx.ninemm[3] + 1) % 3;
        
        this.ammo -= 1;
        var realX = this.x + (this.animation.frameWidth * this.animation.scale / 2);
        var realY = this.y + (this.animation.frameHeight * this.animation.scale / 2);
        var theBullet = new Bullet(this.game, realX, realY);
        console.log(parseFloat(this.mouseY - realY) / mouseDist(this, {x: this.mouseX, y: this.mouseY})
            + ", " + parseFloat(this.mouseX - realX) / mouseDist(this, {x: this.mouseX, y: this.mouseY}));
        theBullet.velocity.y *= (parseFloat(this.mouseY - realY) / mouseDist(this, {x: this.mouseX, y: this.mouseY}));
        theBullet.velocity.x *= (parseFloat(this.mouseX - realX) / mouseDist(this, {x: this.mouseX, y: this.mouseY}));
        this.game.addEntity(theBullet);
    }
};

Survivor.prototype.takeDamage = function () {
    this.health -= 400;
};

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
};

Survivor.prototype.detectCollision = function (theOther) {
    if (!theOther instanceof Bullet) {
        var dist = distance(this, theOther);
        var collisionRange = this.radius * this.animation.scale + theOther.radius * theOther.animation.scale;
        var diff = collisionRange - dist;
        if (dist < collisionRange) {
                if (this.x < theOther.x) {
                    this.x -= diff / 2;
                    theOther.x += diff / 2;
                    if (this.y < theOther.y) {
                        this.y -= diff / 2;
                        theOther.y += diff / 2;
                    } else {
                        this.y += diff / 2;
                        theOther.y -= diff / 2;
                    }
                } else if (this.y < theOther.y) {
                    this.x += diff / 2;
                    theOther.x -= diff / 2;
                    this.y -= diff / 2;
                    theOther.y += diff / 2;
                } else {
                    this.x += diff / 2;
                    theOther.x -= diff / 2;
                    this.y += diff / 2;
                    theOther.y -= diff / 2;
                }
        }
    }
};

Survivor.prototype.update = function () {
    if (this.health < 1) {
        this.removeFromWorld = true;
    }
    /*
     * .25 health per frame= ~15 Health per second which is 150 health every 10 seconds or 900 health per minute.
     */
    if (this.health < 1000) this.health += 0.25;
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

    if (this.w || this.a || this.d || this.s) {
        this.water -= .062;
    }

    this.checkWalls();
    var x = (this.x +((this.animation.frameWidth/2) * this.animation.scale)) - this.mouseX;
    var y = (this.y + ((this.animation.frameHeight/2) * this.animation.scale)) - this.mouseY;
    this.myAngle = ((Math.atan2(y, x) - Math.atan2(0, 0)) * 180/ Math.PI) + 180;
    Entity.prototype.update.call(this);
};

Survivor.prototype.checkWalls = function () {

    /*
     This Block of code checks if the player has been nudged out of range of the maze cells.
     */
    if (this.x < 0) {
        this.mouseX -= this.x;
        this.x = 0;
    }
    if (this.y < 0) {
        this.mouseY -= this.y;
        this.y = 0;
    }
    if (this.x > 400 * this.game.maze.grid.length) {
        this.mouseX -= this.x - 400 * this.game.maze.grid.length;
        this.x = 400 * this.game.maze.grid.length;
    }
    if (this.y > 400 * this.game.maze.grid.length) {
        this.y -= this.y - 400 * this.game.maze.grid.length;
        this.mouseY = 400 * this.game.maze.grid.length;
    }
    var i = Math.floor((this.x + 50) / 400);
    var j = Math.floor((this.y + 50) / 400);
    var currentCell = this.game.maze.grid[i][j];

    /*
     First we are checking the gaps between our main cells that we draw.
     we must update the mouse xy relative to the player.
     */
    var difX = 0;
    var difY = 0;
    if ((this.x + this.animation.frameWidth * this.animation.scale / 2 > 400 * i + 300) &&
        (this.y + this.animation.frameHeight * this.animation.scale / 4 > 400 * j + 262.5)) {
        difY = this.y + this.animation.frameHeight * this.animation.scale / 4 - (400 * j + 262.5);
        this.y -= difY;
        this.mouseY -= difY;
    }

    if ((this.x + this.animation.frameWidth * this.animation.scale / 2 > 400 * i + 300) &&
        (this.y + this.animation.frameHeight * this.animation.scale / 4 < 400 * j)) {
        difY = (400 * j) - (this.y + this.animation.frameHeight * this.animation.scale / 4);
        this.y += difY;
        this.mouseY += difY;
    }

    if ((this.y + this.animation.frameHeight * this.animation.scale / 2 > 400 * j + 300) &&
        (this.x + this.animation.frameWidth * this.animation.scale / 4 > 400 * i + 250)) {
        difX = this.x + this.animation.frameWidth * this.animation.scale / 4 - (400 * i + 250);
        this.x -= difX;
        this.mouseX -= difX;
    }

    if ((this.y + this.animation.frameHeight * this.animation.scale / 2 > 400 * j + 300) &&
        (this.x + this.animation.frameWidth * this.animation.scale / 4 < 400 * i)) {
        difX = (400 * i) - (this.x + this.animation.frameWidth * this.animation.scale / 4);
        this.x += difX;
        this.mouseX += difX;
    }


    /*
     Now we check collision in the main cell walls.
     we must also update the mouse xy.
     */
    if (!currentCell.east && this.x + this.animation.frameWidth / 2 > 400 * i + 350) {
        difX = this.x + this.animation.frameWidth / 2 - (400 * i + 350);
        this.x -= difX;
        this.mouseX -= difX;
    }
    if (!currentCell.south && this.y + this.animation.frameHeight / 2 > 400 * j + 350) {
        difY = this.y + this.animation.frameHeight / 2 - (400 * j + 350);
        this.y -= difY;
        this.mouseY -= difY;
    }
    if (!currentCell.west && this.x + this.animation.frameWidth * this.animation.scale / 4 < 400 * i) {
        difX = (400 * i) - (this.x + this.animation.frameWidth * this.animation.scale / 4);
        this.x += difX;
        this.mouseX += difX;
    }
    if (!currentCell.north && this.y + this.animation.frameHeight * this.animation.scale / 4 < 400 * j) {
        difY = (400 * j) - (this.y + this.animation.frameHeight * this.animation.scale / 4);
        this.y += difY;
        this.mouseY += difY;
    }
};

Survivor.prototype.draw = function () {
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    this.game.ctx.beginPath();
    this.game.ctx.moveTo(this.x + ((this.animation.frameWidth/2) * this.animation.scale), this.y + ((this.animation.frameHeight/2) * this.animation.scale));
    this.game.ctx.lineTo( this.mouseX, this.mouseY) ;
    this.game.ctx.strokeStyle = "#FFFFFF";
    this.game.ctx.stroke();
    this.game.ctx.closePath()
    Entity.prototype.draw.call(this);
};
