const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    employeeId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    managerId: {
      type: String,
      default: null,
      trim: true,
    },

    count: {
      type: Number,
      default: 0,
    },

    dateOfJoining: {
      type: Date,
      required: true,
    },

    createdAt: {
      type: Date,
      default: Date.now,
      immutable: true,
    },

    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Used Indexing for better performance
employeeSchema.index({ employeeId: 1 });
employeeSchema.index({ managerId: 1 });



const Employee = mongoose.model("Employee", employeeSchema);

module.exports = Employee;
