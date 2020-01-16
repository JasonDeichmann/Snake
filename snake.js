//Initialize number of tiles
let w_tiles = 50;
let h_tiles = 50;

//Initialize board
let board = [];
for(let i = 0; i < h_tiles; i++){
    let row = [];
    for(let j = 0; j < w_tiles; j++){
        row.push(0);
    }
    board.push(row);
}

///Initialize game state
let is_playing = false;

//Initialize snake
let snake = {
    segments: [
        {
            x_tile: Math.floor(w_tiles / 2),
            y_tile: Math.floor(h_tiles / 2),
            dir: 0,
        }
    ],
};
board[snake.segments[0].y_tile][snake.segments[0].x_tile] = 1;

//Initialize the canvas
let canvas = document.getElementById('snake_canvas');
let context = canvas.getContext('2d');

//Initialize canvas dimensions
let w_canvas = canvas.width;
let h_canvas = canvas.height;
let w_per_tile = w_canvas / w_tiles;
let h_per_tile = h_canvas / h_tiles;

play();

function start_game(){
    if(is_playing == false) {
        is_playing = true;
        spawn_apple();
    }
}

function play(){
    if(is_playing) {

        //Move snake
        move_snake();

    }
    //Render the board
    render_board();

    setTimeout(play, 50);
}

function move_snake(){

    let last_segment = [snake.segments[snake.segments.length-1].x_tile, snake.segments[snake.segments.length-1].y_tile, snake.segments[snake.segments.length-1].dir];
    let apple_consumed = false;

    for(let i = 0; i < snake.segments.length; i++) {
        let cur_segment = snake.segments[i];
        board[cur_segment.y_tile][cur_segment.x_tile] = 0;

        switch (cur_segment.dir) {
            case 0: //Up
                cur_segment.y_tile--;
                break;
            case 1: //Right
                cur_segment.x_tile++;
                break;
            case 2: //Down
                cur_segment.y_tile++;
                break;
            case 3: //Left
                cur_segment.x_tile--;
                break;
        }
        snake.segments[i] = cur_segment;
        if(i == 0) {
            if (cur_segment.x_tile >= w_tiles || cur_segment.x_tile < 0 || cur_segment.y_tile >= h_tiles || cur_segment.y_tile < 0 || board[cur_segment.y_tile][cur_segment.x_tile] == 1) {
                reset_board();
            }

            //Check if there was an apple in that position
            apple_consumed = check_apple();
        }
    }

    if(apple_consumed)
        add_segment(last_segment);

    for(let i = 0; i < snake.segments.length; i++){
        //Update the tile
        board[snake.segments[i].y_tile][snake.segments[i].x_tile] = 1;
    }

    //Update the dir of the segments
    for(let i = snake.segments.length - 2; i >= 0; i--){
        snake.segments[i+1].dir = snake.segments[i].dir;
    }

}

function add_segment(last_segment){
    snake.segments.push({
        x_tile: last_segment[0],
        y_tile: last_segment[1],
        dir: last_segment[2]});
}

function check_apple(){
    if(board[snake.segments[0].y_tile][snake.segments[0].x_tile] == 2){
        //Spawn another apple
        spawn_apple();
        return true;
    }
}

function spawn_apple(){
    //Get valid spots
    let valid_spots = [];
    for(let i = 0; i < board.length; i++){
        for(let j = 0; j < board[i].length; j++){
            if(board[i][j] == 0){
                valid_spots.push([i, j]);
            }
        }
    }

    let random_tile = valid_spots[Math.floor(Math.random() * (valid_spots.length))];
    board[random_tile[0]][random_tile[1]] = 2;
}

function reset_board(){
    //Initialize board
    board = [];
    for(let i = 0; i < h_tiles; i++){
        let row = [];
        for(let j = 0; j < w_tiles; j++){
            row.push(0);
        }
        board.push(row);
    }

    //Initialize snake
    snake = {
        segments: [
            {
                x_tile: Math.floor(w_tiles / 2),
                y_tile: Math.floor(h_tiles / 2),
                dir: 0,
            },
        ],
    };
    board[snake.segments[0].y_tile][snake.segments[0].x_tile] = 1;
    is_playing = false;
}

function render_board(){
    context.clearRect(0, 0, w_canvas, h_canvas);
    for(let y = 0; y < board.length; y++){
        for(let x = 0; x < board[y].length; x++){
            if(board[y][x] == 1){
                context.fillStyle = 'black';
                context.fillRect(x*w_per_tile, y*h_per_tile, w_per_tile, h_per_tile);
            }
            else if(board[y][x] == 2){
                context.fillStyle = 'red';
                context.fillRect(x*w_per_tile, y*h_per_tile, w_per_tile, h_per_tile);
            }
        }
    }
}

//Bind directions
$(document).on('keydown', function(e){
    switch (e.keyCode) {
        case 38:
        case 87:
            if(snake.segments[0].dir !== 2)
                snake.segments[0].dir = 0;
            start_game();
            break;
        case 39:
        case 68:
            if(snake.segments[0].dir !== 3)
                snake.segments[0].dir = 1;
            start_game();
            break;
        case 40:
        case 83:
            if(snake.segments[0].dir !== 0)
                snake.segments[0].dir = 2;
            start_game();
            break;
        case 37:
        case 65:
            if(snake.segments[0].dir !== 1)
                snake.segments[0].dir = 3;
            start_game();
            break;
    }

});