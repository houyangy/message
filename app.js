var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var index = require('./routes/index');
var users = require('./routes/users');
var login = require('./routes/login');
var indexLogin = require('./routes/indexLogin');
var session = require("express-session");

var ejs=require("ejs");
var app = express();
var server = require('http').createServer(app);

//服务器  客户端
var io = require('socket.io')(server);
var clients={

};
var infos={

};

io.on('connection', function(client){
   client.on("event",function(data){
       console.log(data.id);
        clients[data.id]=client;
        infos[data.id]={name:data.name,id:data.id}
       client.emit("event",infos);
   })
   client.on("one",function(data){
       var id=data.id;
       var text=data.text;
       var self=data.self;
       console.log(id);
       /*
       * self  txt
       * */
       clients[id].emit("one",{self:self,text:text})

   })
});




app.use(session({ secret: 'keyboard cat', resave: false, saveUninitialized: true, name:"abc",cookie: {  }}))
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
global.rootPath=__dirname;

app.use("/indexLogin",indexLogin);


app.use("/login",login);
app.use('/admin',function(req,res,next){
    if(req.session.login=="yes"){
        next();
    }else{
        res.redirect("/login");
    }
} ,users);

app.use('/',function(req,res,next){
    if(req.session.indexLogin=="yes"){
        next();
    }else{
       res.sendFile(rootPath+"/views/index/login.html");
    }
},index);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;

  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');

});

server.listen(18080);

