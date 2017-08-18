'use strict';

//exports.init = function(req, res){
//  res.render('account/index');
//};

exports.init = function(req, res, next){
  req.app.db.models.User.findById(req.user.id).exec(function(err, event){
    if(err){
      return next(err);
    }

    if(req.xhr){
      res.send(event);
    } else {
      res.render('account/index', {event: event});
    }
  });
};