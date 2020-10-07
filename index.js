var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 5000;
var faker = require('faker');
var axios = require('axios');
var path = require('path');
var {gateway} = require('./config');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

console.log(gateway);
let appData = '';

app.get('/', function(req, res){
  axios.get(`${gateway.app}/sockettest`)
      .then(async function(response){
        appData = await response.data;
      })
      .catch(function(error){
        console.warn(error)
      })
      .then(function(){
      });

  res.render('index', {data: JSON.stringify(appData)});
});

app.post('/data', function(req, res){
  console.log(appData !== '' ? appData : 'App Data is empty');
  const messageContent = {
    "host": faker.name.findName(),
    "client": faker.name.findName(),
    "message":faker.lorem.words(15)
  }
 io.sockets.emit('chat message', JSON.stringify(messageContent));
});

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});
