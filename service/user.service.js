const db = require("../db/db");
const bcrypt = require("bcrypt");
const tokenService = require("./token.service");
const UserDto = require("../dtos/user.dto");
const ApiError = require("../exeptions/api.error");

class UserService {
  async registration(username, password) {
    const candidate = await db.query(
      `SELECT * FROM person WHERE username = $1`,
      [username]
    );

    if (candidate.rowCount > 0) {
      throw ApiError.BadRequest(`USER WITH USERNAME ${username} EXIST.`, [
        username,
      ]);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await db.query(
      `INSERT INTO person (username, password) values ($1, $2) RETURNING *`,
      [username, hashedPassword]
    );

    const userDto = new UserDto(user.rows[0]);

    const tokens = tokenService.generateTokens({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return {
      ...tokens,
      user: userDto,
    };
  }
  async login(username, password) {
    const candidate = await db.query(
      `SELECT * FROM person WHERE username = $1`,
      [username]
    );

    if (candidate.rowCount < 1) {
      throw ApiError.BadRequest(
        `USER WITH USERNAME ${username} DOES NOT EXIST.`,
        [username]
      );
    }

    const isPassEquals = await bcrypt.compare(
      password,
      candidate.rows[0].password
    );

    if (!isPassEquals) {
      throw ApiError.BadRequest(`INCORRECT PASSWORD`, [username]);
    }

    const userDto = new UserDto(candidate.rows[0]);

    const tokens = tokenService.generateTokens({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return {
      ...tokens,
      user: userDto,
    };
  }
  async logout(refreshToken) {
    const token = await tokenService.removeToken(refreshToken);
    return token;
  }
  async refresh(refreshToken) {
    if (!refreshToken) {
      throw ApiError.UnauthorizedError();
    }
    const userData = tokenService.validateRefreshToken(refreshToken);
    const tokenFromDB = await tokenService.findToken(refreshToken);

    if (!userData || !tokenFromDB) {
      throw ApiError.UnauthorizedError();
    }

    const candidate = await db.query(`SELECT * FROM person WHERE id = $1`, [
      userData.id,
    ]);

    const userDto = new UserDto(candidate.rows[0]);

    const tokens = tokenService.generateTokens({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return {
      ...tokens,
      user: userDto,
    };
  }
  async getAllUsers() {
    const users = await db.query(`SELECT * FROM person`);
    const allUsers = [];

    for (let i in users.rows) {
      allUsers.push(new UserDto(users.rows[i]));
    }

    return allUsers;
  }
}

module.exports = new UserService();
