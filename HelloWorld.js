
const http = require('http');
 
const hostname = '0.0.0.0';
const port = '8081';

http.createServer(function (req, res) {

    res.writeHead(200, {'Content-Type': 'text/html'});
   
    res.end('Hello World111');
    
}).listen(port, hostname, 
() => {    
    console.log(`Server running at http://${hostname}:${port}/`);
});