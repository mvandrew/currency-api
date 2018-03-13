/**
 * ConsoleController
 *
 * @description :: Server-side logic for managing Consoles
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	index: (req, res, next) => {
	  return res.view('console/index');
  }
};

