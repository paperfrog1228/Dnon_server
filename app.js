const { timeStamp } = require("console");
const WebSocket = require("ws");
const wws = new WebSocket.Server({port : 1228});
console.log("정상적으로 서버가 실행되었습니다.");
wws.on("connection", function(ws) {
    console.log("플레이어가 접속했습니다. 연결 완료 응답을 보냅니다.");
    connected(ws);
    ws.on('message', function(message){
        let json=JSON.parse(message);
        switch(json.eventName) {
            case 'socketID':
                joinGame(json.data);
            break;
            case 'position':
                updatePlayerPos(json.data);
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
function updatePlayerPos(data){
   // playersMap[data.socketID].vector2={data.x,data.y};
}
class user {//유저 정보를 담고 있는 클래스
    constructor(socketID) { 
        this.socketID = socketID; 
        this.vector2={0:0}; 
    } 
    get id() {  return this.socketID; } 
    get pos(){  return this.vector2;} 
}     
var players=new Array();//플레이어 리스트
var playersMap={};//플레이어 맵
function joinGame(socketID){
    console.log(socketID+'님이 입장하였습니다.');
    let tmpUser= new user(socketID);
    players.push(tmpUser);
    playersMap[socketID]=tmpUser;
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