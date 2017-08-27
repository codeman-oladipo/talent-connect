'use strict';

exports.find = function(req, res, next){
  req.query.name = req.query.title ? req.query.title : '';
  req.query.jobID = req.query.jobID ? req.query.jobID : '';
  req.query.limit = req.query.limit ? parseInt(req.query.limit, null) : 20;
  req.query.page = req.query.page ? parseInt(req.query.page, null) : 1;
  req.query.sort = req.query.sort ? req.query.sort : {"_id" : -1};

  var filters = {};
  if (req.query.username) {
    filters.username = new RegExp('^.*?'+ req.query.username +'.*$', 'i');
  }
   
  
  req.app.db.models.Job.pagedFind({
    filters: filters,
    keys: 'title username description',
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
      res.render('bids/index', {data: results.data});
    }
  });
};


exports.read = function(req, res, next){
  req.query.username = req.query.username ? req.query.username : '';
  req.query.limit = req.query.limit ? parseInt(req.query.limit, null) : 20;
  req.query.page = req.query.page ? parseInt(req.query.page, null) : 1;
  req.query.sort = req.query.sort ? req.query.sort : '_id';

  var filters = {jobID: req.params.id};
//  if (req.params.id) {
//    filters.jobID = new RegExp('^.*?'+ req.query.username +'.*$', 'i');
//  }
  
  req.app.db.models.Bid.pagedFind({
    filters: filters,
    keys: 'jobID username date total anwsers',
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
      res.render('bids/details',{data: results.data, nums : results.data.length});
    }
  });
};




//exports.read = function(req, res, next){
//  req.app.db.models.Bid.pagedFind({ jobID : req.params.id }, function(err, results){
//    if(err){
//      return next(err);
//    }
//
//    if(req.xhr){
//	  res.header("Cache-Control", "no-cache, no-store, must-revalidate");
//      results.filters = req.query;
//      res.send(results);
//    } else {
//	  results.filters = req.query;
//      res.render('bids/details',{data: results.data});
//    }
//  });
//};



//
//exports.read = function(req, res, next){
//  req.query.name = req.query.title ? req.query.title : '';
//  req.query.jobID = req.query.jobID ? req.query.jobID : '';
//  req.query.limit = req.query.limit ? parseInt(req.query.limit, null) : 20;
//  req.query.page = req.query.page ? parseInt(req.query.page, null) : 1;
//  req.query.sort = req.query.sort ? req.query.sort : '_id';
//
//  var filters = {};
//  if (req.query.username) {
//    filters.username = new RegExp('^.*?'+ req.query.username +'.*$', 'i');
//  }
//
//  req.app.db.models.Bid.pagedFind({
//    filters: filters,
//    keys: 'jobID username',
//    limit: req.query.limit,
//    page: req.query.page,
//    sort: req.query.sort
//    }, function(err, results) {
//    if (err) {
//      return next(err);
//    }
//
//    if (req.xhr) {
//      res.header("Cache-Control", "no-cache, no-store, must-revalidate");
//      results.filters = req.query;
//      res.send(results);
//    }
//    else {
//      results.filters = req.query;
//      res.render('bids/details', {data: results.data});
//    }
//  });
//};



//'use strict';
//
//exports.find = function(req, res, next){
//  req.query.title = req.query.title ? req.query.title : '';
//  req.query.limit = req.query.limit ? parseInt(req.query.limit, null) : 20;
//  req.query.page = req.query.page ? parseInt(req.query.page, null) : 1;
//  req.query.sort = req.query.sort ? req.query.sort : '_id';
//
//  var filters = {username: req.user.username};
//  if (req.query.username) {
//    filters.username = new RegExp('^.*?'+ req.query.username +'.*$', 'i');
//  }
//
//  req.app.db.models.Job.pagedFind({
//    filters: filters,
//    keys: 'title username description',
//    limit: req.query.limit,
//    page: req.query.page,
//    sort: req.query.sort
//  }, function(err, results) {
//    if (err) {
//      return next(err);
//    }
//
//    if (req.xhr) {
//      res.header("Cache-Control", "no-cache, no-store, must-revalidate");
//      results.filters = req.query;
//      res.send(results);
//    }
//    else {
//      results.filters = req.query;
//      res.render('bids/index', {data: results.data});
//    }
//  });
//
//
//};
//
//exports.read = function(req, res, next){
//  req.app.db.models.Job.findById(req.params.id).exec(function(err, event){
//    if(err){
//      return next(err);
//    }
//
//    if(req.xhr){
//      res.send(event);
//    } else {
//      res.render('bids/details',{event: event});
//    }
//  });
//};

//exports.read = function(req, res, next){
//  req.app.db.models.Job.findById(req.params.id).exec(function(err, event){
//    if(err){
//      return next(err);
//    }
//
//    if(req.xhr){
//      res.send(event);
//    } else {
//      res.render('bids/bidsPosted',{event: event});
//    }
//  });
//};
