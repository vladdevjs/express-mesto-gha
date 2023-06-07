const formatCard = (card) => ({
  name: card.name,
  link: card.link,
  createdAt: card.createdAt,
  likes: card.likes,
  owner: card.owner,
  _id: card._id,
});

module.exports = { formatCard };
