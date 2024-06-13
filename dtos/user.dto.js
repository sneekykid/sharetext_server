module.exports = class UserDto {
  id;
  username;

  constructor(row) {
    (this.id = row.id), (this.username = row.username);
  }
};
