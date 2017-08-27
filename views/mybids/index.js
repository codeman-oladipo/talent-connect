'use strict';

exports.find = function(req, res, next){
 req.query.username = req.query.username ? req.query.username : '';
  req.query.limit = req.query.limit ? parseInt(req.query.limit, null) : 20;
  req.query.page = req.query.page ? parseInt(req.query.page, null) : 1;
  req.query.sort = req.query.sort ? req.query.sort : '_id';
    
if (!req.body.username) {
    res.location('/');
    res.redirect('/');
}

  var filters = {username: req.user.username};
  if (req.query.username) {
    filters.username = new RegExp('^.*?'+ req.query.username +'.*$', 'i');
  }

  req.app.db.models.Bid.pagedFind({
    filters: filters,
    keys: 'username jobID anwsers',
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
      res.render('mybids/index', {data: results.data});
    }
  });
};