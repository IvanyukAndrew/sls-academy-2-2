const db = require("../db/db");
const jwt = require("jsonwebtoken");

class UserController {
  async getOne(req, res, next) {
    try {
      const refreshToken = req.headers.authorization.replace(/Bearer\s?/, "");
      const verifyToken = jwt.verify(refreshToken, "secrete123");
      const user = await db.query("SELECT * FROM users where id = $1", [
        verifyToken.id,
      ]);

      if (!user.rows.length) {
        return res.status(404).json({ error: "user is not found" });
      }

      res.json({
        success: "true",
        data: {
          id: user.rows[0].id,
          email: user.rows[0].email,
        },
      });
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new UserController();
