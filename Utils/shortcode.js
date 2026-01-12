function generateShortcode(length = 6) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let shortUrl = "";
  for (let i = 0; i < length; i++) {
    shortUrl += characters.charAt(
      Math.floor(Math.random() * characters.length)
    );
  }
  return shortUrl;
}
module.exports = generateShortcode;
