const step = (color, ox, oy, steps) => {
            const transform = ([ox,oy]) => ({'blue': [+ox,+oy], 'green': [-ox,-oy], 'red': [-oy,+ox], 'yellow': [+oy,-ox]}[color])
            const path = ['-7,-7', '-1,-6', '-1,-5', '-1,-4', '-1,-3', '-1,-2', '-2,-1', '-3,-1', '-4,-1', '-5,-1', '-6,-1', 
                          '-7,-1', '-7,0', '-7,1', '-6,1', '-5,1', '-4,1', '-3,1', '-2,1', '-1,2', '-1,3', '-1,4',
                          '-1,5', '-1,6', '-1,7', '0,7', '1,7', '1,6', '1,5', '1,4', '1,3','1,2', '2,1', '3,1', '4,1', 
                          '5,1', '6,1', '7,1', '7,0', '7,-1', '6,-1', '5,-1', '4,-1', '3,-1', '2,-1', '1,-2', '1,-3', 
                          '1,-4', '1,-5','1,-6', '1,-7', '0,-7', '0,-6', '0,-5', '0,-4', '0,-3', '0,-2', '0,-1']
            const [x,y] =transform(transform(transform(path[path.indexOf(transform([ox-7, oy-7]).join(','))+steps].split(','))))
            return [x+7,y+7]
        }

const iskilled = (ox, oy) => (ox-7)*(ox-7)+(oy-7)*(oy-7) == 98

const dice = (lastdiceval, no) => {
    let dicev = Math.floor(Math.random()*6)
    while(dicev == 0)
    {
        dicev = Math.floor(Math.random()*6)
    }
    lastdiceval[no-1] = dicev;
    return dicev
}

const move = (boardgame, lastdiceval, coordx, coordy, coordz, no, color) => {
    let newcoord = []
    let returnmess = {type: 'nothing'}
    if(iskilled(coordx, coordy))
    {
        console.log("Still at home")
        if(lastdiceval[no - 1] == 5)
        {
            console.log('step')
            newcoord = step(color, coordx, coordy, 1);
            boardgame[coordx][coordy].splice(coordz,1);
            boardgame[newcoord[0]][newcoord[1]].push(color)
        }
    }
    else
    {
        let newarr = []
        console.log("Out of home")

        if (color == 'red' && (coordx+lastdiceval[no - 1]) >= 7 && coordy == 7) {
            if ((coordx+lastdiceval[no - 1]) == 7) {
                returnmess = {type: 'Sprite won!', col: 'Red'}
                boardgame[coordx][coordy].splice(coordz,1);
                boardgame[coordx+lastdiceval[no - 1]][coordy].push(color)
                return returnmess
            }
            returnmess = {type: 'Excessive steps'}
            return returnmess
        }
        else if (color == 'yellow' && (coordx-lastdiceval[no - 1]) <= 7 && coordy == 7) {
            if ((coordx-lastdiceval[no - 1]) == 7) {
                returnmess = {type: 'Sprite won!', col: 'Yellow'}
                boardgame[coordx][coordy].splice(coordz,1);
                boardgame[coordx-lastdiceval[no - 1]][coordy].push(color)
                return returnmess
            }
            //send mesage that not possible to move 
            returnmess = {type: 'Excessive steps'}
            return returnmess
        }
        else if (color == 'blue' && (coordy+lastdiceval[no - 1]) >= 7 && coordx == 7) {
            if ((coordy+lastdiceval[no - 1]) == 7) {
                returnmess = {type: 'Sprite won!', col: 'Blue'}
                boardgame[coordx][coordy].splice(coordz,1);
                boardgame[coordx][coordy+lastdiceval[no - 1]].push(color)
                return returnmess
            }
            //send message 
            returnmess = {type: 'Excessive steps'}
            return returnmess
        }
        else if (color == 'green' && (coordy-lastdiceval[no - 1]) <= 7 && coordx == 7) {
            if ((coordy-lastdiceval[no - 1]) == 7) {
                returnmess = {type: 'Sprite won!', col: 'Green'}
                boardgame[coordx][coordy].splice(coordz,1);
                boardgame[coordx][coordy-lastdiceval[no - 1]].push(color)
                return returnmess
            }
            //send message 
            returnmess = {type: 'Excessive steps'}
            return returnmess
        }
        else 
        {
            newcoord = step(color, coordx, coordy, lastdiceval[no - 1]);
            console.log(newcoord)
            //safe spots - red (2,6)(1,8), green (6,12)(8,13), blue (8,2)(6,1), yellow (12,12)(13,6)
            if (newcoord == [2,6] || newcoord == [1,8] || newcoord == [6,12] || newcoord == [8,13] || newcoord == [8,2] || newcoord == [6,1] || newcoord == [12,12] || newcoord == [13,6]) {
                console.log('safe spot')
            }
            else {
                if (boardgame[newcoord[0]][newcoord[1]] != []) { //killing the other sprites in the same position
                    console.log('kill')
                    for (i = 0; i < boardgame[newcoord[0]][newcoord[1]].length; i++) {
                        if (boardgame[newcoord[0]][newcoord[1]][i] != color) {
                            //know the homecoordinates of every color - blue (0,0), red (0,14), yellow (14,0), green (14,14)
                            let homesprite = boardgame[newcoord[0]][newcoord[1]][i];
                            if (homesprite == 'blue') {
                                boardgame[0][0].push(homesprite)
                            }
                            else if (homesprite == 'red') {
                                boardgame[0][14].push(homesprite)
                            }
                            else if (homesprite == 'yellow') {
                                boardgame[14][0].push(homesprite)
                            }
                            else if (homesprite == 'green') {
                                boardgame[14][14].push(homesprite)
                            }
                            else {
                                console.log('SOMETHING IS WRONGGGG')
                            }
                        }
                        else {
                            newarr.push(color)
                        }
                    } 
                }
            }
            //once I have killed all the sprites, and only my color remains in the new position if it were there, I can procees normally 
            boardgame[newcoord[0]][newcoord[1]] = newarr;
            boardgame[coordx][coordy].splice(coordz,1);
            boardgame[newcoord[0]][newcoord[1]].push(color)
        }   
    }
    return returnmess;
}

const WebSocket = require('ws')

const wss = new WebSocket.Server({port: 8000})

let boardgame = [
                [['blue','blue','blue', 'blue'],[],[],[],[],[],[],[],[],[],[],[],[],[],['red','red','red','red']],
                [[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]],
                [[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]],
                [[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]],
                [[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]],
                [[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]],
                [[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]],
                [[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]],
                [[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]],
                [[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]],
                [[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]],
                [[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]],
                [[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]],
                [[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]],
                [['yellow','yellow','yellow','yellow'],[],[],[],[],[],[],[],[],[],[],[],[],[],['green','green','green','green']]
            ]

let clients = []
let colors = ['red', 'green', 'blue', 'yellow']
let lastdiceval = [];
let turn = ' ';
let anotherturn = false

console.log('Waiting for clients...')

wss.on('connection', ws => {
    console.log('client connected')

    if (clients.length <= 4)
    {
        clients.push(ws);

        let dicev = dice(lastdiceval, clients.length)

        let mess = {type:'wait', board:[], dice:dicev, color: "color " + colors[0], playerno: clients.length}
        colors.shift()
        ws.send(JSON.stringify(mess))
    }

    if(clients.length == 4) //once client number reaches 4
    {
        colors = ['red', 'green', 'blue', 'yellow']
        let mess = {}
        for (i = 0; i < clients.length; i++) {
            mess = {type:'newboard', board:boardgame}
            console.log('Sending ', mess.type)
            clients[i].send(JSON.stringify(mess))
            mess = {type: 'turn', turn: 'red', playerno: '1'}
            clients[i].send(JSON.stringify(mess))
        }
        turn = colors[0]

        clients[0].on('message', async x => {
            x = JSON.parse(x);
            let coordx = x.co1;
            let coordy = x.co2;
            let coordz = x.co3;
            let color = x.color;
            let no = x.playerno;
            console.log('Recieved ', coordx, coordy, coordz, color, x.playerno)
            let spritetracker = 0

            if (color == turn) {
                mess = move(boardgame, lastdiceval, coordx, coordy, coordz, no, color)
                if (mess.type == 'Excessive steps') {
                    console.log('Excess')
                    clients[0].send(JSON.stringify(mess)) 
                }
                else if (mess.type == 'Sprite won!') {
                    spritetracker = spritetracker + 1;
                    for (i = 0; i < clients.length; i++) {
                        console.log('Sending ', mess.type)
                        clients[i].send(JSON.stringify(mess))
                    }
                }

                mess = {type:'newboard', board:boardgame} //sending the updated board
                for (i = 0; i < clients.length; i++) {
                    console.log('Sending ', mess.type)
                    clients[i].send(JSON.stringify(mess))
                }

                let dicev = dice(lastdiceval, no)

                mess = {type:'dice', dice: dicev} //sending the dice value
                console.log('Sending ', mess)
                clients[0].send(JSON.stringify(mess)) 

                for (i = 0; i < clients.length; i++) {
                    mess = {type: 'turn', turn: 'green', playerno: '2'}
                    console.log('Sending ', mess.type)
                    clients[i].send(JSON.stringify(mess))
                }
                turn = colors[1]

                if (spritetracker == 4) {
                    console.log('Red has won!')
                    mess = {type: 'Color won!', col: color}
                    for (i = 0; i < clients.length; i++) {
                        console.log('Sending ', mess.type)
                        clients[i].send(JSON.stringify(mess))
                    }
                    //close connection and remove it from the colors array
                    clients[0].close()
                }
            }
            else {
                mess = {type:'message', display:'It is not your turn yet!'}
                clients[0].send(JSON.stringify(mess))
            }

        })

        clients[1].on('message', async x => {
            x = JSON.parse(x);
            let coordx = x.co1;
            let coordy = x.co2;
            let coordz = x.co3;
            let color = x.color;
            let no = x.playerno;
            console.log('Recieved ', coordx, coordy, coordz, color, x.playerno)
            let spritetracker = 0

            if (color == turn) {
                mess = move(boardgame, lastdiceval, coordx, coordy, coordz, no, color)
                if (mess.type == 'Excessive steps') {
                    console.log('Excess')
                    clients[1].send(JSON.stringify(mess)) 
                }
                else if (mess.type == 'Sprite won!') {
                    spritetracker = spritetracker + 1
                    for (i = 0; i < clients.length; i++) {
                        console.log('Sending ', mess.type)
                        clients[i].send(JSON.stringify(mess))
                    }
                }

                mess = {type:'newboard', board:boardgame} //sending the updated board
                for (i = 0; i < clients.length; i++) {
                    console.log('Sending ', mess.type)
                    clients[i].send(JSON.stringify(mess))
                }

                let dicev = dice(lastdiceval, no)

                mess = {type:'dice', dice: dicev} //sending the dice value
                console.log('Sending ', mess)
                clients[1].send(JSON.stringify(mess))

                for (i = 0; i < clients.length; i++) {
                    mess = {type: 'turn', turn: 'blue', playerno: '3'}
                    console.log('Sending ', mess.type)
                    clients[i].send(JSON.stringify(mess))
                }
                turn = colors[2]

                if (spritetracker == 4) {
                    console.log('Green has won!')
                    mess = {type: 'Color won!', col: color}
                    for (i = 0; i < clients.length; i++) {
                        console.log('Sending ', mess.type)
                        clients[i].send(JSON.stringify(mess))
                    }
                    //close connection and remove it from the colors array
                    clients[1].close()
                }
            }
            else {
                mess = {type:'message', display:'It is not your turn yet!'}
                clients[1].send(JSON.stringify(mess))
            }
        })

        clients[2].on('message', async x => {
            x = JSON.parse(x);
            let coordx = x.co1;
            let coordy = x.co2;
            let coordz = x.co3;
            let color = x.color;
            let no = x.playerno;
            console.log('Recieved ', coordx, coordy, coordz, color, x.playerno)
            let spritetracker = 0

            if (color == turn) {
                mess = move(boardgame, lastdiceval, coordx, coordy, coordz, no, color)
                if (mess.type == 'Excessive steps') {
                    console.log('Excess')
                    clients[2].send(JSON.stringify(mess)) 
                }
                else if (mess.type == 'Sprite won!') {
                    spritetracker = spritetracker + 1
                    for (i = 0; i < clients.length; i++) {
                        console.log('Sending ', mess.type)
                        clients[i].send(JSON.stringify(mess))
                    }
                }

                mess = {type:'newboard', board:boardgame} //sending the updated board
                for (i = 0; i < clients.length; i++) {
                    console.log('Sending ', mess.type)
                    clients[i].send(JSON.stringify(mess))
                }

                let dicev = dice(lastdiceval, no)

                mess = {type:'dice', dice: dicev} //sending the dice value
                console.log('Sending ', mess)
                clients[2].send(JSON.stringify(mess))
                for (i = 0; i < clients.length; i++) {
                    mess = {type: 'turn', turn: 'yellow', playerno: '3'}
                    console.log('Sending ', mess.type)
                    clients[i].send(JSON.stringify(mess))
                }
                turn = colors[3]

                if (spritetracker == 4) {
                    console.log('Blue has won!')
                    mess = {type: 'Color won!', col: color}
                    for (i = 0; i < clients.length; i++) {
                        console.log('Sending ', mess.type)
                        clients[i].send(JSON.stringify(mess))
                    }
                    //close connection and remove it from the colors array
                    clients[2].close()
                }
            }
            else {
                mess = {type:'message', display:'It is not your turn yet!'}
                clients[2].send(JSON.stringify(mess))
            }
        })

        ws.on('message', async x => {
            x = JSON.parse(x);
            let coordx = x.co1;
            let coordy = x.co2;
            let coordz = x.co3;
            let color = x.color;
            let no = x.playerno;
            console.log('Recieved ', coordx, coordy, coordz, color, x.playerno)
            let spritetracker = 0

            if (color == turn) {
                mess = move(boardgame, lastdiceval, coordx, coordy, coordz, no, color)
                if (mess.type == 'Excessive steps') {
                    console.log('Excess')
                    ws.send(JSON.stringify(mess)) 
                }
                else if (mess.type == 'Sprite won!') {
                    spritetracker = spritetracker + 1
                    for (i = 0; i < clients.length; i++) {
                        console.log('Sending ', mess.type)
                        clients[i].send(JSON.stringify(mess))
                    }
                }

                mess = {type:'newboard', board:boardgame} //sending the updated board
                for (i = 0; i < clients.length; i++) {
                    console.log('Sending ', mess.type)
                    clients[i].send(JSON.stringify(mess))
                }

                let dicev = dice(lastdiceval, no)

                mess = {type:'dice', dice: dicev} //sending the dice value
                console.log('Sending ', mess)
                ws.send(JSON.stringify(mess))
                for (i = 0; i < clients.length; i++) {
                    mess = {type: 'turn', turn: 'red', playerno: '1'}
                    console.log('Sending ', mess.type)
                    clients[i].send(JSON.stringify(mess))
                }
                turn = colors[0]

                if (spritetracker == 4) {
                    console.log('Yellow has won!')
                    mess = {type: 'Color won!', col: color}
                    for (i = 0; i < clients.length; i++) {
                        console.log('Sending ', mess.type)
                        clients[i].send(JSON.stringify(mess))
                    }
                    //close connection and remove it from the colors array
                    ws.close()
                }
            }
            else {
                mess = {type:'message', display:'It is not your turn yet!'}
                ws.send(JSON.stringify(mess))
            }
        })
    }
})

//closing the connection when one wins 
//design
