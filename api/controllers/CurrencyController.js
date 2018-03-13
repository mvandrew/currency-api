const dateFormat = require('dateformat');

/**
 * @module CurrencyController
 * @description Server-side logic for managing currencies
 * @since 1.0.0
 * @author Andrey Mishchenko
 */
module.exports = {
  /**
   * Cur List
   *
   * @param req
   * @param res
   * @param next
   */
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

/**
 * @api {get} /currency Returns the currency list with exchange rates.
 * @apiName getCurrencyRates
 * @apiGroup Currency
 * @apiVersion 1.0.0
 * @apiDescription Returns the currency list with exchange rates. Each exchange rate is accompanied by a value update date.
 */
