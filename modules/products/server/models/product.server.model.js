'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Product Schema
 */
var ProductSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Product name',
    trim: true
  },
  seller:{
    type:String
  },
  image: {
    type: String
  },
  size: {
    type: [{
      name: {
        type: String
      },
      price: {
        type: Number
      }
    }]
  },
  category: {
    type: String
  },
  detail:{
    type:String
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

mongoose.model('Product', ProductSchema);
