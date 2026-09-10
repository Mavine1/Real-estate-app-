export const formatPrice = (value: number | string | null | undefined) => {
  const amount = Number(value ?? 0);

  return `KSh ${new Intl.NumberFormat("en-KE", {
    maximumFractionDigits: 0,
  }).format(Number.isFinite(amount) ? amount : 0)}`;
};

export const nairobiAddress = "Nairobi, Kenya";
