'use strict'
module.exports = (res, result, status = 200) => res.status(status).json({
  msgCode: 'success',
  result
})
