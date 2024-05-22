const knex = require('knex');
const db = knex({
  client: 'pg',
  connection: process.env.DATABASE_URL,
});

class AttendanceController {
  static async registerAttendance(req, res) {
    try {
      const { subEventId, userId } = req.body;
      const attendance = {
        sub_event_id: subEventId,
        user_id: userId,
        checked_in_at: new Date(),
      };
      const result = await db('attendances').insert(attendance);
      res.status(201).json({ id: result[0] });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async checkoutAttendance(req, res) {
    try {
      const { attendanceId } = req.params;
      const attendance = {
        checked_out_at: new Date(),
      };
      await db('attendances')
        .where('id', attendanceId)
        .update(attendance);
      res.status(200).json({ message: 'Attendance checked out' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getAttendance(req, res) {
    try {
      const { attendanceId } = req.params;
      const attendance = await db('attendances')
        .where('id', attendanceId)
        .first();
      if (!attendance) {
        return res.status(404).json({ error: 'Attendance not found' });
}
      res.status(200).json(attendance);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getUserAttendances(req, res) {
    try {
      const { userId } = req.params;
      const attendances = await db('attendances')
        .where('user_id', userId)
        .orderBy('checked_in_at', 'desc');
      res.status(200).json(attendances);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getSubEventAttendances(req, res) {
    try {
      const { subEventId } = req.params;
      const attendances = await db('attendances')
        .where('sub_event_id', subEventId)
        .orderBy('checked_in_at', 'desc');
      res.status(200).json(attendances);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getAllAttendances(req, res) {
    try {
      const attendances = await db('attendances').orderBy('checked_in_at', 'desc');
      res.status(200).json(attendances);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = AttendanceController;