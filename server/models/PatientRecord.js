import mongoose from 'mongoose';

const medicineUsedSchema = new mongoose.Schema(
  {
    medicineId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Medicine',
      required: true,
    },
    medicineName: {
      type: String,
      required: true,
      trim: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    dosage: {
      type: String,
      trim: true,
      default: '',
    },
  },
  { _id: false }
);

const patientRecordSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: true,
      index: true,
    },
    complaint: {
      type: String,
      required: true,
      trim: true,
    },
    caseType: {
      type: String,
      trim: true,
      default: '',
    },
    severity: {
      type: String,
      trim: true,
      default: '',
    },
    caseSummary: {
      type: String,
      trim: true,
      default: '',
    },
    vitals: {
      type: String,
      trim: true,
      default: '',
    },
    treatmentSummary: {
      type: String,
      trim: true,
      default: '',
    },
    doctor: {
      type: String,
      trim: true,
      default: '',
    },
    followUpSchedule: {
      type: String,
      trim: true,
      default: '',
    },
    remarks: {
      type: String,
      trim: true,
      default: '',
    },
    medicines: [medicineUsedSchema],
  },
  { timestamps: true }
);

const PatientRecord = mongoose.model('PatientRecord', patientRecordSchema);

export default PatientRecord;
