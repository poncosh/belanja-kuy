module.exports = function (num) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(num);
};