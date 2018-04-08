class Game {
    // set up instance variables
    constructor(options) {
        this.timer = null;
        this.canvas = options.canvas;
        this.ctx = options.context;
        this.universe = options.universe;
        this.universeElem = document.getElementById('universe');
        this.speed = options.speed;

        // store refeences to bound listeners since otherwise you can't remove the listeners
        this.stopListener = this.stop.bind(this);
        this.playListener = this.play.bind(this);
        this.loopCellsListener = loopCells.bind(this);
        this.loadListener = this.load.bind(this);
        this.saveListener = this.save.bind(this);

        drawGrid.apply(this);
    }

    load() {
        const cells =  JSON.parse(localStorage.getItem('cells'));
        
        if (cells && cells.length === this.universe.length) {
            // assign the loaded cells to the grid
            Object.assign(this.universe.cells, cells);
            // loop over grid and paint loaded cells
            for (let i = 0; i < this.universe.height; i++) {
                for (let j=0; j < this.universe.length; j++) {
                    const cell = this.universe.cells[i][j];
                    this.ctx.fillStyle = (cell.state) ? '#333' : 'white';
                    this.ctx.fillRect(cell.x + 1,
                                      cell.y + 1,
                                      this.universe.cellLength - 2,
                                      this.universe.cellHeight - 2
                    );
                }
            }

        } 
    }

    save() {
        const cells = JSON.stringify(this.universe.cells);
        localStorage.setItem('cells', cells);
        document.getElementById('load').disabled = false;
    }

    // initial setup
    iniSetup() {
        const startBtn = document.getElementById('start');
        const saveBtn = document.getElementById('save');
        const loadBtn = document.getElementById('load');
        this.universeElem.addEventListener('click', this.loopCellsListener);
        // when user click, start the game
        startBtn.addEventListener('click', this.playListener);
        startBtn.disabled = false;

        saveBtn.addEventListener('click', this.saveListener);
        loadBtn.addEventListener('click', this.loadListener);
        if (!localStorage.getItem('cells')) {
            loadBtn.disabled = true;
        }
    }

    // start the game
    play(e) {
        const startBtn = document.getElementById('start');
        const stopBtn = document.getElementById('stop');
        // add click event to stop button
        stopBtn.addEventListener('click', this.stopListener);
        stopBtn.disabled = false;
        // remove the play click listener
        startBtn.removeEventListener('click', this.playListener);
        startBtn.disabled = true;
        // remove god mode
        this.universeElem.removeEventListener('click', this.loopCellsListener);
        // game loop, store handle for restart to stop the timer
        this.timer = setInterval(step.bind(this), this.speed);

        e.preventDefault();
    }

    // stop the game
    stop(e) {
        const stopBtn = document.getElementById('stop');
        // remove restart listener, it'll be added again if game start clicked
        stopBtn.removeEventListener('click', this.stopListener);
        stopBtn.disabled = true;
        // stop the timer
        clearInterval(this.timer);
        // reinitialise the game
        this.iniSetup();
        // if e isn't null then prevent default click behaviour
        e && e.preventDefault();
    }
}

// Private methods
// --------------------
// draw grid
function drawGrid() {
    this.ctx.strokeStyle = '#777';
    this.ctx.lineWidth = 1;
    // vertical lines
    for (let i = 1; i<this.universe.length; i++) {
        this.ctx.beginPath();
        this.ctx.moveTo(this.universe.cellLength * i, 0);
        this.ctx.lineTo(this.universe.cellLength * i,
                        this.universe.height * this.universe.cellHeight);
        this.ctx.stroke();
    }
    // horizontal lines
    for (let i = 1; i<this.universe.height; i++) {
        this.ctx.beginPath();
        this.ctx.moveTo(0, this.universe.cellHeight * i);
        this.ctx.lineTo(this.universe.length * this.universe.cellLength,
                        this.universe.cellHeight * i);
        this.ctx.stroke();
    }
}

// Loop over the cells initialising cells when the grid is clicked
function loopCells(e) {
    const universeElem = this.universeElem;
    const pageX = e.pageX - universeElem.offsetLeft;
    const pageY = e.pageY - universeElem.offsetTop;

    for (let i = 0; i < this.universe.height; i++) {
        for (let j=0; j < this.universe.length; j++) {
            const cell = this.universe.cells[i][j];
            // handle the click
            if (pageX > cell.x && pageX < cell.x + this.universe.cellLength &&
                pageY > cell.y && pageY < cell.y + this.universe.cellHeight ) {
                // chnage the cells
                changeCells.apply(this, [cell]);
            }
        }
    }
}

// 1 step = 1 generation
function step() {
    const self = this;
    const cellsToChange = [];
    for (let i = 0; i < this.universe.height; i++) {
        for (let j=0; j < this.universe.length; j++) {
            const cell = this.universe.cells[i][j];
            transitions(self, cell, cellsToChange);
        }
    }

    const lifeExists = cellsToChange.length > 0 ? true : false;

    if (lifeExists === true) {
        // update the cells that should be updated
        for (let i=0; i<cellsToChange.length; i++) {
            const cell = getCellById(self, cellsToChange[i]);
            // if the cell state was 0 change to 1, and vice versa.
            changeCells.apply(this, [cell]);
        }
    }
    else {
        this.stop(null);
        // console.log('life has ceased!');
    }
}

/*
*   pass the cell through the 4 rules.
    Note: cells should not update here, since altering 1 before you can
    analyze the others will cause erroneous outcomes.
*/
function transitions(self, cell, cellsToChange) {
    const uniLength = self.universe.length;
    const uniHeight = self.universe.height;
    let neighboursAlive = 0;
    // Go through the neighbours of each cell.
    for (let i = 0; i < 8; i++) {
        const neighbourID = cell.neighbours[i];
        if (neighbourID >= uniLength*uniHeight || neighbourID <0) {
            continue;
        }
        const neighbour = getCellById(self, neighbourID);
        if (neighbour.state === 1) {
            neighboursAlive++;
        }
    }
    if (cell.state === 1) {
        // ze life rules
        // -------------------
        // 1) Any live cell with fewer than two live neighbours dies, as
        // if caused by under-population.
        // 2) Any live cell with two or three live neighbours lives on to
        // the next generation.
        if (neighboursAlive < 2) {
            cellsToChange.push(cell.id);
        }
        // 3) Any live cell with more than three live neighbours dies, as if
        // by overcrowding.
        else if (neighboursAlive > 3) { 
            cellsToChange.push(cell.id);
        }
    }
    else {
        // 4) Any dead cell with exactly three live neighbours becomes a
        // live cell, as if by reproduction.
        if (neighboursAlive === 3) {
            cellsToChange.push(cell.id);
        }
    }
}

// flip the state of a cell, changing its colour and its state
function changeCells(cell) {
    this.ctx.fillStyle = (cell.state) ? 'white' : '#333';
    this.ctx.fillRect(cell.x+1,
                      cell.y+1,
                      this.universe.cellLength-2,
                      this.universe.cellHeight-2
                      );
    cell.state = (cell.state) ? 0 : 1;
}

function getCellById(self, id) {
    const row = Math.floor(id/self.universe.length);
    const column = id % self.universe.length;
    return self.universe.cells[row][column];
}

export default Game;
