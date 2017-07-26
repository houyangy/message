var express = require('express');
var router = express.Router();
var mysql=require("../comm/mysql");
var crypto=require("crypto");
/* GET home page. */
router.get('/', function(req, res, next) {
    res.render("admin/login.ejs");
});

router.use('/check', function(req, res, next) {
    var username=req.body.username;
    var password=req.body.password;
    var md5 = crypto.createHash('md5');
        md5.update(password);
     password=md5.digest('hex');
    var flag=true;
    mysql.query("select * from admin",function(error,rows){
       var result=rows[0];
       if(result.username==username){
           if(result.password==password){
               flag=false;
               req.session.login="yes";
               req.session.username=username;
               res.redirect("/admin");
           }
       }
       if(flag){
           res.redirect("/login");
       }
    })

});

module.exports = router;
