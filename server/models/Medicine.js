import mongoose from 'mongoose';

const batchSchema = new mongoose.Schema(
  {
    batchNumber: {
      type: String,
      required: true,
      trim: true,
    },
    expiryDate: {
      type: Date,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    supplier: {
      type: String,
      trim: true,
      default: '',
    },
  },
  { _id: true }
);

const medicineSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    unit: {
      type: String,
      required: true,
      trim: true,
    },
    batches: [batchSchema],
    totalStock: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

medicineSchema.pre('save', function calculateStock(next) {
  const total = (this.batches || []).reduce((sum, batch) => sum + Number(batch.quantity || 0), 0);
  this.totalStock = total;
  next();
});

const Medicine = mongoose.model('Medicine', medicineSchema);

export default Medicine;
