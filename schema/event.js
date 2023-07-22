const mongoose = require("mongoose");

const gradingFieldsSchema = new mongoose.Schema({
  field1: { type: Number, required: true },
  field2: { type: String, required: true },
  // Add more grading fields as needed
});

const gradingDetailSchema = new mongoose.Schema({
  judge: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: Date, required: true },
  gradingFields: gradingFieldsSchema,
});

// Define a subdocument schema for the fields required from members participating in the competition
const participantFieldsSchema = new mongoose.Schema({
  birdType: { type: String },
  birdName: { type: String },
  birdAge: { type: String },
  birdColor: { type: String },
  birdQuantity: { type: String },

  // Add more fields as needed
});

const eventSchema = mongoose.Schema({
  startDate: {
    type: Date,
  },
  endDate: {
    type: Date,
  },
  titleMatch: {
    type: String,
  },
  description: {
    type: String,
  },
  participants: [
    {
      member: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      fields: participantFieldsSchema, // Reference the subdocument schema for participant fields
      gradingDetails: [gradingDetailSchema],
    },
  ],
  status: {
    type: String, // CREATED || STARTED || WAITING || DONE
  },
});

const event = mongoose.model("Event", eventSchema);
module.exports = event;
