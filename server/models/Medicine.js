import mongoose from 'mongoose';

const batchSchema = new mongoose.Schema(
  {
    batchNumber: {
      type: String,
      required: true,
      trim: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    purchasePrice: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    sellingPrice: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    purchaseDate: {
      type: Date,
      required: true,
    },
    supplierName: {
      type: String,
      required: true,
      trim: true,
    },
    expiryDate: {
      type: Date,
      required: true,
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
    genericName: {
      type: String,
      trim: true,
      default: '',
    },
    category: {
      type: String,
      trim: true,
      default: '',
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
    reorderLevel: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

const calculateTotalStock = (batches = []) =>
  batches.reduce((sum, batch) => sum + Number(batch.quantity || 0), 0);

medicineSchema.pre('save', function calculateStock() {
  this.totalStock = calculateTotalStock(this.batches);
});

medicineSchema.pre(['findOneAndUpdate', 'updateOne'], function calculateStock() {
  const update = this.getUpdate();

  if (update && update.$set && Array.isArray(update.$set.batches)) {
    update.$set.totalStock = calculateTotalStock(update.$set.batches);
  } else if (update && Array.isArray(update.batches)) {
    update.totalStock = calculateTotalStock(update.batches);
  }

});

const Medicine = mongoose.model('Medicine', medicineSchema);

export default Medicine;
