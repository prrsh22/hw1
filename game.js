function Game() {
    const gameBoard = document.getElementById('gameBoard');
    const rows = [];
    const width = 10;
    const height = 10;


    const initGame = (width, height, numberOfMines) => {

        for (let i = 0; i < height; i++) {
            const row = [];
            const rowDom = document.createElement('div');
            gameBoard.appendChild(rowDom);
            rows.push(row);

            rowDom.className = 'row';
            for(let j=0; j < width; j++) {
                const dom = document.createElement('div');
                dom.className = 'cell';
                rowDom.appendChild(dom);

                dom.addEventListener('click', function() {
                    if (cell.clicked || cell.marked) return;

                    if (cell.isMine) return gameOver(false);

                    const neighbors = getNeighbors(cell);
                    console.log(neighbors);
                    cell.dom.textContent = neighbors.filter(neighbor => neighbor.isMine === true).length;

                    cell.clicked = true;
                });

                const cell = {
                    dom,
                    x: j,
                    y: i,
                    clicked: false,
                    marked: false,
                    isMine: 0.3 > Math.random()
                }
                row.push(cell);
            }
        }
    }

    initGame(width, height, 10);

    const gameOver = (isWin) => {
        if (!isWin) alert('bannnnnnnnng');
    }

    const getNeighbors = (cell) => {
        const x = cell.x;
        const y = cell.y;
        const neighbors = [];
        for (let i = Math.max(0, y - 1); i <= Math.min(height - 1, y + 1) ;i++) {
            for (let j = Math.max(0, x - 1); j <= Math.min(width -1, x + 1); j++) {
                if (x === j && y === i) continue;
                neighbors.push(rows[i][j]);
            }
        }

        return neighbors;
    }
    console.log(rows);
};

Game();