
var middlewareObj={};
middlewareObj.isLoggedIn = function(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }else{
        res.redirect("/login");
    }
}

middlewareObj.Authenticate = function(req,res,next){
        if(req.isAuthenticated()){
            res.redirect("/index");
        }else{
            return next();
        }    
}

module.exports = middlewareObj;