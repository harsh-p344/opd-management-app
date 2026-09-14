import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from './config/db.js';
import Medicine from './models/Medicine.js';
import Patient from './models/Patient.js';
import User from './models/User.js';

dotenv.config();

const daysFromNow = (days) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
};

const medicines = [
  ['Paracetamol 500mg', 'Paracetamol', 'Painkiller', 'tablet', 20, [80, 60, 40]],
  ['Amoxicillin 500mg', 'Amoxicillin', 'Antibiotic', 'capsule', 30, [12, 18, 20]],
  ['Cetirizine 10mg', 'Cetirizine', 'Antihistamine', 'tablet', 15, [5, 10, 8]],
  ['Omeprazole 20mg', 'Omeprazole', 'Gastro', 'capsule', 25, [0, 0, 0]],
  ['Vitamin C 500mg', 'Ascorbic acid', 'Vitamin', 'tablet', 10, [55, 45, 30]],
  ['ORS Sachet', 'Oral rehydration salts', 'Other', 'sachet', 40, [25, 30, 35]],
];

const makeBatches = (medicineName, quantities, expiryDays) => quantities.map((quantity, index) => ({
  batchNumber: `${medicineName.slice(0, 3).toUpperCase()}-${String(index + 1).padStart(3, '0')}`,
  quantity,
  purchasePrice: 2.5 + index,
  sellingPrice: 4 + index,
  purchaseDate: daysFromNow(-(90 - index * 15)),
  supplierName: ['MedSupply Ltd', 'CareSource Pharma', 'HealthFirst Distributors'][index],
  expiryDate: daysFromNow(expiryDays[index]),
}));

const seed = async () => {
  await connectDB();

  const demoUser = await User.findOne({ username: 'demo' });
  if (demoUser) {
    demoUser.password = 'demo123';
    demoUser.role = 'admin';
    await demoUser.save();
  } else {
    await User.create({ username: 'demo', password: 'demo123', role: 'admin' });
  }

  for (const [name, genericName, category, unit, reorderLevel, quantities] of medicines) {
    const expiryDays = name === 'Amoxicillin 500mg'
      ? [-10, 15, 90]
      : name === 'Cetirizine 10mg'
        ? [10, 45, 120]
        : [180, 240, 365];

    await Medicine.findOneAndUpdate(
      { name },
      {
        name,
        genericName,
        category,
        unit,
        reorderLevel,
        batches: makeBatches(name, quantities, expiryDays),
      },
      { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true }
    );
  }

  const patientData = [
    ['Aarav Sharma', 28, 'Male', '9876500001', ['Fever', 'Body ache'], 'Viral fever'],
    ['Maya Patel', 34, 'Female', '9876500002', ['Cough', 'Sore throat'], 'Upper respiratory infection'],
    ['Rohan Mehta', 42, 'Male', '9876500003', ['Headache'], 'Tension headache'],
    ['Sara Khan', 23, 'Female', '9876500004', ['Stomach pain', 'Nausea'], 'Gastritis'],
    ['Ishaan Verma', 7, 'Male', '9876500005', ['Fever'], 'Common cold'],
  ];

  await Patient.bulkWrite(patientData.map(([name, age, gender, mobile, symptoms, diagnosis], index) => ({
    updateOne: {
      filter: { 'patientInfo.mobile': mobile },
      update: {
        $set: {
          patientInfo: { name, age, gender, mobile },
          clinicalDetails: { symptoms, diagnosis },
          medicinesGiven: [{ name: 'Paracetamol 500mg', quantity: index + 1, dosage: 'After meals' }],
          entryDate: daysFromNow(-index),
        },
      },
      upsert: true,
    },
  })));

  console.log('Demo data seeded successfully.');
  console.log('Login: demo / demo123');
};

seed()
  .catch((error) => {
    console.error('Demo seed failed:', error.message);
    throw error;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });