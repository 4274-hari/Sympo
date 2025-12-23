const{query} = require('../config/db');

async function eventdetails(req, res) {

    try {
        
        const result = await query(`SELECT * FROM events`);

        return res.status(200).json({message: "Below are the event details",data: result.rows});

    } catch (err) {
        console.error("Request details Error:", err);
        return res.status(500).json({ message: "Server error" });
    }
    
};

module.exports = {eventdetails}