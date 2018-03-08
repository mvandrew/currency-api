const Iconv = require('iconv').Iconv;
const xml2js = require('xml2js');
const request = require('request');

function CurrencyImportService() {
  const conf = sails.config;
  this.urlRu = conf.currency.sourceUrl.ru;
  this.urlEn = conf.currency.sourceUrl.en;
}


CurrencyImportService.prototype.getXMLData = function (lang) {
  const targetUrl = lang === 'ru' ? this.urlRu : this.urlEn;
  const converter = new Iconv('cp1251', 'utf-8');
  const parser = xml2js.Parser();

  return new Promise((resolve, reject) => {

    request({
      uri: targetUrl,
      method: 'GET',
      encoding: 'binary'
    }, (error, response, body) => {
      if (error) { reject(error); }
      else {

        // Preparing and encoding the XML source.
        //
        body = new Buffer(body, 'binary');
        body = converter.convert(body).toString();

        // Parsing of XML data.
        //
        parser.parseString(body, (err, result) => {
          // Check the parsing error.
          if (err) {
            reject(err);
          }
          else {
            resolve(result);
          }
        });

      }
    }); // request

  }); // Promise
}; // getXMLData


CurrencyImportService.prototype.updateCurrency = function (currencyInfo) {

  return new Promise((resolve, reject) => {
    Currency.findOne({charCode: currencyInfo.CharCode}).then(
      (row) => {
        if (row) {

          // Updating the current row
          //
          if (row.nominal !== currencyInfo.Nominal || row.rate !== currencyInfo.Value) {
            Currency.update({charCode: currencyInfo.CharCode}, {
              nominal: currencyInfo.Nominal,
              rate: currencyInfo.Value,
              rateDate: new Date()
            }).then(
              (row) => {
                resolve(true);
              },
              (err) => {
                reject(err);
              }
            );
          } else {
            // Nothing to update
            resolve(false);
          }
        } else {

          // Adding the new row
          //
          Currency.create({
            charCode: currencyInfo.CharCode,
            vendorId: currencyInfo.Id,
            numCode: currencyInfo.NumCode,
            nominal: currencyInfo.Nominal,
            rate: currencyInfo.Value,
            rateDate: new Date(),
            nameRu: currencyInfo.Name,
            nameEn: currencyInfo.NameEn
          }).then(
            (row) => {
              resolve(true);
            },
            (err) => {
              reject(err);
            }
          );
        }
      },
      (err) => {
        reject(err);
      }
    );
  });

}; // updateCurrency


CurrencyImportService.prototype.importRates = function () {

  return new Promise((resolve, reject) => {

    // Downloading CBR XML files
    //
    let cbrData = [];
    cbrData.push(this.getXMLData('ru'));
    cbrData.push(this.getXMLData('en'));


    // Processing XML files
    //
    Promise.all(cbrData).then(
      (xmlCollection) => {
        const xmlData = xmlCollection[0];
        const xmlDataEn = xmlCollection[1];

        // The array of exchange rates.
        //
        let arRates = xmlData.ValCurs.Valute;
        let arRatesEn = xmlDataEn.ValCurs.Valute;


        // Bypassing exchange rates.
        //
        let updates = [];
        for (let val of arRates) {
          // Get the currency properties.
          //
          let sId = val.$.ID;
          let sNumCode = val.NumCode[0];
          let sCharCode = val.CharCode[0];
          let sName = val.Name[0];

          let sNameEn = val.Name[0];
          for (let valEn of arRatesEn) {
            if (valEn.CharCode[0] === sCharCode) { sNameEn = valEn.Name[0]; }
          }

          let fNominal = parseFloat(val.Nominal[0].toString().replace(',', '.'));
          if (fNominal <= 0) {
            fNominal = 1;
          }

          let fValue = parseFloat(val.Value[0].toString().replace(',', '.'));
          if (fValue <= 0) {
            fValue = 1;
          }


          // Create currency info structure and update records
          //
          let currencyInfo = {
            Id: sId,
            NumCode: sNumCode,
            CharCode: sCharCode,
            Name: sName,
            NameEn: sNameEn,
            Nominal: fNominal,
            Value: fValue
          };

          updates.push(this.updateCurrency(currencyInfo));
        }

        Promise.all(updates).then(
          (resultList) => { resolve(resultList); },
          (err) => { reject(err); }
        );
      },
      (err) => { reject(err); }
    );
  });

}; // importRates


/**
 * @deprecated
 */
CurrencyImportService.prototype.importRatesFirst = function () {

  let converter = new Iconv('cp1251', 'utf-8');
  let parser = xml2js.Parser();

  request({
    uri: this.urlRu,
    method: 'GET',
    encoding: 'binary'
  }, (error, response, body) => {

    // Preparing and encoding the XML source.
    //
    body = new Buffer(body, 'binary');
    body = converter.convert(body).toString();

    // Parsing of XML data.
    //
    parser.parseString(body, (err, result) => {
      // Check the parsing error.
      if (err) { throw err; }

      // Get the exchange rates date.
      let strDate = result.ValCurs.$.Date;

      // The array of exchange rates.
      let arRates = result.ValCurs.Valute;

      // Bypassing exchange rates.
      for (let val of arRates) {
        // Get the currency properties.
        //
        let sId = val.$.ID;
        let sNumCode = val.NumCode[0];
        let sCharCode = val.CharCode[0];
        let sName = val.Name[0];

        let fNominal = parseFloat(val.Nominal[0].toString().replace(',', '.'));
        if (fNominal <= 0) { fNominal = 1; }

        let fValue = parseFloat(val.Value[0].toString().replace(',', '.'));
        if (fValue <= 0) { fValue = 1; }


        // Updating the data
        //
        Currency.findOrCreate({charCode: sCharCode},
          {
            charCode: sCharCode,
            vendorId: sId,
            numCode: sNumCode,
            nominal: fNominal,
            rate: fValue
          }).exec((err, currencyRecord) => {
            if (err) { throw err; }
            Currency.update({charCode: currencyRecord.charCode}, {nominal: fNominal, rate: fValue}).exec((err, currencyRecord) => {
              if (err) { throw err; }
            });
        });

        console.dir(val);
      }

      //console.dir(result);
    });

  });

};


module.exports = CurrencyImportService;
