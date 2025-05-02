export const getCurrency = (amount: number) => {
  return `EGP ${amount.toFixed(2)}`;
};

// export const getCurrency = (amount: number) =>
//   amount.toLocaleString("de-DE", {
//     style: "currency",
//     currency: "EGP",
//     unitDisplay: "short",
//     minimumSignificantDigits: 1,
//   });
