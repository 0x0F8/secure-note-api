import path from "path";
require("dotenv").config({
  path: path.resolve(process.cwd(), `.${process.env.NODE_ENV}.env`),
});
const hasEnv = process.env.__TEST_ENV === "true";
if (hasEnv) {
  console.log("env import success");
} else {
  console.error("env import failure");
}
import "./app";
