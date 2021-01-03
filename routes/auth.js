const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const sanitizeHtml = require('sanitize-html');
const template = require('../lib/template.js');



router.get('/login', function(request, response){
    const authStatusFunc = (request, response) => {
        let authStatusUI = `<a href="/auth/login">login</a>`;
    
        if(request.user){
          authStatusUI = `${request.user.nickname} | <a href="/auth/logout">logout</a>`;
         }
    
    
         return authStatusUI;
      }
    
      let authStatusUI = authStatusFunc(request, response);

    const fmsg = request.flash();
    console.log(fmsg)
    let feedback = '';
    if(fmsg.error){
      feedback = fmsg.error[0]
    }
    var title = 'WEB - login';
    var list = template.list(request.list);
    var html = template.HTML(title, list, `
      <div>${feedback}<div>
      <form action="/auth/login_process" method="post">
        <p>
            <input type="email" name="email" placeholder="email">
        </p>
        <p>
            <input type="password" name="password" placeholder="password">
        </p>
        <p>
          <input type="submit" value="login">
        </p>
      </form>
    `, '', authStatusUI);
    response.send(html);
  });

router.get('/logout', function(request, response){
   
  request.logout();

  request.session.save(() => {
      response.redirect('/');
    })
  });

module.exports = router;


