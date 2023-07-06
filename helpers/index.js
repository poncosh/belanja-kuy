const getIdr = (value) => {
  let idr = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
});

  return idr.format(value)
}

module.exports = { getIdr }