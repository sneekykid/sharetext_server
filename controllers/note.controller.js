const noteService = require("../service/note.service");
const tokenService = require("../service/token.service");

const ApiError = require("../exeptions/api.error");

class NoteController {
  async createNote(req, res, next) {
    try {
      const { title, content } = req.body;
      const { accessToken } = req.cookies;

      console.log(title, content, accessToken);

      const noteData = await noteService.createNote(
        title,
        content,
        accessToken
      );

      console.log(noteData);

      return res.json(noteData);
    } catch (err) {
      next(err);
    }
  }
  async getNote(req, res, next) {
    try {
      const { id } = req.params;

      const noteData = await noteService.getNote(Number(id));

      console.log(noteData);

      return res.json(noteData);
    } catch (err) {
      next(err);
    }
  }
  async getNotes(req, res, next) {
    try {
      const noteData = await noteService.getNotes();

      console.log(noteData);

      return res.json(noteData);
    } catch (err) {
      next(err);
    }
  }
  async updateNote(req, res, next) {
    try {
      const { id, title, content } = req.body;

      const noteData = await noteService.updateNote(id, title, content);

      console.log(noteData);

      return res.json(noteData);
    } catch (err) {
      next(err);
    }
  }
  async deleteNote(req, res, next) {
    try {
      const { id } = req.params;

      const noteData = await noteService.deleteNote(id);

      console.log(noteData);

      return res.json(noteData);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new NoteController();
