# gotp(K, length = 6, timeSlice = 30, epoch = Math.floor(Date.now() / 1000))

  Generates a time-based OTP according to RFC4226.
  K is assumed to be base32. Spaces are automatically removed from K.

