const QRCode = require("qrcode");
const uploadToCloudinary = require("./cloudinary");

const generateAndUploadQRCode = async (data) => {
  try {
    const qrData = typeof data === "object" ? JSON.stringify(data) : data;

    const buffer = await QRCode.toBuffer(qrData);

    const result = await uploadToCloudinary(buffer, "qr_codes");

    return result.secure_url;
  } catch (err) {
    console.error("QR Generation/Upload Error:", err);
    throw err;
  }
};

module.exports = generateAndUploadQRCode;
