const Item = require('../models/itemModel');

const transformItem = (item) => {
  return {
    ...item,
    title: item.title_json?.en || item.title || '',
    description: item.description_json?.en || item.description || '',
    title_json: item.title_json || { en: '', am: '', or: '' },
    description_json: item.description_json || { en: '', am: '', or: '' }
  };
};

exports.createItem = async (data) => {
  // Transform the data to handle both old and new format
  const itemData = {
    ...data,
    title_json: data.title_json || {
      en: data.title || '',
      am: data.title_am || '',
      or: data.title_or || ''
    },
    description_json: data.description_json || {
      en: data.description || '',
      am: data.description_am || '',
      or: data.description_or || ''
    }
  };
  const result = await Item.create(itemData);
  return result;
};

exports.getAllItems = async (req, res) => {
  try {
    const items = await Item.getAll();
    const transformedItems = items.map(transformItem);
    const itemsWithRelativeImage = transformedItems.map(item => ({
      ...item,
      image: item.image || null
    }));
    res.status(200).json(itemsWithRelativeImage);
  } catch (err) {
    res.status(500).json({ error: err.message || err });
  }
};

exports.getItemById = async (req, res) => {
  try {
    const item = await Item.getById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    const transformedItem = transformItem(item);
    transformedItem.image = transformedItem.image || null;
    res.status(200).json(transformedItem);
  } catch (err) {
    res.status(500).json({ error: err.message || err });
  }
};

exports.updateItem = async (id, data) => {
  // Transform the data to handle both old and new format
  const itemData = {
    ...data,
    title_json: data.title_json || {
      en: data.title || '',
      am: data.title_am || '',
      or: data.title_or || ''
    },
    description_json: data.description_json || {
      en: data.description || '',
      am: data.description_am || '',
      or: data.description_or || ''
    }
  };
  const result = await Item.updateById(id, itemData);
  return result;
};

exports.deleteItem = async (req, res) => {
  try {
    await Item.deleteById(req.params.id);
    res.status(200).json({ message: 'Item deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message || err });
  }
};