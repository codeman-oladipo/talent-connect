'use strict';

exports.init = function(req, res){
  if (req.isAuthenticated()) {
    res.redirect(req.user.defaultReturnUrl());
  }
  else {
    res.render('login/forgot/index');
  }
};

exports.send = function(req, res, next){
  var workflow = req.app.utility.workflow(req, res);

  workflow.on('validate', function() {
    if (!req.body.email) {
      workflow.outcome.errfor.email = 'required';
      return workflow.emit('response');
    }

    workflow.emit('generateToken');
  });

  workflow.on('generateToken', function() {
    var crypto = require('crypto');
    crypto.randomBytes(21, function(err, buf) {
      if (err) {
        return next(err);
      }

      var token = buf.toString('hex');
      req.app.db.models.User.encryptPassword(token, function(err, hash) {
        if (err) {
          return next(err);
        }

        workflow.emit('patchUser', token, hash);
      });
    });
  });

  workflow.on('patchUser', function(token, hash) {
    var conditions = { email: req.body.email.toLowerCase() };
    var fieldsToSet = {
      resetPasswordToken: hash,
      resetPasswordExpires: Date.now() + 10000000
    };
    req.app.db.models.User.findOneAndUpdate(conditions, fieldsToSet, function(err, user) {
      if (err) {
        return workflow.emit('exception', err);
      }

      if (!user) {
        return workflow.emit('response');
      }

      workflow.emit('sendEmail', token, user);
    });
  });

  workflow.on('sendEmail', function(token, user) {
      
    var mailOptions = {
        from: '"Talent Connect 👻" <foo@blurdybloop.com>', // sender address
        to: 'user.email, muyiwa47@gmail.com', // list of receivers
        subject: 'Hello ✔', // Subject line
        text: 'Hello world? - talent Connect in the house', // plain text body
        html: '<b>Hello world?</b>' // html body
    };
      
       transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            req.flash('error : ', error);
            //return console.log(error);
        }
        req.flash('Message sent', info.messageId);
        //console.log('Message sent: %s', info.messageId);
        // Preview only available when sending through an Ethereal account
        //req.flash('Preview URL: %s', nodemailer.getTestMessageUrl(info));  
        //console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@blurdybloop.com>
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    });
      
//    req.app.utility.sendmail(req, res, {
//      from: req.app.config.smtp.from.name +' <'+ req.app.config.smtp.from.address +'>',
//      to: user.email,
//      subject: 'Reset your '+ req.app.config.projectName +' password',
//      textPath: 'login/forgot/email-text',
//      htmlPath: 'login/forgot/email-html',
//      locals: {
//        username: user.username,
//        resetLink: req.protocol +'://'+ req.headers.host +'/login/reset/'+ user.email +'/'+ token +'/',
//        projectName: req.app.config.projectName
//      },
//      success: function(message) {
//        workflow.emit('response');
//      },
//      error: function(err) {
//        workflow.outcome.errors.push('Error Sending: '+ err);
//        workflow.emit('response');
//      }
//    });
//  });

  workflow.emit('validate');
};
