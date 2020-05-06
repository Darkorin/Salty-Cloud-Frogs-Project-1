let boardState;
let tttTurn;
let player;
let tttURL;
let isGameOver = false;

const playTicTacToe = function () {
    // Sets up some variables that we'll need

    //Creates an array containing 9x"-" for our boardstate which we will use in our queryURL
    boardState = "---------".split('');
    //Creates an object which contains an advanced boardstate which we will use for checking win conditions
    advBoardState = {
        //For checking the rows
        rows: [
            ["-", "-", "-"],
            ["-", "-", "-"],
            ["-", "-", "-"],
        ],
        //For Checking the columns
        cols: [
            ["-", "-", "-"],
            ["-", "-", "-"],
            ["-", "-", "-"],
        ],
        //For Checking the diagonals
        diag1: ["-", "-", "-"],
        diag2: ["-", "-", "-"]
    }
    //Sets up turn variables
    tttTurn = "O";
    playerTurn = "O";
    cpuTurn = "X";

    //Sets the base tttURL. Final version will always look like https://stujo-tic-tac-toe-stujo-v1.p.rapidapi.com/${boardState}/${cpuTurn}
    tttURL = "https://stujo-tic-tac-toe-stujo-v1.p.rapidapi.com/";
}

const ticTacToeClickHandler = function (target) {
    //Prevents player from clicking during CPU turn.
    if (playerTurn != tttTurn) {
        return;
    }
    //Prevents the player from clicking a button that has already been used.
    if ($(target).text() != "") {
        return;
    }

    //updates board state
    updateBoardState(target.dataset.tttpos);
    if (isGameOver) {
        return;
    }
    //Sets up our AJAX call. Taken from the rapidAPI page. Couldn't make it work without this. 
    var settings = {
        "async": true,
        "crossDomain": true,
        //I join the boardstate array into a string here which I can insert into the URL
        "url": tttURL + `${boardState.join('')}/${cpuTurn}`,
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "stujo-tic-tac-toe-stujo-v1.p.rapidapi.com",
            "x-rapidapi-key": "542eb207a6msh608940e9801d301p1af396jsnbf710534c9ff"
        }
    }

    // Calls our API 
    $.ajax(settings).done(function (response) {
        //Adds the dramatic pause to the CPU turn.
        setTimeout(function () {
            //Updates the boardstate
            updateBoardState(response.recommendation);
        }, 1000);
    });
}

const updateBoardState = function (position) {
    //Edits the button text
    $(`#tttBtn${position}`).text(tttTurn);

    //Iterates through the array and edits the place that was clicked on the board.
    for (let i = 0; i < boardState.length; i++) {
        //Checks the clicked buttons tttPos dataset attribute to see if it is equal to the current index.
        if (position == i) {
            boardState[i] = tttTurn;
            //Sets i to boardState.length to exit the for loop without needless extra iterations.
            i = boardState.length;
        }
    }

    //Creates an object to store the advanced position data for the current move
    let advPos = {
        row: 0,
        column: 0,
        diag1: 0,
        diag2: 0
    };

    //Sets the advanced position row
    if (position < 3) {
        advPos.row = 0;
    } else if (position < 6) {
        advPos.row = 1;
    } else {
        advPos.row = 2;
    }
    //Sets the advanced position column
    if (position == 0 || position == 3 || position == 6) {
        advPos.column = 0;
    } else if (position == 1 || position == 4 || position == 7) {
        advPos.column = 1;
    } else {
        advPos.column = 2;
    }
    //Sets the advanced position diagonals
    if ((position + 1) % 2 === 1) {
        if (position == 4) {
            advPos.diag1 = 1;
            advPos.diag2 = 1;
        } else if (position == 0 || position == 8) {
            advPos.diag2 = -1;
            if (position == 0) {
                advPos.diag2 = 0;
            } else {
                advPos.diag2 = 2;
            }
        } else if (position == 2 || position == 6) {
            advPos.diag1 = -1;
            if (position == 2) {
                advPos.diag2 = 0;
            } else {
                advPos.diag2 = 2;
            }
        }
    } else {
        advPos.diag1 = -1;
        advPos.diag2 = -1;
    }

    // Updates the advanced boardState
    advBoardState.rows[advPos.row][advPos.column] = tttTurn;
    advBoardState.cols[advPos.column][advPos.row] = tttTurn;
    if (advPos.diag1 != -1) {
        advBoardState.diag1[advPos.diag1] = tttTurn;
    }
    if (advPos.diag2 != -1) {
        advBoardState.diag2[advPos.diag2] = tttTurn;
    }

    // Checks the boardstate to see if the game is over.
    checkGameOver();
    if (isGameOver) {
        alert("Game Over");
        return;
    }
    // Changes the current turn.
    if (tttTurn == playerTurn) {
        tttTurn = cpuTurn;
    } else {
        tttTurn = playerTurn;
    }
    $("#turnDisplay").text(tttTurn);


}

const checkGameOver = function () {
    //Checks the rows and columns for a game over
    let tempBool = false;

    for (let i = 0; i < advBoardState.rows.length; i++) {
        //Checks row i for a game over
        for (let j = 0; j < advBoardState.rows[i].length - 1; j++) {
            if (advBoardState.rows[i][j] === advBoardState.rows[i][j + 1]) {
                tempBool = true;
            } else {
                tempBool = false;
                j = advBoardState.rows[i].length;
            }
            if (advBoardState.rows[i][j] === "-") {
                tempBool = false;
                j = advBoardState.rows[i].length;
            }
        }
        //Exits the loop and function if game over is found.
        if (tempBool === true) {
            isGameOver = true;
            return;
        }
        //Checks col i for a game over
        for (let j = 0; j < advBoardState.cols[i].length - 1; j++) {
            if (advBoardState.cols[i][j] === advBoardState.cols[i][j + 1]) {
                tempBool = true;
            } else {
                tempBool = false;
                j = advBoardState.rows[i].length;
            }
            if (advBoardState.rows[i][j] === "-") {
                tempBool = false;
                j = advBoardState.rows[i].length;
            }
        }
        //Exits the loop and function if game over is found.
        if (tempBool === true) {
            isGameOver = true;
            return;
        }
    }

    //Checks the diagonals for a game over
    for (let i = 0; i < advBoardState.diag1.length - 1; i++) {
        if (advBoardState.diag1[i] === advBoardState.diag1[i + 1]) {
            tempBool = true;
        } else {
            tempBool = false;
            i = advBoardState.diag1.length;
        }
        if (advBoardState.diag1[i] === "-") {
            tempBool = false;
            i = advBoardState.diag1.length;
        }
    }
    if (tempBool === true) {
        isGameOver = true;
        return;
    }
    for (let i = 0; i < advBoardState.diag2.length - 1; i++) {
        if (advBoardState.diag2[i] === advBoardState.diag2[i + 1]) {
            tempBool = true;
        } else {
            tempBool = false;
            i = advBoardState.diag2.length;
        }
        if (advBoardState.diag2[i] === "-") {
            tempBool = false;
            i = advBoardState.diag2.length;
        }
    }
    if (tempBool === true) {
        isGameOver = true;
        return;
    }
}