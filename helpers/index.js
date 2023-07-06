const middleware = (req, res, next) => {
  if (!req.session.userId) {
    const errorMsg = 'Please login first'
    res.redirect(`/login?errors=${errorMsg}`)
  } else {
    next()
  }
}

const isAdmin = (req, res, next) => {
  if (req.session.user.role !== 'Admin') {
    const errorMsg = 'Anda bukan admin! Anda tidak boleh membuat store'
    res.redirect(`/store?errors=${errorMsg}`)
  } else {
    next()
  }
}

module.exports = { middleware, isAdmin }