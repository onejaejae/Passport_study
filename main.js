const express = require('express');
const app = express();
const fs = require('fs');
const bodyParser = require('body-parser');
const compression = require('compression');
const helmet = require('helmet')
const session = require('express-session')
const FileStore = require('session-file-store')(session);
const flash = require('connect-flash');

const indexRouter = require('./routes/index');
const topicRouter = require('./routes/topic');
const authRouter = require('./routes/auth');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const authData = {
    email : "egoing777@gmail.com",
    password : '111111',
    nickname : 'egoing'
}

app.use(helmet());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(compression());

app.use(session({
  secret: 'asdasd',
  resave: false,
  saveUninitialized: true,
  store : new FileStore()
}))
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(
  {
    usernameField : 'email',
    passwordField : 'password',
  
  },
  function(username, password, done) {
  
    if(username !== authData.email){
      return done(null, false, { message : 'Incorrect username.'})
    }

    if(password !== authData.password){
      return done(null, false, { message : 'Incorrect password'})
    }

    return done(null, authData,{ message : 'welcome'}) 
  }
));

passport.serializeUser(function(user, done) {
  // serializeUser의 첫번째 매개변수는
  // LocalStrategy에서 로그인이 성공했을 때, 보내는 authDatad의 값이 들어있다.
  console.log("serializeUser", user)

  // 우리의 예제에서는 session을 FileStore로써 저장하기로 했다
  // sessions의 passport의 객체 key가 user인 value값으로 user.email이 저장된다.
  done(null, user.email);
});

passport.deserializeUser(function(id, done) {
  // deserializeUser의 첫번째 매개변수는
  // serializeUser에서 done 콜백함수에 넣은 user.email의 data가 들어있다
  console.log("deserializeUser", id)

  // authData는 req.user 정보로 들어간다.
  done(null, authData);
});

app.post('/auth/login_process',
  passport.authenticate('local', { 
    successRedirect: '/',
    failureRedirect: '/auth/login',
    failureFlash: true,
    successFlash: true
  }));

app.get('*', function(request, response, next){
  fs.readdir('./data', function(error, filelist){
    request.list = filelist;
    next();
  });
});

app.use('/', indexRouter);
app.use('/topic', topicRouter);
app.use('/auth', authRouter)

app.use(function(req, res, next) {
  res.status(404).send('Sorry cant find that!');
});

app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send('Something broke!')
});

app.listen(3000, function() {
  console.log('Example app listening on port 3000!')
});
