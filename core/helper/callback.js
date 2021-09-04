'use strict'
module.exports = (res, result, status = 200) => res.status(status).json({
  msgCode: status >= 400 ? 'Error' : 'OK',
  result
})
