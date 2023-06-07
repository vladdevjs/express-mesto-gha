const formatUser = (user) => ({
  name: user.name,
  about: user.about,
  avatar: user.avatar,
  _id: user._id,
});

module.exports = { formatUser };
