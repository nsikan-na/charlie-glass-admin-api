const crypto = require("crypto");

export function encrypt(data: any) {
  const cipher = crypto.createCipher(
    "aes-256-cbc",
    process.env.CGI_ADMIN_JWT_SECRET
  );
  let encryptedData = cipher.update(data, "utf-8", "hex");
  encryptedData += cipher.final("hex");
  return encryptedData;
}
