var io = require('socket.io').listen(1228);
var vector2={x:0,y:0}//플레이어 위치
class user {//유저 정보를 담고 있는 클래스
    constructor(socket) { 
        this.socket = socket; 
        this.vector2={0:0}; 
    } 
    get id() { return this.socket.id; } 
    get pos(){return this.vector2;} 
}     
var players=new Array();//플레이어 리스트
var playersMap={};//플레이어 맵
function joinGame(socket){
    let tmpUser= new user(socket);
    players.push(tmpUser);
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
io.sockets.on("connection", function(socket){//새로운 유저 접속 시 이벤트
    console.log('${socket.id} 입장하였습니다.');
    let new_user=joinGame(socket);
});