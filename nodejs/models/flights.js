const Joi = require("@hapi/joi");
const mongoose = require("mongoose");

const flightSchema = new mongoose.Schema({
  flight_number: {
    type: Number,
    requires: true,
    unique: true,
    min: 0
  },
  destination: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 255,
  },
  takeoff_date: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 255,
  },
});

const Flight = mongoose.model("Flights", flightSchema);

function validate(flight, all=false) {
    let schema;
    if (all) {
      schema = Joi.object({
        flight_number: Joi.number().min(0).required(),
        destination: Joi.string().min(2).max(255).required(),
        takeoff_date: Joi.date().min("now").iso().required()
      });
    }
    else {
      schema = Joi.object({
        flight_number: Joi.number().min(0),
        destination: Joi.string().min(2).max(255),
        takeoff_date: Joi.date().iso(),
      });
    }
    const result = schema.validate(flight);
    const error = result.error && result.error.details[0];
    if (error) return error.message;
    else return null;
}


exports.Flight = Flight;
exports.validate = validate;
