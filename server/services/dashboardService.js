const getDaysUntilExpiry = (expiryDate) => {
  if (!expiryDate) {
    return null;
  }

  const expiry = new Date(expiryDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  expiry.setHours(0, 0, 0, 0);

  const diffInMs = expiry.getTime() - today.getTime();
  return Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
};

export const calculateDashboardStats = ({ medicines = [], patients = [] }) => {
  const totalPatients = patients.length;

  const totalMedicines = medicines.length;

  const expiredMedicines = medicines.reduce((count, medicine) => {
    const hasExpiredBatch = (medicine.batches || []).some((batch) => {
      const daysUntilExpiry = getDaysUntilExpiry(batch.expiryDate);
      return Number.isFinite(daysUntilExpiry) && daysUntilExpiry < 0;
    });

    return count + (hasExpiredBatch ? 1 : 0);
  }, 0);

  const nearExpiry = medicines.reduce((count, medicine) => {
    const hasNearExpiryBatch = (medicine.batches || []).some((batch) => {
      const daysUntilExpiry = getDaysUntilExpiry(batch.expiryDate);
      return Number.isFinite(daysUntilExpiry) && daysUntilExpiry >= 0 && daysUntilExpiry <= 30;
    });

    return count + (hasNearExpiryBatch ? 1 : 0);
  }, 0);

  const lowStock = medicines.reduce((count, medicine) => {
    const stock = Number(medicine.totalStock || 0);
    return count + (stock <= 10 ? 1 : 0);
  }, 0);

  return {
    totalPatients,
    totalMedicines,
    expiredMedicines,
    nearExpiry,
    lowStock,
  };
};
