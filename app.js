const { timeStamp } = require("console");
const WebSocket = require("ws");
const wws = new WebSocket.Server({port : 1228});
console.log("정상적으로 서버가 실행되었습니다.");
var x,y;
wws.on("connection", function(ws) {
    console.log("플레이어가 접속했습니다. 연결 완료 응답을 보냅니다.");
    connected(ws);
    ws.on('message', function(message){
        let json=JSON.parse(message);
        switch(json.eventName) {
            case 'socketID':
                joinGame(json);
            break;
            case 'position':
                updatePlayerPos(json);
            break;
        }
    });
});
function makeJson(eventName, data){
    return JSON.stringify({eventName : eventName, data : data});
}
function connected(wws){
    wws.send(makeJson('connected','잘 연결되었단다!'));
}
function updatePlayerPos(json){
    var x=json.x,y=json.y;
    console.log(json.socketID+'님의 위치는'+x+y+'입니다.');
    let player=playersMap[json.socketID];
    player.vector2={x,y};
}
class user {
    constructor(socketID) { 
        this.socketID = socketID; 
        this.vector2={0:0}; 
    } 
    get id() {  return this.socketID; } 
    get pos(){  return this.vector2;} 
}     
var players=new Array();//플레이어 리스트
var playersMap={};//플레이어 맵
function joinGame(json){
    console.log(json.socketID+'님이 입장하였습니다.');
    let tmpUser= new user(json.socketID);
    players.push(tmpUser);
    playersMap[json.socketID]=tmpUser;
    return tmpUser;   
}
function leaveGame(socket) { 
    for (let i = 0; i < balls.length; ++i) { 
        if (balls[i].id == socket.id) { 
            balls.splice(i, 1); break; 
        } 
    }
    delete ballMap[socket.id]; 
}