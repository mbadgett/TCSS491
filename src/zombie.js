function Zombie(game, spritesheet){
    this.animation = new Animation(spritesheet, 288, 310, 5, 0.11, 15, true, 0.4, this);
    this.animation2 = new Animation(AM.getAsset("./src/img/zombie_attack_sprite.png"), 288, 310, 3, .08, 9, true, 0.4, this);
    this.animation3 = this.animation;
    this.attacking = false;
    this.health = 1000;
    this.speed = 3 + Math.random() * 3;
    this.radius = 157 * this.animation.scale;
    this.player = game.player;
    this.ctx = game.ctx;
    this.myAngle = 0;
    this.attacked = false;
    Entity.call(this, game, Math.floor(Math.random() * game.maze.grid.length) * 400 + 200, Math.floor(Math.random() * game.maze.grid[0].length) * 400 + 200);
}
// comment
Zombie.prototype = new Entity();
Zombie.prototype.constructor = Zombie;

Zombie.prototype.update = function() {
    var distToPlayer = distance(this, this.player);
    if (distToPlayer < 700) {
        if (distToPlayer > this.radius * this.animation.scale) {
            this.x += this.speed * (this.player.x - this.x) /
                (distance(this, this.player));
            this.y += this.speed * (this.player.y - this.y) /
                (distance(this, this.player));
        }
        var attackRange = this.radius * this.animation.scale * 5;
        if (!this.attacking) {
            if (distToPlayer < attackRange) {
                this.animation = this.animation2;
                this.attacking = true;
            }
        } else {
            if (distToPlayer > attackRange) {
                this.animation = this.animation3;
                this.attacking = false;
            }
        }
        this.checkWalls();
        var x = (this.x + ((this.animation.frameWidth / 2) * this.animation.scale)) -
            (this.player.x + (this.player.animation.frameWidth / 2) * this.player.animation.scale);
        var y = (this.y + ((this.animation.frameHeight / 2) * this.animation.scale)) -
            (this.player.y + (this.player.animation.frameHeight / 2) * this.player.animation.scale);
        this.myAngle = ((Math.atan2(y, x) - Math.atan2(0, 0)) * 180 / Math.PI) + 180;
    }
    Entity.prototype.update.call(this);
};

Zombie.prototype.checkWalls = function () {
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
    }


    if ((this.x + this.animation.frameWidth * this.animation.scale / 2 > 400 * i + 300) &&
        (this.y + this.animation.frameHeight * this.animation.scale / 4 < 400 * j)) {
        difY = (400 * j) - (this.y + this.animation.frameHeight * this.animation.scale / 4);
        this.y += difY;
    }

    if ((this.y + this.animation.frameHeight * this.animation.scale / 2 > 400 * j + 300) &&
        (this.x + this.animation.frameWidth * this.animation.scale / 4 > 400 * i + 237.5)) {
        difX = this.x + this.animation.frameWidth * this.animation.scale / 4 - (400 * i + 237.5);
        this.x -= difX;
    }

    if ((this.y + this.animation.frameHeight * this.animation.scale / 2 > 400 * j + 300) &&
        (this.x + this.animation.frameWidth * this.animation.scale / 4 < 400 * i)) {
        difX = (400 * i) - (this.x + this.animation.frameWidth * this.animation.scale / 4);
        this.x += difX;

    }


    /*
     Now we check collision in the main cell walls.
     we must also update the mouse xy.
     */
    if (!currentCell.east && this.x + this.animation.frameWidth / 2 > 400 * i + 350) {
        difX = this.x + this.animation.frameWidth / 2 - (400 * i + 350);
        this.x -= difX;
    }
    if (!currentCell.south && this.y + this.animation.frameHeight / 2 > 400 * j + 387.5) {
        difY = this.y + this.animation.frameHeight / 2 - (400 * j + 387.5);
        this.y -= difY;
    }
    if (!currentCell.west && this.x + this.animation.frameWidth * this.animation.scale / 4 < 400 * i) {
        difX = (400 * i) - (this.x + this.animation.frameWidth * this.animation.scale / 4);
        this.x += difX;
    }
    if (!currentCell.north && this.y + this.animation.frameHeight * this.animation.scale / 4 < 400 * j) {
        difY = (400 * j) - (this.y + this.animation.frameHeight * this.animation.scale / 4);
        this.y += difY;
    }
};

Zombie.prototype.detectCollision = function (theOther) {
    var dist = distance(this, theOther);
    if (dist > 700) return;
    var collisionRange = this.radius * this.animation.scale + theOther.radius * theOther.animation.scale;
    if (this.attacking && theOther instanceof Survivor) collisionRange *= 1.5;
    var diff = collisionRange - dist;
    if (dist < collisionRange) {
        
        //Check if we need to attack the player
        if (theOther instanceof Survivor) {
            // Check if we are withing range to be on the atttacking animation.
            if (this.attacking) {
                //check that we are on the frame where the attack lands
                if (this.animation.currentFrame() === 6) {
                    //check if we have dealt damage yet in this frametime.
                    if (!this.attacked) {
                        //deal damage and set flag so we dont attack multipletimes for a single animation frame.
                        theOther.takeDamage();
                        this.attacked = true;
                    }
                } else {
                    // else we have moved beyond the attack frame so we can reset the flag for determining whether we
                    // attacked during this animation loop.
                    this.attacked = false;
                }
                
            }
        }
        else if (theOther instanceof Bullet) {
            this.takeDamage(theOther.damage());
            theOther.removeFromWorld = true;
        } else {
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

Zombie.prototype.takeDamage = function (damage) {
    this.health -= damage;
    if (this.health <= 0) {
        this.removeFromWorld = true;
        var spawn = new Zombie(this.game, this.animation3.spriteSheet);
        if (Math.random() > .80) {
            var pickup = new Pickup(this.game);
            pickup.x = this.x;
            pickup.y = this.y;
            this.game.addEntity(pickup);
        }
        if (distance(spawn, this) > 700) this.game.addEntity(spawn);
    }
};

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
};

Zombie.prototype.draw = function () {
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    // this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    // this.ctx.stroke();
    // this.ctx.closePath();
    if (this.health < 1000) {
        this.ctx.fillStyle = "#FF0000"
        this.ctx.fillRect(this.x, this.y, this.health / 10, 15);
    }
    Entity.prototype.draw.call(this);
};
