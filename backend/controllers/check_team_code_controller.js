const pool = require('../config/db'); // your database connection pool

/**
 * Get slot information for a team
 * @param {string} teamCode - The team code
 * @returns {object} - Slot information with team details
 */
async function getTeamSlotInfo(teamCode) {
  try {
    const query = `
      SELECT 
        e. teammembers as max_slots,
        COUNT(re.id) as filled_slots,
        (e.teammembers - COUNT(re.id)) as remaining_slots,
        MAX(CASE WHEN re.role = 'lead' THEN r.name END) as team_leader_name,
        MAX(re.team_name) as team_name,
        MAX(e.event_name) as event_name
      FROM registration_events re
      INNER JOIN events e ON re. event_id = e.id
      LEFT JOIN registrations r ON re.registration_id = r.id
      WHERE re.team_code = $1
      GROUP BY e.teammembers
    `;
    
    const result = await pool.query(query, [teamCode]);
    
    if (result.rows.length === 0) {
      return {
        success: false,
        message:  'Team code not found'
      };
    }
    
    const slotInfo = result. rows[0];
    
    return {
      success: true,
      data: {
        teamCode: teamCode,
        teamName: slotInfo.team_name,
        teamLeaderName: slotInfo.team_leader_name,
        eventName: slotInfo.event_name,
        maxSlots:  parseInt(slotInfo.max_slots),
        filledSlots: parseInt(slotInfo.filled_slots),
        remainingSlots: parseInt(slotInfo. remaining_slots),
        isFull: parseInt(slotInfo.remaining_slots) === 0
      }
    };
    
  } catch (error) {
    console.error('Error fetching team slot info:', error);
    return {
      success: false,
      message: 'Database error',
      error:  error.message
    };
  }
}

async function getTeamSlots(req, res) {
  try {
    const { team_code } = req.body;
    
    // Validate team code
    if (!team_code) {
      return res.status(400).json({
        success: false,
        message: 'Team code is required'
      });
    }

    // Validate team code format (optional but recommended)
    if (typeof team_code !== 'string' || team_code.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid team code format'
      });
    }
    
    const result = await getTeamSlotInfo(team_code.trim());
    
    if (!result.success) {
      return res.status(404).json(result);
    }
    
    return res.status(200).json(result);
    
    } catch (error) {
    console.error('Error in getTeamSlots controller:', error);
    return res.status(500).json({
      success: false,
      message:  'Internal server error',
      error: error.message
    });
  }
}

module.exports = {
  getTeamSlotInfo,
  getTeamSlots
};