const Contact = require("../schemas/contact-schema");

async function listContacts(userId, { limit = "20", page = "1" }) {
  const results = await Contact.paginate(
    { owner: userId },
    {
      limit,
      page,
      populate: {
        path: "owner",
        select: "email -_id",
      },
    }
  );

  const { docs: contacts, totalDocs: total } = results;
  return { total: total.toString(), limit, page, contacts };
}

async function getContactById(contactId, userId) {
  const result = await Contact.findOne({
    _id: contactId,
    owner: userId,
  }).populate({
    path: "owner",
    select: "email -_id",
  });
  return result;
}

async function addContact(body) {
  const result = await Contact.create(body);
  return result;
}

async function removeContact(contactId, userId) {
  const result = await Contact.findByIdAndDelete({
    _id: contactId,
    owner: userId,
  }).populate({
    path: "owner",
    select: "email -_id",
  });
  return result;
}

async function updateContact(contactId, reqBody, userId) {
  const result = await Contact.findByIdAndUpdate(
    { _id: contactId, owner: userId },
    { ...reqBody },
    { new: true }
  ).populate({
    path: "owner",
    select: "email -_id",
  });
  return result;
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
