exports.getRates = (req, res) => {
  const rates = {
    USD_EURO: 0.91,
    USD_GBP: 0.78,
    USD_KES: 148.25,
    USD_RWF: 1400
  };
  res.json(rates);
};
