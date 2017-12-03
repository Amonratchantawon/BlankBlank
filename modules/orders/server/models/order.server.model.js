'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Order Schema
 */
var OrderSchema = new Schema({
  table: {
    type: String,

  },
  items: {
    type: [{
      name: {
        type: String
      },
      image: {
        type: String
      },
      size: {
        type: String
      },
      price: {
        type: Number
      },
      qty: {
        type: Number
      },
      category: {
        type: String
      },
      amount: {
        type: Number
      }
    }]
  },
  amount: {
    type: Number
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Order', OrderSchema);
