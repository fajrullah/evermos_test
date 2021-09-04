'user strict'

const clientErrorHandler = (err, req, res, next) => {
  console.error(err)
  if (err) {
    res.status(400).json({ msgCode: 'Error' })
  } else {
    next()
  }
}

module.exports = {
  clientErrorHandler
}
