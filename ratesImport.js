let Sails = require('sails').constructor;
let sailsApp = new Sails();

sailsApp.load({
  log: {
    level: 'error'
  }
}, function (err) {
  if (err) {
    console.log('Error occurred loading Sails app:', err);
    return;
  }

  console.log('Sails app loaded successfully!');

  let helper = new CurrencyImportService();
  helper.importRates().then(
    (resultList) => {
      // Import summary
      //
      let updatedRows = 0;
      for (let val of resultList) {
        if (val === true) {
          updatedRows++;
        }
      }
      console.log('Updated %d rows.', updatedRows);


      // Shutdown the application
      //
      sailsApp.lower(function (err) {
        if (err) {
          console.log('Could not lower Sails app.  Details:',err);
          return;
        }
        console.log('Successfully lowered Sails app.');
      });
    },
    (err) => { throw err; }
  );

});
