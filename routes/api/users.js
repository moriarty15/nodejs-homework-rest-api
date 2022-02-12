const express = require("express");
const createError = require("http-errors");
const path = require("path");
const fs = require("fs/promises");
const Jimp = require("jimp");

const { User } = require("../../models/user");
const { authenticate, upload } = require("../../middlewares");

const router = express.Router();

router.get("/current", authenticate, async (req, res, next) => {
  res.json({
    email: req.user.email,
    subscription: req.user.subscription,
  });
});

router.get("/logout", authenticate, async (req, res, next) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: null });
  res.status(204).send();
});

router.patch("/subscription", authenticate, async (req, res, next) => {
  try {
    const { subscription } = req.body;
    const possibleOptions = ["starter", "pro", "business"];
    const checkValueSub = possibleOptions.includes(subscription);
    if (!checkValueSub) {
      throw new createError(400, "impossible value");
    }
    const { _id } = req.user;
    const result = await User.findByIdAndUpdate(
      _id,
      { subscription: subscription },
      {
        new: true,
      }
    );
    res.json(result);
  } catch (error) {
    next(error);
  }
});

const avatarsDir = path.join(__dirname, "../../", "public", "avatars");

router.patch(
  "/avatars",
  authenticate,
  upload.single("avatar"),
  async (req, res, next) => {
    const { _id } = req.user;
    const { path: tempUpload, filename } = req.file;
    try {
      const [extention] = filename.split(".").reverse();
      const newFileName = `${_id}.${extention}`;
      const resultUpload = path.join(avatarsDir, newFileName);
      await fs.rename(tempUpload, resultUpload);
      const avatarURL = path.join("avatars", newFileName);
      Jimp.read(resultUpload, (err, avatar) => {
        if (err) throw err;
        avatar.resize(250, 250).write(resultUpload);
      });
      await User.findByIdAndUpdate(_id, { avatarURL });
      res.json({
        avatarURL,
      });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
