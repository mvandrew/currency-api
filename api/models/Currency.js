/**
 * Currency.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    vendorId: {
      type: "string",
      size: 30
    },

    numCode: {
      type: "string",
      required: true,
      size: 3
    },

    charCode: {
      type: "string",
      required: true,
      size: 3,
      primaryKey: true
    },

    nominal: {
      type: "float",
      defaultsTo: 1,
      required: true
    },

    rate: {
      type: "float",
      defaultsTo: 1,
      required: true
    }
  }

};

