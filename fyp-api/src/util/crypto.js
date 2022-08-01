const crypto = require('crypto');

class Crypto {
  constructor() {
    // 'FTa9zANrvL#XyPwG37by?D8396Q5P5VR'
    // this.ENCRYPTION_KEY = crypto.createHash('md5').update(process.env.SEC_SECRET, 'utf8').digest('hex'); // Must be 256 bits (32 characters)
    this.IV_LENGTH = 16; // For AES, this is always 16
  }

  encrypt(text) {
    const iv = crypto.randomBytes(this.IV_LENGTH);
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(this.ENCRYPTION_KEY), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);

    return `${iv.toString('base64')}.${encrypted.toString('base64')}`;
  }

  decrypt(text) {
    try {
      const textParts = text.split('.');
      const iv = Buffer.from(textParts.shift(), 'base64');
      const encryptedText = Buffer.from(textParts.join('.'), 'base64');
      const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(this.ENCRYPTION_KEY), iv);
      let decrypted = decipher.update(encryptedText);
      decrypted = Buffer.concat([decrypted, decipher.final()]);

      return decrypted.toString();
    } catch (error) {
      return text;
    }
  }

  static rsa_encrypt(text) {
    try {
      const buffer = Buffer.from(text);
      const encrypted = crypto.publicEncrypt(process.env.RSA_PUB, buffer)

      return encrypted.toString("base64");
    } catch (e) {
      return null;
    }
  }

  static rsa_decrypt(text) {
    try {
      const buffer = Buffer.from(text, "base64");
      const decrypted = crypto.privateDecrypt(process.env.RSA_PVT, buffer)

      return decrypted.toString("utf8");
    } catch (e) {
      return null;
    }
  }

  static sha256(text) {
    return crypto.createHash('sha256').update(text).digest('hex');
  }

  static sha1(text) {
    return crypto.createHash('sha1').update(text).digest('hex');
  }

  static md5(text) {
    return crypto.createHash('md5').update(text).digest('hex');
  }
}

module.exports = Crypto;
