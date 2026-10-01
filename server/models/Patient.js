import mongoose from 'mongoose';

const patientSchema = new mongoose.Schema(
  {
    patientName: {
      type: String,
      required: true,
      trim: true,
    },
    patientType: {
      type: String,
      enum: ['employee', 'contract', 'trainee'],
      default: 'employee',
    },
    employeeCode: {
      type: String,
      trim: true,
      default: '',
    },
    department: {
      type: String,
      trim: true,
      default: '',
    },
    age: {
      type: Number,
      min: 0,
      default: null,
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other', ''],
      default: '',
    },
  },
  { timestamps: true }
);

patientSchema.index({ employeeCode: 1 });
patientSchema.index({ department: 1 });

const Patient = mongoose.model('Patient', patientSchema);

export default Patient;
