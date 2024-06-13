const Router = require("express");
const router = new Router();
const { body } = require("express-validator");
const authMiddleware = require("../middlewares/auth.middleware");

const userController = require("../controllers/user.controller");

router.post(
  "/registration",
  body("username").isLength({ min: 3, max: 64 }),
  body("password").isLength({ min: 8, max: 32 }),
  userController.registration
);
router.post("/login", userController.login);
router.post("/logout", userController.logout);
router.get("/refresh", userController.refresh);
router.get("/users", authMiddleware, userController.getUsers);

module.exports = router;
