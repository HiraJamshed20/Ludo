new Vue({
    template: `
        <div>
        <h4 style="background-color:tomato;font-family:verdana;text-align:center"> Your color: </h4>
        <div v-bind:class=mycolor> </div>
        <h4 style="background-color:tomato;font-family:verdana;text-align:center"> Your dice value: </h4>
        <div class="dice"> {{diceval}} </div>
        <h4 style="background-color:tomato;font-family:verdana;text-align:center"> {{display}} </h4>
        <h5 style="background-color:tomato;font-family:verdana;text-align:center"> {{wonmessage}} </h5>
        <h5 style="font-family:verdana;text-align:center"> {{error}} </h5>
        <div v-for="(row, i) in board" style="height:5vh" >
            <div v-for="(column, j) in row" v-bind:class="'cell'+i+j"> 
                <div v-for="(sprite, k) in column" v-on:click='clicksprite(i,j,k, board[i][j][k], playno)' v-bind:class=board[i][j][k]></div>
            </div>
        </div>
        </div>`,

    data: {
        ws: new WebSocket('ws://localhost:8000'),
        board:[],
        messtype: ' ',
        diceval: 1,
        display: ' ',
        mycolor: " ",
        playno: 0,
        turn: ' ',
        wonmessage: '*Last win displayed here*',
        error: ' '
    },
    methods: {
        clicksprite(i,j,k, col, playno)
        {
            this.error = ' '
            let go = 'no go time'
            if (playno == 1 && col == 'red') {go = 'go time'}
            else if (playno == 2 && col == 'green') {go = 'go time'}
            else if (playno == 3 && col == 'blue') {go = 'go time'}
            else if (playno == 4 && col == 'yellow') {go = 'go time'}
            else {go = 'false sprites'}


            if (go == 'go time') {
                let obj = {co1:i, co2:j, co3:k, color: col, playerno: playno}
                this.ws.send(JSON.stringify(obj))
                console.log('Coordinates sent to server: ', obj) 
                this.display = 'Start!'
            }
            else if (go == 'false sprites')
            {
                this.error = 'You can only click sprites of your own color! Try again...'
            }
            else 
            {
                this.display = 'wut'
            }
        }
    }
    ,
    mounted() {
        this.ws.onmessage = e => {
            let message = JSON.parse(e.data);
            console.log('Message recieved:', message)
            if (message.type == 'wait')
            {
                this.messtype = message.type;
                this.diceval = message.dice;
                this.display = 'Waiting for other players'
                this.mycolor = message.color;
                this.playno = message.playerno;
            }
            else if (message.type == 'newboard')
            {
                this.messtype = message.type;
                this.board = message.board;
                this.display = 'Start!'
            }
            else if (message.type == 'dice')
            {
                this.messtype = message.type;
                this.diceval = message.dice;
            }
            else if (message.type == 'turn')
            {
                this.display = 'It is ' + message.turn + "'s turn!"
                this.turn = message.turn
            }
            else if (message.type == 'message')
            {
                this.display = message.display;
            }
            else if (message.type == 'Excessive steps')
            {
                this.error = 'Your dice value is too big. Better luck next time!'
            }
            else if (message.type == 'Sprite won!')
            {
                this.wonmessage = message.col + "'s sprite has reached home! *Small dance of celebration*"
            }
            else if (message.type == 'Color won!')
            {
                this.wonmessage = message.col + " has won! *BIG dance of celebration*"
            }
        }
    },

}).$mount('#root')