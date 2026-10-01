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
      default: 0,
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other', ''],
      default: '',
    },
  },
  { timestamps: true }
);

const Patient = mongoose.model('Patient', patientSchema);

export default Patient;
