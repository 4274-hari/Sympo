function getReceiptHTML(receipt) {
  const {
    receipt_id,
    participant,
    events,
    food
  } = receipt;

  const { name } = participant;
  const foodType = food.type;

  const eventsHtml = events.map(ev => {
    let extra = "";

    if (ev.role === "lead") {
      extra = `
        <div class="meta"><b>Team Name:</b> ${ev.team_name}</div>
        <div class="meta"><b>Team Code:</b> ${ev.team_code}</div>
      `;
    } else if (ev.role === "member") {
      extra = `<div class="meta"><b>Team Name:</b> ${ev.team_name}</div>`;
    }

    return `
      <div class="event-card">
        <h4>${ev.event_name}</h4>
        <div class="meta"><b>Role:</b> ${ev.role}</div>
        ${extra}
      </div>
    `;
  }).join("");

  return `
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
    padding: 40px 16px;
  }

  .card {
    max-width: 680px;
    margin: auto;
    background: linear-gradient(145deg, #1a1a2e, #0f3460);
    border-radius: 20px;
    padding: 32px;
    color: #ffffff;
    box-shadow: 0 0 45px rgba(138,43,226,0.35);
  }

  /* ---------------- HERO ---------------- */

  .hero {
    text-align: center;
    margin-bottom: 28px;
  }

  .hero h1 {
    font-size: 34px;
    margin: 0;
    color: #e2c9ff;
    letter-spacing: 1px;
  }

  .hero p {
    font-size: 15px;
    margin-top: 6px;
    color: #cfcfe6;
  }

  .badge {
    margin-top: 14px;
    display: inline-block;
    padding: 7px 18px;
    background: linear-gradient(90deg, #8e2de2, #4a00e0);
    border-radius: 22px;
    font-size: 12px;
    letter-spacing: 1px;
  }

  .receipt-id {
    margin-top: 14px;
    padding: 10px 18px;
    background: rgba(255,255,255,0.12);
    border-radius: 14px;
    font-size: 14px;
    display: inline-block;
  }

  /* ---------------- CONTENT ---------------- */

  .content-text {
    margin: 24px 0;
    font-size: 15px;
    color: #e8e8ff;
    line-height: 1.7;
    text-align: center;
  }

  h3 {
    margin: 28px 0 14px;
    color: #f2eaff;
    font-size: 18px;
    border-bottom: 1px solid rgba(255,255,255,0.15);
    padding-bottom: 6px;
  }

  /* ---------------- EVENTS ---------------- */

  .event-card {
    background: rgba(255,255,255,0.08);
    border-radius: 14px;
    padding: 16px;
    margin-bottom: 14px;
  }

  .event-card h4 {
    margin: 0 0 8px;
    color: #e6ccff;
    font-size: 16px;
  }

  .meta {
    font-size: 14px;
    margin-top: 4px;
    color: #eaeaff;
  }

  /* ---------------- RULES ---------------- */

  .rules ul {
    list-style: none;
    padding: 0;
    margin: 12px 0 0;
  }

  .rules li {
    background: rgba(255,255,255,0.07);
    padding: 12px 14px;
    border-radius: 10px;
    margin-bottom: 10px;
    font-size: 14px;
    line-height: 1.6;
  }

  /* ---------------- FOOD ---------------- */

  .food {
    margin-top: 32px;
    padding: 22px;
    background: rgba(0,0,0,0.3);
    border-radius: 16px;
    text-align: center;
  }

  .food img {
    margin-top: 16px;
    border-radius: 14px;
    border: 3px solid #8e2de2;
  }

  /* ---------------- FOOTER ---------------- */

  .footer {
    margin-top: 34px;
    font-size: 13px;
    color: #c5c5df;
    text-align: center;
    line-height: 1.6;
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
        <div class="receipt-id">🎫 Receipt ID: <b>${receipt_id}</b></div>
      </div>

      <div class="content-text">
        Hey <b>${name}</b>,<br/>
        You’re officially part of <b>COGNEBULA 26</b> 🚀  
        Get ready for an electrifying symposium experience!
      </div>

      <h3>📌 Registered Events</h3>
      ${eventsHtml}

      <div class="rules">
        <h3>⚠️ Important Instructions</h3>
        <ul>
          <li>🪪 <b>College ID Card is mandatory</b> for entry.</li>
          <li>⏳ <b>Second event participation</b> depends on time availability.</li>
        </ul>
      </div>

      <div class="food">
        <h3>🍽️ Food Pass – ${foodType.toUpperCase()}</h3>
        <div>Show this QR code at the food counter</div>
        <div><b>One-time use only</b></div>
        <img src="${food.qr_base64}" width="200" alt="Food QR Code"/>
      </div>

      <div class="footer">
        📍 Velammal Engineering College<br/>
        📅 Feb 7, 2026<br/>
        <b>See you at COGNEBULA 26 ✨</b>
      </div>

    </div>
  </div>
</body>
</html>
`;
}

module.exports = { getReceiptHTML };
