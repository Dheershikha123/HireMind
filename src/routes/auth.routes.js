const express = require("express");
const authController = require("../controller/auth.controller")


const authRouter = express.Router()

/**
 * @route POST /api/auth/register
 * @description Register new user
 * @access Public
 */

authRouter.post("/register",authController.registerUserController)

/**
 * @route POST/api/auth/login
 * @description Login user with email and password
 * @access Public
 */
authRouter.post("/api/login",authController.loginUserController)

module.exports = authRouter