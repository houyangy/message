var express=require("express");
var mysql=require("../comm/mysql");
var crypto=require("crypto");
var router=express.Router();


router.use("/check",function(req,res,next){
  var name=req.body.name;

  var pass=req.body.pass;
    var md5 = crypto.createHash('md5');
    md5.update(pass);
    pass=md5.digest('hex');
  mysql.query("select * from user",function(error,rows){
      var flag=true;
      for(var i=0;i<rows.length;i++){
          if(rows[i].name==name){
              if(rows[i].pass==pass){
                  flag=false;
                  req.session.indexLogin="yes";
                  req.session.name=name;
                  req.session.uid=rows[i].id;
                  res.redirect("/")
                  break;
              }
          }
      }
      if(flag){
          res.redirect("/")
      }
  })

})

module.exports = router;