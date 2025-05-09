export const getCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-EG', {
    style: 'currency',
    currency: 'EGP',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

// export const getCurrency = (amount: number) =>
//   amount.toLocaleString("de-DE", {
//     style: "currency",
//     currency: "EGP",
//     unitDisplay: "short",
//     minimumSignificantDigits: 1,
//   });
