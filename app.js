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
            case 'join':
                joinGame(json,ws);
            break;
            case 'sendState': //heartbeat 역할
                updatePlayerState(json);
                updateOtherPos(ws);
            break;
        }
    });
});
wws.broadcast = function broadcast(data) {
    wws.clients.forEach(function each(client) {
      console.log('IT IS GETTING INSIDE CLIENTS');
      //console.log(client);
  

      console.log(data);
      client.send(data);
    });
  };
function makeJson(eventName, data){
    return JSON.stringify({eventName : eventName, data : data});
}
function makeJsonUser(eventName ,user){
    return JSON.stringify({eventName : eventName, socketID : user.socketID, nickname : user.nickname , type : user.type});
}
function makeJsonState(p){
    return JSON.stringify({eventName : 'receiveOtherState',socketID : p.socketID,x:p.vector2.x,y:p.vector2.y,state:p.state,dir:p.dir,hp:p.hp});
}
function connected(wws){
    wws.send(makeJson('connected','잘 연결되었단다!'));
}
function updatePlayerState(json){
    var x=json.x,y=json.y;
    let player=playersMap[json.socketID];
    player.vector2={x,y};
    player.state=json.state;
    player.dir=json.dir;
    player.hp=json.hp;
}
function initOtherPlayer(wws){
    players.forEach(element => {
        wws.send(makeJsonUser("initOtherPlayer",element));
    });
}
class user {
    constructor(socketID,nickname,type) { 
        this.socketID = socketID;
        this.nickname=nickname;
        this.vector2={0:0}; 
        this.type=type;
        this.state=0;
        this.dir=0;
        this.hp=0;
    } 
    get id() {  return this.socketID; } 
    get pos(){  return this.vector2;} 
}     
var players=new Array();//플레이어 리스트
var playersMap={};//플레이어 맵
function joinGame(json,wws){
    console.log(json.nickname+'님이 입장하였습니다.');
    let tmpUser= new user(json.socketID,json.nickname,json.type);
    initOtherPlayer(wws);
    players.push(tmpUser);
    playersMap[json.socketID]=tmpUser;
    notifyNewPlayer(json);
    return tmpUser;   
}

function notifyNewPlayer(user){
    wws.broadcast(makeJsonUser("notifyNewPlayer",user));
}
function updateOtherPos(wws){
    for(let i=0;i<players.length;i++){
        wws.send(makeJsonState(players[i]));
    }
}