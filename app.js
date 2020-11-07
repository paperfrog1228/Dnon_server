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
                joinGame(json,ws);
            break;
            case 'position': //heartbeat 역할
                updatePlayerPos(json);
                updateOtherPos(ws);
            break;
        }
    });
});
function makeJson(eventName, data){
    return JSON.stringify({eventName : eventName, data : data});
}
function makeJsonPos(socketID,vector2){
    return JSON.stringify({eventName : 'otherPosition',socketID : socketID,x:vector2.x,y:vector2.y});
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
function initOtherPlayer(wws){
    players.forEach(element => {
        wws.send(makeJson("initOtherPlayer",element.socketID));
    });
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
function joinGame(json,wws){
    console.log(json.socketID+'님이 입장하였습니다.');
    let tmpUser= new user(json.socketID);
    initOtherPlayer(wws);
    players.push(tmpUser);
    playersMap[json.socketID]=tmpUser;
    return tmpUser;   
}
function updateOtherPos(wws){
    for(let i=0;i<players.length;i++){
        wws.send(makeJsonPos(players[i].socketID,playersMap[players[i].socketID].vector2));
    }
}