import express from "express";
import { body } from "express-validator";
import { validateRequest } from "../middlewares/validate-request.js";
import User from "../models/user.js";
import bcrypt from "bcrypt";
import { BadRequestError } from "../errors/bad-request-error.js";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post(
  "/api/v1/register",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("username").not().isEmpty().withMessage("username is required"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must be between 4 and 20 characters"),
  ],
  validateRequest,
  async (req, res) => {
    let userData = req.body;
    // check if the user is already in the database
    const emailExist = await User.findOne({ email: userData.email });
    if (emailExist) throw new BadRequestError("Email in use");

    // hash passwords
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // create a new user
    const newUser = new User({
      email: req.body.email,
      username: req.body.username,
      password: hashedPassword,
    });

    // save to the db
    newUser
      .save()
      .then((registeredUser) => {
        let payload = { id: registeredUser.id, email: registeredUser.email };
        let token = jwt.sign(payload, process.env.JWT_KEY);
        res.status(201).send({
          token,
          username: registeredUser.username,
          email: registeredUser.email,
          userId: registeredUser.id,
        });
      })
      .catch((error) => {
        console.log(error);
        res.status(400).send(error);
      });
  }
);

router.post(
  "/api/v1/login",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must be between 4 and 20 characters"),
  ],
  validateRequest,
  async (req, res) => {
    let userData = req.body;

    // check if the email matches the email in the database
    const user = await User.findOne({ email: userData.email });
    if (!user) throw new BadRequestError("Email doesnt exist");

    // check if the password is correct
    const validPassword = await bcrypt.compare(
      userData.password,
      user.password
    );
    if (!validPassword) throw new BadRequestError("Incorrect Password!");

    // create and assign a token
    let payload = { id: user.id, email: user.email };
    let token = jwt.sign(payload, process.env.JWT_KEY);
    return res.status(200).send({
      token,
      username: user.username,
      email: user.email,
      userId: user.id,
    });
  }
);

export { router as userRouter };
