const db = require("../db/db");
const bcrypt = require("bcrypt");
const jwtTokens = require("../jwt");

class AuthController {
  async register(req, res, next) {
    try {
      const { email, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);

      const users = await db.query("SELECT * FROM users WHERE email = $1", [
        email,
      ]);
      if (users.rows.length !== 0) {
        return res.status(409).json({
          success: "false",
          error: "Email is already registered",
        });
      }

      const newUser = await db.query(
        "INSERT INTO users (email,password) VALUES ($1,$2) RETURNING *",
        [email, hashedPassword]
      );

      const token = jwtTokens(newUser.rows[0].id);

      await db.query(
        "INSERT INTO tokens (user_id, refreshToken) VALUES ($1, $2) RETURNING *",
        [newUser.rows[0].id, token.refreshToken]
      );
      res.status(201).json({
        success: true,
        data: {
          id: newUser.rows[0].id,
          accessToken: token.token,
          refreshToken: token.refreshToken,
        },
      });
    } catch (e) {
      next(e);
    }
  }
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const user = await db.query("SELECT * FROM users WHERE email = $1", [
        email,
      ]);

      if (!user.rows.length) {
        return res.status(404).json({ error: "Email is not found" });
      }

      const validPassword = await bcrypt.compare(
        password,
        user.rows[0].password
      );

      if (!validPassword) {
        return res.status(404).json({ error: "Password is not correct" });
      }

      const token = jwtTokens(user.rows[0].id);

      await db.query("UPDATE tokens SET refreshtoken = $1 WHERE user_id = $2", [
        token.refreshToken,
        user.rows[0].id,
      ]);
      res.status(201).json({
        success: true,
        data: {
          id: user.rows[0].id,
          accessToken: token.token,
          refreshToken: token.refreshToken,
        },
      });
    } catch (error) {
      next(e);
    }
  }
}

module.exports = new AuthController();
