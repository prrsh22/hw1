function Game() {
    const gameBoard = document.getElementById('gameBoard');
    const rows = [];

    let width;
    let height;
    let numberOfMines;

    const initialScreenSetting = () => {
        const startBtn = document.getElementById('startBtn');
        startBtn.addEventListener('click', () => {
            initGame(checkInput());
        });
    }

    const checkInput = () => {
        const widthInput = document.getElementById('widthInput').value;
        const heightInput = document.getElementById('heightInput').value;
        const numberOfMinesInput = document.getElementById('numberOfMinesInput').value;
        let isValid = false;

        if (widthInput && heightInput && numberOfMinesInput) {
            if (widthInput > 30 || widthInput < 5 || heightInput > 30 || heightInput < 5) {
                alert('가로, 세로 길이는 5 이상 30 이하여야 합니다!');
            } else if (numberOfMinesInput < 0 || numberOfMinesInput > widthInput * heightInput) {
                alert('지뢰의 개수는 가로 * 세로 길이보다 작거나 같아야 합니다!');
            } else {
                width = widthInput;
                height = heightInput;
                numberOfMines = numberOfMinesInput;
                isValid = true;
            }
        } else {
            alert('모든 값을 입력해주세요!');
        }

        return {isValid, width, height, numberOfMines};
    }

    const initGame = ({isValid, width, height, numberOfMines}) => {

        if (!isValid) return;

        document.getElementById('initialScreen').remove();

        // 지뢰 넣을 인덱스 설정(순서 섞기)
        let cells = Array(width * height).fill(false);
        cells.fill(true, 0, numberOfMines);
        
        for (let i = cells.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [cells[i], cells[j]] = [cells[j], cells[i]];
        }

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

                    openCell(cell);
                });

                dom.addEventListener('contextmenu', (e) => {
                    e.preventDefault();
                    toggleMark(cell);
                });

                const cell = {
                    dom,
                    x: j,
                    y: i,
                    clicked: false,
                    marked: false,
                    isMine: cells[i*width+j]
                }
                row.push(cell);
            }
        }
    }

    initialScreenSetting();

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

    const openCell = (cell) => {
                
        cell.clicked = true;
        cell.dom.classList.add('opened');

        const neighbors = getNeighbors(cell);

        const numberOfMinesAround = neighbors.filter(neighbor => neighbor.isMine === true).length;
        cell.dom.textContent = numberOfMinesAround || '';

        if (numberOfMinesAround === 0) {
            neighbors.filter(n => !n.clicked && !n.marked).forEach(n => openCell(n));
        }
    }

    const toggleMark = (cell) => {
        if (cell.clicked) return;
        cell.dom.classList.toggle('marked');
        cell.marked = !cell.marked;
    }

};

Game();