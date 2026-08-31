import mongoose from 'mongoose';

const medicineGivenSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    quantity: {
      type: Number,
      default: 0,
      min: 0,
    },
    dosage: {
      type: String,
      trim: true,
      default: '',
    },
  },
  { _id: false }
);

const patientSchema = new mongoose.Schema(
  {
    patientInfo: {
      name: {
        type: String,
        required: true,
        trim: true,
      },
      age: {
        type: Number,
        default: 0,
      },
      gender: {
        type: String,
        trim: true,
        default: '',
      },
      mobile: {
        type: String,
        trim: true,
        default: '',
      },
    },
    clinicalDetails: {
      symptoms: {
        type: [String],
        default: [],
      },
      diagnosis: {
        type: String,
        trim: true,
        default: '',
      },
    },
    medicinesGiven: [medicineGivenSchema],
    entryDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Patient = mongoose.model('Patient', patientSchema);

export default Patient;
