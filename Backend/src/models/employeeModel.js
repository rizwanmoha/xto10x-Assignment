const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique : true,
    trim: true
  },
  
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  
  employeeId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  
  managerId: {
    type: String,
    default: null,
    trim: true
  },
  
  count: {
    type: Number,
    default: 0
  },
  
  dateOfJoining: {
    type: Date,
    required: true
  },
  
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true
  },
  
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  versionKey: false
});

// Essential indexes
employeeSchema.index({ employeeId: 1 });
employeeSchema.index({ managerId: 1 });


// Check for cyclic relationships
employeeSchema.methods.checkCyclicRelationship = async function(newManagerId) {
  if (!newManagerId) return false;
  
  let currentManagerId = newManagerId;
  const visited = new Set([this.employeeId]);
  
  while (currentManagerId) {
    if (visited.has(currentManagerId)) {
      return true;
    }
    visited.add(currentManagerId);
    
    const manager = await this.constructor.findOne({ employeeId: currentManagerId });
    if (!manager) break;
    currentManagerId = manager.managerId;
  }
  return false;
};



const Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee;