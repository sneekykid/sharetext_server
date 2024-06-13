const Router = require("express");
const router = new Router();
const { body } = require("express-validator");

const noteController = require("../controllers/note.controller");

router.post("/create", noteController.createNote);
router.get("/note/:id", noteController.getNote);
router.get("/notes", noteController.getNotes);
router.put("/note", noteController.updateNote);
router.delete("/note/:id", noteController.deleteNote);

module.exports = router;
