const Router = require("express");
const authControllers = require("../controllers/auth.controllers");
const { body } = require("express-validator");

const router = Router();

router.post(
  "/register",
  body("email").isEmail(),
  body("password").isLength({ min: 3, max: 32 }),
  authControllers.register
);
router.post("/login", authControllers.login);

module.exports = router;
