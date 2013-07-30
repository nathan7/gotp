// based on http://blog.tinisles.com/2011/10/google-authenticator-one-time-password-algorithm-in-javascript/
var crypto = require('crypto')

function padLeft(str, length, padding) {
  var diff = length - str.length
  if (diff < 0) return str
  for (var i = 0; i < diff; i++)
    str = padding + str
  return str
}

function base32tohex(base32) {
  var base32chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'
    , bits = ''
    , hex = ''
    , i

  for (i = 0; i < base32.length; i++)
      bits += padLeft(base32chars.indexOf(base32.charAt(i).toUpperCase()).toString(2), 5, '0')

  // leftpad bits with 0 until length is a multiple of 4
  while (bits.length % 4 !== 0)
      bits = '0' + bits

  for (i = bits.length - 4; i >= 0; i = i - 4)
    hex = parseInt(bits.slice(i, i + 4), 2).toString(16) + hex
  return hex
}

module.exports = function(K, length, timeSlice, epoch) {
  if (!length)
    length = 6
  if (!epoch)
    epoch = Date.now() / 1000 | 0
  if (!timeSlice)
    timeSlice = 30
  var k = K.replace(/ /g, '')
    , time = padLeft((epoch / timeSlice | 0).toString(16), 16, '0')
    , hmac = crypto
        .createHmac('sha1', new Buffer(base32tohex(k), 'hex'))
        .update(new Buffer(time, 'hex'))
        .digest('hex')
    , offset = parseInt(hmac.substring(hmac.length - 1), 16)
    , otp = (parseInt(hmac.slice(offset * 2, offset * 2 + 8), 16) & 0x7fffffff)
        .toString().slice(-length)
  return otp
}
