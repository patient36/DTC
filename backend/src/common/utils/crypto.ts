import * as crypto from 'crypto';

const algorithm = 'aes-256-cbc';

const deriveKeyAndIV = (userId: string) => {
  const hash = crypto.createHash('sha512').update(userId).digest();
  const key = Buffer.from(hash.subarray(0, 32));
  const iv = Buffer.from(hash.subarray(32, 48));
  return { key, iv };
};
export const encrypt = (text: string, userId: string): string => {
  try {
    if (!text || !userId) throw new Error("Missing text or userId");
    const { key, iv } = deriveKeyAndIV(userId);
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(text, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    return encrypted;
  } catch (error) {
    console.error("Encryption failed:", error);
    throw error;
  }
};

export const decrypt = (encrypted: string, userId: string): string => {
  try {
    if (!encrypted || !userId) throw new Error("Missing encrypted data or userId");
    const { key, iv } = deriveKeyAndIV(userId);
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(encrypted, 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (error) {
    console.error("Decryption failed:", error);
    throw error;
  }
};