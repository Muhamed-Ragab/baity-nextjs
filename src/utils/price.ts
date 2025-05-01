export const getCurrency = (amount: number) => {
  const formattedNumber = new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EGP',
    unitDisplay: 'short',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);

  return formattedNumber;
};

// export const getCurrency = (amount: number) =>
//   amount.toLocaleString("de-DE", {
//     style: "currency",
//     currency: "EGP",
//     unitDisplay: "short",
//     minimumSignificantDigits: 1,
//   });
