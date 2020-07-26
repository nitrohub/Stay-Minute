
var middlewareObj={};
middlewareObj.isLoggedIn = function(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }else{
        req.flash("error","You need to be logged in to that!");
        res.redirect("/login");
    }
}

middlewareObj.Authenticate = function(req,res,next){
        if(req.isAuthenticated()){
            req.flash("error","You are already logged in!!");
            res.redirect("/index");
        }else{
            return next();
        }    
}

module.exports = middlewareObj;