export const CURRENCY = {
  code: 'MMK',
  symbol: 'K',
  locale: 'my-MM',
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat(CURRENCY.locale, {
    style: 'currency',
    currency: CURRENCY.code,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount || 0);
};

export const formatCurrencyShort = (amount: number): string => {
  if (amount >= 1_000_000) {
    return (amount / 1_000_000).toFixed(1) + 'M' + ' K';
  }
  if (amount >= 1_000) {
    return (amount / 1_000).toFixed(1) + 'K' + ' K';
  }
  return formatCurrency(amount);
};