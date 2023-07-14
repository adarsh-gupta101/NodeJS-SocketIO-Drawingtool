
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;

app.use(express.static(__dirname + '/public'));

function onConnection(socket){
    console.log("an unknown user joined the server")
  socket.on('drawing', (data) => socket.broadcast.emit('drawing', data));
}

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.htm');
  });

io.on('connection', onConnection);

http.listen(port, () => console.log('listening on port ' + port));