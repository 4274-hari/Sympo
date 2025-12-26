const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

async function sendWelcomeMail(name, email, events, qrBuffer, foodType) {

  const eventsHtml = events.map(ev => {
    let extra = "";

    if (ev.role === "lead") {
      extra = `
        <p><b>Team Name:</b> ${ev.team_name}</p>
        <p><b>Team Code:</b> ${ev.team_code}</p>
      `;
    } else if (ev.role === "member") {
      extra = `<p><b>Team Name:</b> ${ev.team_name}</p>`;
    }

    return `
      <div class="event-card">
        <h4>${ev.event_name}</h4>
        <p><b>Role:</b> ${ev.role}</p>
        ${extra}
      </div>
    `;
  }).join("");

  await transporter.sendMail({
    from: `"COGNEBULA 26 🚀" <${process.env.MAIL_USER}>`,
    to: email,
    subject: "🎉 You’re Registered for COGNEBULA 26!",
    html: `
<!DOCTYPE html>
<html>
<head>
<style>
  body {
    margin: 0;
    background: #0b0b14;
    font-family: 'Segoe UI', Arial, sans-serif;
  }

  .wrapper {
    padding: 30px 15px;
    animation: fadeIn 1.2s ease-in-out;
  }

  .card {
    max-width: 650px;
    margin: auto;
    background: linear-gradient(145deg, #1a1a2e, #0f3460);
    border-radius: 18px;
    padding: 30px;
    color: #ffffff;
    box-shadow: 0 0 40px rgba(138,43,226,0.35);
  }

  .hero {
    text-align: center;
    animation: glow 2.5s infinite alternate;
  }

  .hero h1 {
    font-size: 32px;
    margin-bottom: 5px;
    color: #d6b4ff;
  }

  .hero p {
    font-size: 15px;
    color: #cfcfe6;
  }

  .badge {
    display: inline-block;
    margin-top: 10px;
    padding: 6px 14px;
    background: linear-gradient(90deg, #8e2de2, #4a00e0);
    border-radius: 20px;
    font-size: 13px;
    letter-spacing: 1px;
  }

  h3 {
    margin-top: 30px;
    color: #f0e6ff;
  }

  .event-card {
    background: rgba(255,255,255,0.07);
    border-radius: 12px;
    padding: 14px;
    margin-bottom: 12px;
    animation: slideUp 0.6s ease forwards;
  }

  .event-card h4 {
    margin: 0 0 6px;
    color: #e0c3ff;
  }

  .food {
    text-align: center;
    margin-top: 30px;
    padding: 20px;
    background: rgba(0,0,0,0.25);
    border-radius: 14px;
  }

  .food img {
    margin-top: 15px;
    border-radius: 12px;
    border: 3px solid #8e2de2;
  }

  .footer {
    margin-top: 30px;
    font-size: 13px;
    color: #b8b8d4;
    text-align: center;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes slideUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes glow {
    from { text-shadow: 0 0 10px #8e2de2; }
    to { text-shadow: 0 0 25px #c77dff; }
  }
</style>
</head>

<body>
  <div class="wrapper">
    <div class="card">

      <div class="hero">
        <h1>COGNEBULA 26</h1>
        <p>Where Innovation Meets Intelligence 🌌</p>
        <div class="badge">REGISTRATION CONFIRMED</div>
      </div>

      <p style="margin-top:25px;">
        Hey <b>${name}</b>,<br/><br/>
        You’re officially part of <b>COGNEBULA 26</b> 🚀  
        Get ready for an electrifying symposium experience!
      </p>

      <h3>📌 Your Registered Events</h3>
      ${eventsHtml}

      <div class="food">
        <h3>🍽️ Food Pass – ${foodType.toUpperCase()}</h3>
        <p>Show this QR code at the food counter.<br/>
        <b>One-time use only</b></p>

        <img src="cid:foodqr" width="200" alt="Food QR Code"/>
      </div>

      <div class="footer">
        📍 Velammal Engineering College<br/>
        📅 March 10, 2026<br/><br/>
        <b>See you at COGNEBULA 26 ✨</b>
      </div>

    </div>
  </div>
</body>
</html>
`,
    attachments: [
      {
        filename: "food_qr.png",
        content: qrBuffer,
        cid: "foodqr",
      },
    ],
  });
}

module.exports = { sendWelcomeMail };
