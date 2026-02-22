const express = require('express');
const itemController = require('../controllers/itemController');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const data = {
      image: req.body.image,
      title: req.body.title,
      title_am: req.body.title_am,
      title_or: req.body.title_or,
      description: req.body.description,
      description_am: req.body.description_am,
      description_or: req.body.description_or,
      title_json: req.body.title_json,
      description_json: req.body.description_json,
      order: req.body.order
    };
    const result = await itemController.createItem(data);
    res.status(201).json({ message: 'Item created', data: result });
  } catch (err) {
    res.status(500).json({ error: err.message || err });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const data = {
      image: req.body.image,
      title: req.body.title,
      title_am: req.body.title_am,
      title_or: req.body.title_or,
      description: req.body.description,
      description_am: req.body.description_am,
      description_or: req.body.description_or,
      title_json: req.body.title_json,
      description_json: req.body.description_json,
      order: req.body.order
    };
    const result = await itemController.updateItem(req.params.id, data);
    res.status(200).json({ message: 'Item updated', data: result });
  } catch (err) {
    res.status(500).json({ error: err.message || err });
  }
});

router.get('/', itemController.getAllItems);
router.get('/:id', itemController.getItemById);
router.delete('/:id', itemController.deleteItem);

module.exports = router;