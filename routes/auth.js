const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

//REGISTER
router.post("/register", async (req, res) => {
  console.log(req.body);
  try {
    const userdata = await User.findOne({ username: req.body.username });
    if (userdata) {
      console.log("here", userdata);
      res.status(500).json("username already used");
    } else {
      const emailcheck = await User.findOne({ email: req.body.email });
      if (emailcheck) {
        res.status(500).json("email already used! use another email");
      } else {
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(req.body.password, salt);
        const newUser = new User({
          username: req.body.username,
          email: req.body.email,
          password: hashedPass,
        });
        const user = await newUser.save();
        res.status(200).json(user);
      }
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//LOGIN
router.post("/login", async (req, res) => {
  try {
    console.log(req.body);
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      res.status(400).json("Wrong credentials!");
    } else {
      // !user && res.status(400).json("Wrong credentials!");

      const validated = await bcrypt.compare(req.body.password, user.password);
      // !validated && res.status(400).json("Wrong credentials!");
      if (!validated) {
        res.status(400).json("Wrong credentials!");
      } else {
        const { password, ...others } = user._doc;
        res.status(200).json(others);
      }
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
