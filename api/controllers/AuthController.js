/**
 * @module AuthController
 * @description Server-side logic for managing Authentication
 * @since 1.0.0
 * @author [Andrey Mishchenko]{@link http://www.msav.ru/}
 */

module.exports = {

  /**
   * Init user login
   *
   * @see api/responses/userLogin.js
   * @param req
   * @param res
   * @return {*}
   */
  login: (req, res) => {
    return res.userLogin({
      login: req.param('login'),
      password: req.param('password'),
      successRedirect: '/console',
      invalidRedirect: '/'
    });
  },

  logout: (req, res) => {

  }

};

