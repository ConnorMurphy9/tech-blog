const router = require("express").Router();
const { User } = require("../../models");

//localhost:3040/api/user/signup
router.post('/signup', async (req, res) => {
    try {
      const newUserData = await User.create({
        username: req.body.username,
        password: req.body.password,
      });
      //this sets up the new user information
      req.session.save(() => {
        req.session.loggedIn = true;
        req.session.userID = newUserData.id;
        req.session.username = newUserData.username;
        res.status(200).json(newUserData)
      });
      console.log(req.session.loggedIn)
    } catch (err) {
      console.log(err)
      res.status(500).json(err);
    }
  });

//localhost:3040/ api/user/login
router.post('/login', async (req, res) => {
    try {
      const userData = await User.findOne({ where: { username: req.body.username } });
      if (!userData) {
        res.status(404).json({ message: "Login failed please try again!" });
        return;
      }
      const validPassword = await userData.checkPassword(req.body.password);
  
      if (!validPassword) {
        res.status(404).json({ message: "Incorrect password, please try again" });
        return;
      }
      req.session.save(() => {
        req.session.userID = userData.id;
        req.session.username = userData.username;
        req.session.loggedIn = true;
        res.status(200).json({ message: "you are now logged in! YAY" })
      });
      console.log(req.session.userID)
  
    } catch (err) {
      res.status(500).json(err)
    }
  });

  //localhost:3040/api/user/logout
  router.post('/logout', async (req, res) => {
    try {
      console.log("logging out!")
      if (req.session.loggedIn) {
        req.session.destroy(() => {
          res.status(204).end()
        });
      } else {
        res.status(404).end()
      }
    } catch (err) {
      res.status(500).json(err)
    }
  })
  module.exports = router;