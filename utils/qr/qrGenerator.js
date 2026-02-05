const QRCode = require("qrcode");
const generateQRCode = async (data) => {
  try {
    const qrData = typeof data === "object" ? JSON.stringify(data) : data;
    const qrCode = await QRCode.toDataURL(qrData);
    return qrCode;
  } catch (error) {
    throw new Error("Failed to generate QR Code.");
  }
};

module.exports = generateQRCode;
