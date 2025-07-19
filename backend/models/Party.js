const mongoose = require('mongoose');

const partySchema = new mongoose.Schema({
  partyId: { 
    type: String, 
    required: true, 
    unique: true,
    index: true
  },
  name: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: 100
  },
  email: { 
    type: String, 
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  mobile: { 
    type: String, 
    required: true,
    unique: true,
    trim: true,
    match: [/^[0-9]{10,15}$/, 'Please enter a valid mobile number']
  },
  dob: { 
    type: Date,
    validate: {
      validator: function(value) {
        return !value || value <= new Date();
      },
      message: 'Date of birth cannot be in the future'
    }
  },
  language: { 
    type: String, 
    default: 'en',
    enum: ['en', 'si', 'ta'], // English, Sinhala, Tamil
    lowercase: true
  },
  type: { 
    type: String, 
    default: 'individual',
    enum: ['individual', 'business']
  },
  status: {
    type: String,
    default: 'active',
    enum: ['active', 'inactive', 'suspended']
  },
  consentHubSynced: {
    type: Boolean,
    default: false
  },
  lastSyncAt: {
    type: Date
  }
}, { 
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      delete ret.__v;
      return ret;
    }
  }
});

// Index for better query performance
partySchema.index({ email: 1 });
partySchema.index({ mobile: 1 });
partySchema.index({ createdAt: -1 });

// Pre-save middleware to ensure data consistency
partySchema.pre('save', function(next) {
  if (this.email) {
    this.email = this.email.toLowerCase().trim();
  }
  if (this.mobile) {
    this.mobile = this.mobile.replace(/\s+/g, '');
  }
  next();
});

// Instance method to get age from DOB
partySchema.methods.getAge = function() {
  if (!this.dob) return null;
  
  const today = new Date();
  const birthDate = new Date(this.dob);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
};

// Static method to find by email or mobile
partySchema.statics.findByEmailOrMobile = function(email, mobile) {
  return this.findOne({
    $or: [
      { email: email ? email.toLowerCase().trim() : null },
      { mobile: mobile ? mobile.replace(/\s+/g, '') : null }
    ]
  });
};

module.exports = mongoose.model('Party', partySchema);
