const { bufferToBase64 } = require("./qr_helper")

function buildReceiptData({
  registrationId,
  name,
  email,
  phone,
  college,
  student_year,
  food,
  events,
  foodToken,
  qrBuffer
}) {
  return {
    receipt_id: `COG26-${registrationId}`,

    participant: {
      name,
      email,
      phone,
      college,
      year: student_year
    },

    events,

    food: {
      type: food,
      token: foodToken,
      qr_base64: `data:image/png;base64,${bufferToBase64(qrBuffer)}`, // For pdf in Frontend 
      qr_buffer: qrBuffer // For mail
    },

    generated_at: new Date().toISOString()
  };
}

module.exports = {buildReceiptData}