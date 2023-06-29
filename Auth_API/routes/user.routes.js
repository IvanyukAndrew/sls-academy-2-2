const Router = require("express");
const userController = require("../controllers/user.controllers");
const { body } = require("express-validator");

const router = Router();

router.get("/me", userController.getOne);

module.exports = router;
