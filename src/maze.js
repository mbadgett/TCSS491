/**
 * Created by Admin on 5/16/2016.
 */
function Maze(gridSize, game) {
    this.game = game;
    this.squareFloor = [];

    this.squareFloor[0] = AM.getAsset("./src/img/floors/default_floor/3x3.png");
    this.squareFloor[1] = AM.getAsset("./src/img/floors/mossy_floor/3x3.png");
    this.squareFloor[2] = AM.getAsset("./src/img/floors/default_floor/3x3.png");

    this.horiFloor = [];
    this.horiFloor[0] = AM.getAsset("./src/img/floors/default_floor/1x3.png");
    this.horiFloor[1] = AM.getAsset("./src/img/floors/mossy_floor/1x3.png");
    this.horiFloor[2] = AM.getAsset("./src/img/floors/default_floor/1x3.png");

    this.vertFloor = [];
    this.vertFloor [0] = AM.getAsset("./src/img/floors/default_floor/3x1.png");
    this.vertFloor [1] = AM.getAsset("./src/img/floors/mossy_floor/3x1.png");
    this.vertFloor [2] = AM.getAsset("./src/img/floors/default_floor/3x1.png");

    this.squareWall = AM.getAsset("./src/img/walls/mossy_floor/1x1.png");
    this.horiWall = AM.getAsset("./src/img/walls/mossy_floor/1x3.png");
    this.vertWall = AM.getAsset("./src/img/walls/mossy_floor/3x1.png");
    this.grid = new Array(gridSize);
    for (var i = 0; i < gridSize; i++) {
        this.grid[i] = new Array(gridSize);
    }
    this.stack = [];

    for (i = 0; i < this.grid.length; i++) {
        for (var j = 0; j < this.grid[0].length; j++) {
            this.grid[i][j] = new MazeCell(null, null, null, null);
        }
    }
    for (i = 0; i < this.grid.length - 1; i++) {
        for ( j = 0; j < this.grid[0].length; j++) {
            this.grid[i][j].right = this.grid[i + 1][j];
            this.grid[i + 1][j].left = this.grid[i][j];
        }
    }
    for (i = 0; i < this.grid.length; i++) {
        for ( j = 0; j < this.grid[0].length - 1; j++) {
            this.grid[i][j].down = this.grid[i][j + 1];
            this.grid[i][j + 1].up = this.grid[i][j];
        }
    }
    this.startMaze();
    // this.entrance = this.grid[0][0];
    // this.exit = this.grid[this.grid.length - 1][this.grid[0].length - 1];
    for (i = 0; i < gridSize / 2; i++) {
        var cell = this.grid[Math.floor(1 + Math.random() * (this.grid.length - 2))][1 + Math.floor(Math.random() * (this.grid[0].length - 2))];
        cell.north = true;
        cell.up.south = true;
        cell.east = true;
        cell.right.west = true;
        cell.south = true;
        cell.down.north = true;
        cell.west = true;
        cell.left.east = true;
    }
}


Maze.prototype.startMaze = function () {
    var m = this.grid[Math.floor(Math.random() * this.grid.length)][Math.floor(Math.random() * this.grid[0].length)];
    this.stack.push(m);
    m.visited = true;
    this.buildMaze(m.getRand());
};

Maze.prototype.buildMaze = function(cell) {
    this.stack.push(cell);
    cell.visited = true;
    var n = cell.getRand();
    while (n != null) {
        n.visited = true;
        this.buildMaze(n);
        n = cell.getRand();
    }
};

Maze.prototype.draw = function(ctx) {
    var x = Math.floor(this.game.player.x / 400);
    var y = Math.floor(this.game.player.y / 400);
    for (var i = x-2; i < x+3; i++) {
        for (var j = y-1; j < y+2; j++) {
            if ( i >= 0 && j >= 0 && i < this.grid.length && j < this.grid.length) {
                var cell = this.grid[i][j];
                ctx.drawImage(this.squareFloor[this.game.level - 1], i * 400, j * 400);
                if (cell.east) ctx.drawImage(this.horiFloor[this.game.level - 1], i * 400 + 300, j * 400);
                else ctx.drawImage(this.horiWall, i * 400 + 300, j * 400);
                if (cell.south) ctx.drawImage(this.vertFloor[this.game.level - 1], i * 400, j * 400 + 300);
                else ctx.drawImage(this.vertWall, i * 400, j * 400 + 300);
                ctx.drawImage(this.squareWall, i * 400 + 300, j * 400 + 300);
            }
        }
    }
    ctx.save();
    ctx.globalAlpha = .5;
    ctx.fillStyle = "#00FF00";
    ctx.fillRect((this.grid.length - 1)* 400, (this.grid.length - 1) * 400, 300, 300);
    ctx.fillStyle = "#0000FF";
    ctx.fillRect(0, 0, 300, 300);
    ctx.restore();
};

function MazeCell(u, r, d, l) {
    this.up = u;
    this.right = r;
    this.down = d;
    this.left = l;

    this.north = false;
    this.south = false;
    this.east = false;
    this.west = false;

    this.visited = false;
}

MazeCell.prototype.getRand = function() {
    var rtn = null;
    var unvisited = [];
    if (this.up != null && !this.up.visited) {
        unvisited.push(this.up);
    }
    if (this.right != null && !this.right.visited) {
        unvisited.push(this.right);
    }
    if (this.down != null && !this.down.visited) {
        unvisited.push(this.down);
    }
    if (this.left != null && !this.left.visited) {
        unvisited.push(this.left);
    }
    if (unvisited.length !== 0) {
        rtn = unvisited[Math.floor(Math.random() * unvisited.length)];
    }
    if (rtn != null) {
        if (rtn == this.up) {
            this.north = true;
            rtn.south = true;
        } else if (rtn == this.down) {
            this.south = true;
            rtn.north = true;
        } else if (rtn == this.left) {
            this.west = true;
            rtn.east = true;
        } else if (rtn == this.right) {
            this.east = true;
            rtn.west = true;
        }
    }
    return rtn;
};
