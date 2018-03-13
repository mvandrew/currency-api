/**
 * AuthController
 *
 * @description :: Server-side logic for managing Auths
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  login: (req, res) => {

    return res.userLogin({
      login: req.param('login'),
      password: req.param('password'),
      successRedirect: '/user',
      invalidRedirect: '/'
    });

  }

};

