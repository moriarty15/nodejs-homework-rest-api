const express = require("express");
const createError = require("http-errors");

const { User } = require("../../models/user");
const { authenticate } = require("../../middlewares");

const router = express.Router();

router.get("/current", authenticate, async (req, res, next) => {
  res.json({
    email: req.user.email,
    subscription: req.user.subscription
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
    const possibleOptions = ['starter', 'pro', 'business']
    const checkValueSub = possibleOptions.includes(subscription)
    if (!checkValueSub) {
      throw new createError(400, "impossible value")
    }    
    const { _id } = req.user;
    const result = await User.findByIdAndUpdate(_id, { subscription: subscription }, {
      new: true
    })
    res.json(result)
  } catch (error) {
    next(error)
  }
})

module.exports = router;
