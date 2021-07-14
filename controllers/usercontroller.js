const { User } = require("../models");
const { populate } = require("../models/user");

const userController = {
  getAllUsers(req, res) {
    User.find({})
      .populate({
        path: "thoughts",
        select: "-__v",
      })
      .select("-__v")
      .sort({ _id: -1 })
      .then((UserDatadb) => res.json(UserDatadb))
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
  },
  getUserById({ params }, res) {
    User.findOne({ _id: params.id })
      .populate({
        path: "thoughts",
        select: "-__v",
      })
      .select("-__v")
      .then((UserDatadb) => {
        if (!UserDatadb) {
          res.status(404).json({ message: "Invalid User Id" });
          return;
        }
        res.json(UserDatadb);
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
  },
  createUser({ body }, res) {
    User.create(body)
      .then((UserDatadb) => res.json(UserDatadb))
      .catch((err) => res.status(400).json(err));
  },
  updateUser({ params, body }, res) {
    User.findOneAndUpdate({ _id: params.id }, body, { new: true })
      .then((UserDatadb) => {
        if (!UserDatadb) {
          res.status(404).json({ message: "Invalid User Id" });
          return;
        }
        res.json(UserDatadb);
      })
      .catch((err) => res.status(400).json(err));
  },
  deleteUser({ params }, res) {
    User.findOneAndDelete({ _id: params.id })
      .then((UserDatadb) => {
        if (!UserDatadb) {
          res.status(404).json({ message: "Invalid User Id" });
          return;
        }
        res.json(UserDatadb);
      })
      .catch((err) => res.status(400).json(err));
  },

  addFriend({ params }, res) {
    User.findOneAndUpdate(
      { _id: params.id },
      { $addToSet: { friends: params.friendsId } },
      { new: true }
    )
      .then((UserDatadb) => res.json(UserDatadb))
      .catch((err) => res.status(400).json(err));
  },

  removeFriend({ params }, res) {
    User.findOneAndUpdate(
      { _id: params.id },
      { $pull: { friends: params.friendsId } },
      { new: true }
    )
      .then((UserDatadb) => {
        if (!UserDatadb) {
          res.status(404).json({ message: "Invalid User Id" });
          return;
        }
        res.json(UserDatadb);
      })
      .catch((err) => res.status(400).json(err));
  },
};

module.exports = userController;