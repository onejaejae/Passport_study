var express = require('express');
var router = express.Router();
var template = require('../lib/template.js');

router.get('/', function(request, response) { 
  // request.user의 정보는 deserializeUser 메서드의 콜백함수에서 결정한다
  // passport를 사용하지 않으면 request 객체는 user 정보를 갖고 있지 않다.
  console.log("/", request.user)

  const fmsg = request.flash();
  console.log(fmsg)
  let feedback = '';
  if(fmsg.success){
    feedback = fmsg.success[0]
  }

  const authStatusFunc = (request, response) => {
    let authStatusUI = `<a href="/auth/login">login</a>`;


    if(request.user){
      authStatusUI = `${request.user.nickname} | <a href="/auth/logout">logout</a>`;
     }

     return authStatusUI;
  }

  let authStatusUI = authStatusFunc(request, response);
  
    var title = 'Welcome';
    var description = 'Hello, Node.js';
    var list = template.list(request.list);
    var html = template.HTML(title, list,
      `
      <div>${feedback}<div>
      <h2>${title}</h2>${description}
      <img src="/images/hello.jpg" style="width:300px; display:block; margin-top:10px;">
      `,
      `<a href="/topic/create">create</a>`, authStatusUI
    ); 
    response.send(html);
  });
  
  module.exports = router;