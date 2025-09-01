const express = require('express');
const Category = require('../models/Category');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all categories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({ name: 1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get category by ID
router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create category (admin only)
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const { name, description, image } = req.body;

    const category = new Category({
      name,
      description,
      image,
    });

    await category.save();
    res.status(201).json(category);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Category name already exists' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update category (admin only)
router.put('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json(category);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete category (admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
