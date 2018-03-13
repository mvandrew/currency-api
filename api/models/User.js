/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    login: {
      type: 'string',
      size: 30,
      primaryKey: true,
      unique: true
    },

    name: {
      type: 'string',
      size: 30
    },

    password: {
      type: 'string',
      size: 100
    }
  },

  /**
   * Check is the first admin was created.
   *
   * By default, must be created a user with credentials:
   * - login: admin
   * - password: secret
   *
   * @since 1.0.0
   */
  checkFirstAdmin: () => {
    const login = 'admin';
    const password = User.encryptPassword('secret');
    User.findOne({
      login: login
    }).exec((err, user) => {
      if (err) throw err;
      if (!user) {
        // Creating the default admin.
        //
        User.create({
          login: login,
          name: 'Admin',
          password: password
        }).exec((err, user) => {
          if (err) throw err;
        });
      }
    });
  },

  attemptLogin: (login, password, cbFunc) => {
    User.checkFirstAdmin();
    const encPassword = User.encryptPassword(password);
    User.findOne({
      login: login,
      password: encPassword
    }).exec(cbFunc);
  },

  /**
   * Encrypt the password.
   *
   * @since 1.0.0
   * @param {String} rawPassword
   * @return {PromiseLike<ArrayBuffer>}
   */
  encryptPassword: (rawPassword) => {
    const crypto = require('crypto');
    return crypto.createHash('SHA256').update(rawPassword).digest('hex');
  }

};

