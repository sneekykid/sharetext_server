require("dotenv").config();

const jwt = require("jsonwebtoken");

const db = require("../db/db");

class TokenService {
  generateTokens(payload) {
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
      expiresIn: "1h",
    });
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
      expiresIn: "30d",
    });

    return {
      accessToken,
      refreshToken,
    };
  }
  validateAccessToken(token) {
    try {
      const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      return userData;
    } catch (err) {
      return null;
    }
  }
  validateRefreshToken(token) {
    try {
      const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
      return userData;
    } catch (err) {
      return null;
    }
  }
  async saveToken(userId, refreshToken) {
    await db
      .query(`SELECT * FROM token WHERE user_id = $1`, [userId])
      .then(async (db_res) => {
        if (db_res.rowCount > 0) {
          await db
            .query(
              `UPDATE token set refresh_token = $1 where user_id = $2 RETURNING *`,
              [refreshToken, userId]
            )
            .catch((err) => {
              console.error(err);
            });
        } else {
          await db
            .query(
              `INSERT INTO token (refresh_token, user_id) values ($1, $2) RETURNING *`,
              [refreshToken, userId]
            )
            .then((db_res) => {
              return db_res.rows[0];
            })
            .catch((err) => {
              console.error(err);
            });
        }
      });
  }
  async removeToken(refreshToken) {
    await db
      .query(`DELETE FROM token where refresh_token = $1 RETURNING *`, [
        refreshToken,
      ])
      .then((db_res) => {
        return db_res.rows[0];
      })
      .catch((err) => {
        console.error(err);
      });
  }
  async findToken(refreshToken) {
    const token = await db
      .query(`SELECT * FROM token where refresh_token = $1`, [refreshToken])
      .catch((err) => {
        console.error(err);
      });

    if (token.rowCount < 1) return null;

    return token.rows[0];
  }
}

module.exports = new TokenService();
