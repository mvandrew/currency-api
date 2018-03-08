const dateFormat = require('dateformat');

/**
 * CurrencyController
 *
 * @description :: Server-side logic for managing currencies
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  index: (req, res, next) => {
    Currency.find().then(
      (currencyList) => {

        // Prepare the result records
        //
        let rows = [];
        let currencyInfo = null;
        for (let val of currencyList) {
          let rateDate = new Date(val.rateDate);
          currencyInfo = {
            charCode: val.charCode,
            nameRu: val.nameRu,
            nameEn:val.nameEn,
            cbrId: val.vendorId,
            numCode: val.numCode,
            nominal: val.nominal,
            rate: val.rate,
            rateDate: dateFormat(rateDate, 'dd.mm.yyyy')
          };

          rows.push(currencyInfo);
        }

        return res.json(rows);
      },
      (err) => {
        return next(err);
      }
    );
  }
};

