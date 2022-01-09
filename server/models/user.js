import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: String,
  username: String,
  password: String,
});

export default mongoose.model("user", userSchema, "users");
