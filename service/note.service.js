const db = require("../db/db");
const ApiError = require("../exeptions/api.error");
const tokenService = require("../service/token.service");

const { customAlphabet } = require("nanoid");
const nanoid = customAlphabet(
  "1234567890qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM-_"
);

class NoteService {
  async createNote(title, content, accessToken) {
    const candidate = tokenService.validateAccessToken(accessToken);

    if (!candidate) {
      throw ApiError.UnauthorizedError();
    }

    if (!title || !content) {
      throw ApiError.BadRequest(`INCORRECT DATA`);
    }

    console.log(candidate);

    const short_url = nanoid(8);

    const note = await db.query(
      `INSERT INTO note (short_url, title,  content, views, user_id) values ($1, $2, $3, $4, $5) RETURNING *`,
      [short_url, title, content, 0, candidate.id]
    );

    return {
      short_url,
      id: candidate.id,
    };
  }
  async getNote(id) {
    const candidate = await db.query(`SELECT * FROM note WHERE id = $1`, [id]);

    if (candidate.rowCount < 1) {
      throw ApiError.BadRequest(`NOTE WITH ID ${id} DOES NOT EXIST.`);
    }

    const { short_url, title, content, views, user_id } = candidate.rows[0];

    return {
      id,
      short_url,
      title,
      content,
      views,
      user_id,
    };
  }
  async getNotes() {
    const notes = await db.query(`SELECT * FROM note`);

    return notes.rows;
  }
  async updateNote(id, title, content) {
    const note = await db.query(
      `UPDATE note set title = $1, content = $2 where id = $3 RETURNING *`,
      [title, content, id]
    );

    if (note.rowCount < 1) {
      throw ApiError.BadRequest(`NOTE WITH ID ${id} DOES NOT EXIST.`);
    }

    return note.rows[0];
  }
  async deleteNote(id) {
    const note = await db.query(`DELETE FROM note where id = $1 RETURNING *`, [
      id,
    ]);

    if (note.rowCount < 1) {
      throw ApiError.BadRequest(`NOTE WITH ID ${id} DOES NOT EXIST.`);
    }

    return note.rows[0];
  }
}

module.exports = new NoteService();
