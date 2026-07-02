const { Message } = require('../models');

const getMessages = async (req, res) => {
  try {
    const messages = await Message.findAll({
      where: { employeeId: req.params.employeeId },
      order: [['createdAt', 'ASC']],
    });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const sendMessage = async (req, res) => {
  try {
    const { content, senderType, senderId, employeeId } = req.body;
    const message = await Message.create({ content, senderType, senderId, employeeId });
    res.status(201).json({ data: message });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getMessages, sendMessage };
