'use strict';

exports.find = function(req, res, next){
  req.query.name = req.query.title ? req.query.title : '';
  req.query.limit = req.query.limit ? parseInt(req.query.limit, null) : 10;
  req.query.page = req.query.page ? parseInt(req.query.page, null) : 1;
  req.query.sort = req.query.sort ? req.query.sort : {"_id" : -1};
    
// if (!req.body.username) {
//    res.location('/');
//    res.redirect('/');
// }

  var filters = {};
  if (req.query.username) {
    filters.username = new RegExp('^.*?'+ req.query.username +'.*$', 'i');
  }

  req.app.db.models.Job.pagedFind({
    filters: filters,
    keys: 'title username description date',
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
      res.render('jobs/index', {data: results.data, pageCount: results.pages});
    }
  });
    
    

//  req.app.db.models.Job.paginate({}, { page: req.query.page, limit: req.query.limit }, function(err, users) {
// 
//    if (err) return next(err);
// 
//    res.format({
//      html: function() {
//        res.render('users', {
//          users: users.docs,
//          pageCount: users.pages,
//          itemCount: users.limit,
//          pages: paginate.getArrayPages(req)(3, users.pages, req.query.page)
//        });
//      },
//      json: function() {
//        // inspired by Stripe's API response for list objects 
//        res.json({
//          object: 'list',
//          has_more: paginate.hasNextPages(req)(users.pages),
//          data: users.docs
//        });
//      }
//    });
//  });
    
    
};


exports.read = function(req, res, next){
  req.app.db.models.Job.findById(req.params.id).exec(function(err, event){
    if(err){
      return next(err);
    }

    if(req.xhr){
      res.send(event);
    } else {
      res.render('jobs/details',{event: event});
    }
  });
};

exports.add = function(req, res){
  if (!req.isAuthenticated()) {
    req.flash('error', "You are not logged in");
        res.location('/jobs');
        res.redirect('/jobs');
  }
  res.render('jobs/add');
};


exports.create = function(req, res, next){
  var workflow = req.app.utility.workflow(req, res);

  workflow.on('validate', function() {
    if (!req.body.title) {
      workflow.outcome.errors.push('Please enter a title.');
      return workflow.emit('response');
    }

    workflow.emit('createEvent');

  });

  workflow.on('createEvent', function(){
    var fieldsToSet = {
      name: req.body.name,
      description: req.body.description,
      title: req.body.title,
      date: req.body.date,
      maxSalary: req.body.maxSalary,
      minSalary: req.body.minSalary,
      username: req.user.username
    };

    req.app.db.models.Job.create(fieldsToSet, function(err, event){
      if(err){
        return workflow.emit('exception', err);
      }

      workflow.outcome.record = event;
        req.flash('success', 'Event Added!');
        res.location('/jobs');
        res.redirect('/jobs');
    });
  });
  workflow.emit('validate');
  
};

exports.edit = function(req, res, next){
  req.app.db.models.Job.findById(req.params.id).exec(function(err, event){
    if(err){
      return next(err);
    }

    if(req.xhr){
      res.send(event);
    } else {
      res.render('jobs/edit',{event: event});
    }
  });
};

exports.update = function(req, res, next){
  var workflow = req.app.utility.workflow(req, res);

  workflow.on('validate', function() {
    if (!req.body.name) {
      workflow.outcome.errors.push('Please enter a name.');
      return workflow.emit('response');
    }

    workflow.emit('updateEvent');

  });

  workflow.on('updateEvent', function(){
    var fieldsToSet = {
      name: req.body.name,
      description: req.body.description,
      title: req.body.title,
      maxSalary: req.body.maxSalary,
      minSalary: req.body.minSalary,
      username: req.user.username
    };

    req.app.db.models.Job.findByIdAndUpdate(req.params.id, fieldsToSet, function(err, event){
      if(err){
        return workflow.emit('exception', err);
      }

      workflow.outcome.record = event;
        req.flash('success', 'Event Updated!');
        res.location('/jobs/show/'+req.params.id);
        res.redirect('/jobs/show/'+req.params.id);
    });
  });
  workflow.emit('validate');
  
};

exports.bids = function(req, res, next){
  req.app.db.models.Job.findById(req.params.id).exec(function(err, event){
    if(err){
      return next(err);
    }

    if(req.xhr){
      res.send(event);
    } else {
      res.render('jobs/bids',{event: event});
    }
  });
};


//+++++++++++++++++++++++++postBids++++++++++++++++++++++++++++++++++//


exports.postBids = function(req, res, next){
  var workflow = req.app.utility.workflow(req, res);

  workflow.on('validate', function() {
    if (!req.body.anwsers) {
      workflow.outcome.errors.push('Please enter a anwsers.');
      return workflow.emit('response');
    }

    workflow.emit('postEvent');

  });

  workflow.on('postEvent', function(){
    var fieldsToSet = {
      jobID: req.body.jobID,
      anwsers: req.body.anwsers,
      date: req.body.date,
      percentSalary: req.body.percentSalary,
      percentFee: req.body.percentFee,
      total: req.body.total,
      username: req.user.username,
      postBy: req.user.postBy
    };

    req.app.db.models.Bid.create(fieldsToSet, function(err, event){
      if(err){
        return workflow.emit('exception', err);
      }

      workflow.outcome.record = event;
        req.flash('success', 'Event Added!');
        res.location('/');
        res.redirect('/');
    });
  });
  workflow.emit('validate');
  
};

//////////////////////////////////////////////////////////////////////////


exports.delete = function(req, res, next){
  console.log(33);
  var workflow = req.app.utility.workflow(req, res);

  workflow.on('validate', function() {
    workflow.emit('deleteEvent');
  });

  workflow.on('deleteEvent', function(){
    req.app.db.models.Job.findByIdAndRemove(req.params.id, function(err, event){
      if(err){
        return workflow.emit('exception', err);
      }
        req.flash('success', 'Job Deleted!');
        res.location('/jobs/');
        res.redirect('/jobs/');
    });
  });
  workflow.emit('validate');
  
};