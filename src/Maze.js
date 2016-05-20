/**
 * Created by Admin on 5/16/2016.
 */
function Maze(gridSize) {
    this.squareFloor = AM.getAsset("./src/img/3x3.png");
    this.horiFloor = AM.getAsset("./src/img/1x3.png");
    this.vertFloor = AM.getAsset("./src/img/3x1.png");
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
        for (var j = 0; j < this.grid[0].length; j++) {
            this.grid[i][j].right = this.grid[i + 1][j];
            this.grid[i + 1][j].left = this.grid[i][j];
        }
    }
    for (i = 0; i < this.grid.length; i++) {
        for (var j = 0; j < this.grid[0].length - 1; j++) {
            this.grid[i][j].down = this.grid[i][j + 1];
            this.grid[i][j + 1].up = this.grid[i][j];
        }
    }
    this.startMaze();
    this.entrance = this.grid[0][0];
    this.exit = this.grid[this.grid.length - 1][this.grid[0].length - 1];
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
    for (var i = 0; i < this.grid.length; i++) {
        for (var j = 0; j < this.grid[0].length; j++) {
            var cell = this.grid[i][j];
            ctx.drawImage(this.squareFloor, i * 400, j * 400);
            if (cell.east) ctx.drawImage(this.horiFloor, i * 400 + 300, j * 400);
            if (cell.south) ctx.drawImage(this.vertFloor, i * 400, j * 400 + 300);
        }
    }
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
    var unvisited = new Array();
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
