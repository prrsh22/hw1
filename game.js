function Game() {
    const gameBoard = document.getElementById('gameBoard');
    let rows = [];

    let width;
    let height;
    let numberOfMines;
    let gameEnded = false;
    let timer;
    let isRestarting = false;

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

        gameBoard.innerHTML = '';

        if (!isValid) return;

        const initialScreen = document.getElementById('initialScreen')
        initialScreen && initialScreen.remove();

        //메뉴, 상태바 삽입
        const statusBar = document.createElement('div');
        statusBar.className = 'statusBar';
        statusBar.innerHTML = `
            <div>
                남은 지뢰 개수: <span id="minesLeft">${numberOfMines}</span>
            </div>
            <div>
                게임 시간(초): <span id="timePassed">0</span>
            </div>
            <div>
               <button id="restartBtn">재시작</button>
            </div>
        `
        gameBoard.appendChild(statusBar);

        const restartBtn = document.getElementById('restartBtn');

        restartBtn.addEventListener('click', () => {
            if (isRestarting) return;
            isRestarting = true;
            restart();
        });

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
                    if (gameEnded || cell.clicked || cell.marked) return;
                    if (cell.isMine) return gameOver(false);
                    openCell(cell);
                });

                dom.addEventListener('contextmenu', (e) => {
                    e.preventDefault();
                    if (gameEnded) return;
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

        //타이머 시작
        timer = setInterval(addTimePassed, 1000);

    }

    initialScreenSetting();

    const gameOver = (isWin) => {
        gameEnded = true;
        clearInterval(timer);

        if (!isWin) {
            alert('bannnnnnnnng');
            rows.forEach(r => {
                r.filter(cell => cell.isMine).forEach(mine => {
                    mine.dom.classList.add('mine');
                });

                r.filter(cell => !cell.isMine && cell.marked).forEach(mine => {
                    mine.dom.classList.add('wrong');
                })
            });
        }
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

        const minesLeft = document.getElementById('minesLeft');
        let numberOfMinesLeft = Number(minesLeft.innerText);
        cell.marked ? numberOfMinesLeft += 1 : numberOfMinesLeft -= 1;
        minesLeft.innerText = numberOfMinesLeft;

        cell.dom.classList.toggle('marked');
        cell.marked = !cell.marked;
    }

    const addTimePassed = () => {
        const timePassed = document.getElementById('timePassed');
        timePassed.innerText = Number(timePassed.innerText) + 1;
    }

    const restart = () => {
        isRestarting = false;
        gameEnded = false;
        rows = [];
        clearInterval(timer);

        gameBoard.innerText = `기존 설정(${width} * ${height}, 지뢰 ${numberOfMines}개)으로 맵을 다시 만드는 중입니다..`;
        setTimeout(() => initGame({isValid: true, width, height, numberOfMines}), 2000);
    }

};

Game();