/**
 * CurrencyNames.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    currency: {
      model: 'Currency'
    },

    language: {
      type: 'string',
      size: 2
    },

    name: {
      type: 'string',
      size: 30
    }

  }
};

