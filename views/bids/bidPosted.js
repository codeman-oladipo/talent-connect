'use strict';

exports.find = function(req, res, next){
 req.query.jobID = req.query.jobID ? req.query.jobID : '';
  req.query.limit = req.query.limit ? parseInt(req.query.limit, null) : 20;
  req.query.page = req.query.page ? parseInt(req.query.page, null) : 1;
  req.query.sort = req.query.sort ? req.query.sort : '_id';

  var filters = {username: req.user.username};
  if (req.query.username) {
    filters.username = new RegExp('^.*?'+ req.query.username +'.*$', 'i');
  }

  req.app.db.models.Bid.pagedFind({
    filters: filters,
    keys: 'username',
    limit: req.query.limit,
    page: req.query.page,
    sort: req.query.sort
  }, function(err, results) {
    if (err) {
      return next(err);
    }

    if (req.xhr) {
      res.header("Cache-Control", "no-cache, no-store, must-revalidate");
      results.filters = req.query;
      res.send(results);
    }
    else {
      results.filters = req.query;
      res.render('bids/bidsPosted', {data: results.data});
    }
  });

	
	
  
	
	
};

exports.read = function(req, res, next){
  req.app.db.models.Bid.findById(req.params.id).exec(function(err, event){
    if(err){
      return next(err);
    }

    if(req.xhr){
      res.send(event);
    } else {
      res.render('bids/bidsPosted',{event: event});
    }
  });
};