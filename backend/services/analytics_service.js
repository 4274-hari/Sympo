const { getClient } = require("../config/db");

async function getAdminAnalytics(date) {
  const client = await getClient();

  try {
    await client.query("BEGIN");

    /* =====================================================
       🏠 HOME ANALYTICS
    ===================================================== */

    const totalRegistrations = await client.query(`
      SELECT COUNT(*)::INT AS count
      FROM registrations
    `);

    const vegCount = await client.query(`
      SELECT COUNT(*)::INT AS count
      FROM food_tokens
      WHERE food_type = 'veg'
    `);

    const nonVegCount = await client.query(`
      SELECT COUNT(*)::INT AS count
      FROM food_tokens
      WHERE food_type = 'nonveg'
    `);

    const topColleges = await client.query(`
      SELECT college, COUNT(*)::INT AS count
      FROM registrations
      GROUP BY college
      ORDER BY count DESC
      LIMIT 5
    `);

    const yearWise = await client.query(`
      SELECT student_year, COUNT(*)::INT AS count
      FROM registrations
      GROUP BY student_year
      ORDER BY student_year
    `);

    const morningSession = await client.query(`
      SELECT COUNT(*)::INT AS count
      FROM registration_events re
      JOIN events e ON re.event_id = e.id
      WHERE
        re.session = 'morning'
        OR (re.session IS NULL AND e.default_session = 'morning')
    `);

    const eveningSession = await client.query(`
      SELECT COUNT(*)::INT AS count
      FROM registration_events re
      JOIN events e ON re.event_id = e.id
      WHERE
        re.session = 'afternoon'
        OR (re.session IS NULL AND e.default_session = 'afternoon')
    `);

    /* =====================================================
       🎯 EVENT ANALYTICS
    ===================================================== */

    const nonTechCount = await client.query(`
      SELECT COUNT(DISTINCT re.registration_id)::INT AS count
      FROM registration_events re
      JOIN events e ON re.event_id = e.id
      WHERE e.event_mode = 'non-tech'
    `);

    const techCount = await client.query(`
      SELECT COUNT(DISTINCT re.registration_id)::INT AS count
      FROM registration_events re
      JOIN events e ON re.event_id = e.id
      WHERE e.event_mode = 'tech'
    `);

    const workshopCount = await client.query(`
      SELECT COUNT(DISTINCT re.registration_id)::INT AS count
      FROM registration_events re
      JOIN events e ON re.event_id = e.id
      WHERE e.event_mode = 'workshop'
    `);

    const nonTechEventWise = await client.query(`
      SELECT e.event_name, COUNT(re.registration_id)::INT AS participant_count
      FROM events e
      LEFT JOIN registration_events re ON e.id = re.event_id
      WHERE e.event_mode = 'non-tech'
      GROUP BY e.event_name
      ORDER BY participant_count DESC
    `);

    const techEventWise = await client.query(`
      SELECT e.event_name, COUNT(re.registration_id)::INT AS participant_count
      FROM events e
      LEFT JOIN registration_events re ON e.id = re.event_id
      WHERE e.event_mode = 'tech'
      GROUP BY e.event_name
      ORDER BY participant_count DESC
    `);

    /* =====================================================
       📍 ON-DAY ANALYTICS
    ===================================================== */

    const checkInCount = await client.query(`
      SELECT COUNT(*)::INT AS count
      FROM registrations
      WHERE check_in = true
    `);

    const eatenCount = await client.query(`
      SELECT COUNT(*)::INT AS count
      FROM food_tokens
      WHERE is_used = true
    `);

    const vegEaten = await client.query(`
      SELECT COUNT(*)::INT AS count
      FROM food_tokens
      WHERE food_type = 'veg' AND is_used = true
    `);

    const nonVegEaten = await client.query(`
      SELECT COUNT(*)::INT AS count
      FROM food_tokens
      WHERE food_type = 'nonveg' AND is_used = true
    `);

    const certificateStatus = await client.query(`
      SELECT event_name, e_certificate_sent
      FROM events
      ORDER BY event_name
    `);

    /* =====================================================
       💰 PAYMENT ANALYTICS
    ===================================================== */

    let paymentQuery = `
      SELECT
        COUNT(DISTINCT re.registration_id)
          FILTER (WHERE re.event_id != 13) AS event_count,
        COUNT(DISTINCT re.registration_id)
          FILTER (WHERE re.event_id = 13) AS workshop_count
      FROM registration_events re
      JOIN registrations r ON r.id = re.registration_id
      JOIN payment_proofs pp ON pp.email = r.email
    `;

    const paymentParams = [];

    if (date) {
      paymentQuery += ` WHERE DATE(pp.created_at) = $1`;
      paymentParams.push(date);
    }

    const paymentResult = await client.query(paymentQuery, paymentParams);

    const eventCount = Number(paymentResult.rows[0].event_count || 0);
    const workshopCountPay = Number(paymentResult.rows[0].workshop_count || 0);

    const EVENT_PRICE = 200;
    const WORKSHOP_PRICE = 300;

    const eventAmount = eventCount * EVENT_PRICE;
    const workshopAmount = workshopCountPay * WORKSHOP_PRICE;

    /* =====================================================
       🚫 BLACKLISTED PARTICIPANTS
    ===================================================== */

    const blacklistResult = await client.query(`
      SELECT DISTINCT
        re.registration_id AS participant_id,
        r.name,
        e.event_name,
        r.phone AS mobile,
        r.college,
        r.student_year AS year,
        r.email
      FROM registration_events re
      JOIN registrations r ON r.id = re.registration_id
      JOIN events e ON e.id = re.event_id
      WHERE r.blacklist = true
      ORDER BY r.name
    `);

    await client.query("COMMIT");

    return {
      home: {
        totalRegistrations: totalRegistrations.rows[0].count,
        food: {
          veg: vegCount.rows[0].count,
          nonveg: nonVegCount.rows[0].count
        },
        topColleges: topColleges.rows,
        yearWiseParticipants: yearWise.rows,
        sessions: {
          morning: morningSession.rows[0].count,
          evening: eveningSession.rows[0].count
        }
      },

      events: {
        modeCounts: {
          nonTech: nonTechCount.rows[0].count,
          tech: techCount.rows[0].count,
          workshop: workshopCount.rows[0].count
        },
        eventWise: {
          nonTech: nonTechEventWise.rows,
          tech: techEventWise.rows
        }
      },

      onDay: {
        checkInCount: checkInCount.rows[0].count,
        food: {
          totalEaten: eatenCount.rows[0].count,
          vegEaten: vegEaten.rows[0].count,
          nonvegEaten: nonVegEaten.rows[0].count
        },
        certificates: certificateStatus.rows
      },

      payments: {
        totalRegistrations: eventCount + workshopCountPay,

        pricing: {
          event: {
            count: eventCount,
            price: EVENT_PRICE,
            amount: eventAmount
          },
          workshop: {
            count: workshopCountPay,
            price: WORKSHOP_PRICE,
            amount: workshopAmount
          }
        },

        totalAmount: eventAmount + workshopAmount,

        blacklistedParticipants: blacklistResult.rows
      }
    };

  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

module.exports = { getAdminAnalytics };
