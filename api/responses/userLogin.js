
module.exports = function userLogin(inputs) {

  // Test the inputs
  //
  inputs = inputs || {};

  // Get `req` & `res` access
  //
  const req = this.req;
  const res = this.res;

  // Lookup the user
  //
  const login = inputs.login;
  const password = inputs.password;
  User.attemptLogin(login, password, (err, user) => {
    if (err) return res.negotiate(err);

    if (!user) {

      // If this is not an HTML-wanting browser, e.g. AJAX/sockets/cURL/etc.,
      // send a 200 response letting the user agent know the login was successful.
      // (also do this if no `invalidRedirect` was provided)
      if (req.wantsJSON || !inputs.invalidRedirect) {
        return res.badRequest('Invalid username/password combination.');
      }
      // Otherwise if this is an HTML-wanting browser, redirect to /login.
      return res.redirect(inputs.invalidRedirect);

    } else {

      // "Remember" the user in the session
      // Subsequent requests from this user agent will have `req.session.me` set.
      req.session.authenticated = user.login;

      // If this is not an HTML-wanting browser, e.g. AJAX/sockets/cURL/etc.,
      // send a 200 response letting the user agent know the login was successful.
      // (also do this if no `successRedirect` was provided)
      if (req.wantsJSON || !inputs.successRedirect) {
        return res.ok();
      }

      // Otherwise if this is an HTML-wanting browser, redirect to /.
      return res.redirect(inputs.successRedirect);

    }

  });

};
