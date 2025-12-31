const nodemailer = require("nodemailer");

const QRCode = require("qrcode");

const{query} = require('../config/db')

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
};



async function sendsecondarymail(req, res) {
  try {
    const { registrationId,  secondarymail } = req.body;

    console.log("secondarymail from frontend:", secondarymail);


    const regRes = await query(
      `SELECT name, email, secondary_mail FROM registrations WHERE id = $1`,
      [registrationId]
    );

    if (regRes.rows.length === 0) {
      return res.status(404).json({ message: "Registration not found" });
    }

    const { name, email, secondary_mail } = regRes.rows[0];

   let sendToEmail = email; 

if (secondary_mail) {
  return res.status(409).json({
    message: "Mail already sent for this registration"
  });
}

if (secondarymail) {
  await query(
    `UPDATE registrations SET secondary_mail = $1 WHERE id = $2`,
    [secondarymail, registrationId]
  );

  sendToEmail = secondarymail;
}

    const foodRes = await query(
      `SELECT token, food_type FROM food_tokens WHERE registration_id = $1`,
      [registrationId]
    );

    if (foodRes.rows.length === 0) {
      return res.status(404).json({ message: "Food details not found" });
    }

    const { token, food_type } = foodRes.rows[0];

    const eventsRes = await query(
      `SELECT 
         e.event_name,
         re.role,
         re.team_name,
         re.team_code
       FROM registration_events re
       JOIN events e ON e.id = re.event_id
       WHERE re.registration_id = $1`,
      [registrationId]
    );

    const events = eventsRes.rows;


    const qrBuffer = await QRCode.toBuffer(token);

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
      to: sendToEmail,
      subject: "🎉 Welcome Mail from COGNEBULA 26!",
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>WELCOME TO COGNEBULA 26</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #0b0b14;
      font-family: 'Segoe UI', Arial, sans-serif;
      color: #ffffff;
    }

    .container {
      max-width: 650px;
      margin: 30px auto;
      background: linear-gradient(145deg, #1a1a2e, #0f3460);
      border-radius: 16px;
      padding: 30px;
      box-shadow: 0 0 35px rgba(138,43,226,0.35);
    }

    .header {
      text-align: center;
      margin-bottom: 25px;
    }

    .header h1 {
      margin: 0;
      font-size: 30px;
      color: #d6b4ff;
    }

    .header p {
      margin-top: 8px;
      color: #cfcfe6;
      font-size: 15px;
    }

    .content p {
      font-size: 15px;
      line-height: 1.6;
      color: #f0e6ff;
    }

    .event-card {
      background: rgba(255,255,255,0.08);
      border-radius: 12px;
      padding: 14px;
      margin-bottom: 12px;
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
      border-radius: 10px;
      border: 3px solid #8e2de2;
    }

    .footer {
      margin-top: 30px;
      text-align: center;
      font-size: 13px;
      color: #b8b8d4;
    }
  </style>
</head>

<body>
  <div class="container">

    <div class="header">
      <h1>WELCOME TO COGNEBULA 26 🚀</h1>
      <p>The Symposium Is Live 🌌</p>
    </div>

    <div class="content">
      <p>
        Hello <b>${name}</b>,<br /><br />
        We’re happy to have you here at <b>COGNEBULA 26</b> today!  
        We hope you enjoy the sessions, activities, and interactions throughout the symposium.
      </p>

      <p>
        Below are the events you’ll be participating in today:
      </p>

      <h3>📌 Your Events</h3>
      ${eventsHtml}
    </div>

    <div class="food">
      <h3>🍽️ Food Pass – ${food_type.toUpperCase()}</h3>
      <p>
        Please show this QR code at the food counter when required.<br />
        <b>Valid for one-time use during the symposium.</b>
      </p>
      <img src="cid:foodqr" width="200" alt="Please wait few minutes" />
    </div>

    <div class="footer">
      📍 Velammal Engineering College<br />
      📅 Febraury 07, 2026<br /><br />
      <b>Have a great time at COGNEBULA 26 ✨</b>
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

    res.json({ message: "Mail sent successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Mail sending failed" });
  }
}


module.exports = { sendWelcomeMail, sendsecondarymail };
