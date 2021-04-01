const User = require("../schemas/user-schema");
// const cloudinary = require("cloudinary").v2;
// require("dotenv").config();

// cloudinary.config({
//   cloud_name: process.env.CLOUD_NAME,
//   api_key: process.env.API_KEY,
//   api_secret: process.env.API_SECRET,
// });

async function createUser(body) {
  const user = await User.create(body);
  return user;
}

async function findByEmail(email) {
  const user = await User.findOne({ email });
  return user;
}

async function findById(id) {
  const user = await User.findOne({ _id: id });
  return user;
}

async function updateToken(id, token) {
  return await User.updateOne({ _id: id }, { token });
}

async function updateSubscription(id, subscription) {
  return await User.findByIdAndUpdate(
    { _id: id },
    { subscription },
    { new: true }
  );
}

async function updateAvatar(id, avatarURL) {
  return await User.findByIdAndUpdate(
    { _id: id },
    { avatarURL },
    { new: true }
  );
}

module.exports = {
  createUser,
  findByEmail,
  updateToken,
  findById,
  updateSubscription,
  updateAvatar,
};
