const mongoose = require('mongoose');
const Category = require('./models/Category');
const Product = require('./models/Product');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const sampleCategories = [
  {
    name: 'Electronics',
    description: 'Latest electronic gadgets and devices',
    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400'
  },
  {
    name: 'Clothing',
    description: 'Fashion and apparel for all occasions',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400'
  },
  {
    name: 'Books',
    description: 'Books, magazines, and educational materials',
    image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400'
  },
  {
    name: 'Home & Garden',
    description: 'Home decor and gardening supplies',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400'
  }
];

const sampleProducts = [
  {
    name: 'Wireless Bluetooth Headphones',
    description: 'High-quality wireless headphones with noise cancellation',
    price: 99.99,
    originalPrice: 129.99,
    discount: 23,
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400'],
    stock: 50,
    brand: 'TechSound',
    rating: 4.5,
    numReviews: 124,
    isFeatured: true,
    specifications: {
      'Battery Life': '30 hours',
      'Connectivity': 'Bluetooth 5.0',
      'Weight': '250g'
    },
    tags: ['electronics', 'audio', 'wireless']
  },
  {
    name: 'Smart Fitness Watch',
    description: 'Advanced fitness tracking with heart rate monitoring',
    price: 199.99,
    originalPrice: 249.99,
    discount: 20,
    images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400'],
    stock: 30,
    brand: 'FitTech',
    rating: 4.7,
    numReviews: 89,
    isFeatured: true,
    specifications: {
      'Display': '1.4 inch AMOLED',
      'Battery': '7 days',
      'Water Resistance': 'IP68'
    },
    tags: ['electronics', 'fitness', 'smartwatch']
  },
  {
    name: 'Premium Cotton T-Shirt',
    description: 'Comfortable 100% cotton t-shirt in various colors',
    price: 24.99,
    originalPrice: 34.99,
    discount: 29,
    images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400'],
    stock: 100,
    brand: 'ComfortWear',
    rating: 4.2,
    numReviews: 67,
    isFeatured: false,
    specifications: {
      'Material': '100% Cotton',
      'Fit': 'Regular',
      'Care': 'Machine washable'
    },
    tags: ['clothing', 'casual', 'cotton']
  },
  {
    name: 'JavaScript Programming Guide',
    description: 'Complete guide to modern JavaScript development',
    price: 39.99,
    originalPrice: 49.99,
    discount: 20,
    images: ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400'],
    stock: 25,
    brand: 'TechBooks',
    rating: 4.8,
    numReviews: 156,
    isFeatured: true,
    specifications: {
      'Pages': '450',
      'Edition': '2024',
      'Format': 'Paperback'
    },
    tags: ['books', 'programming', 'javascript']
  }
];

const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear existing data
    await Category.deleteMany({});
    await Product.deleteMany({});

    console.log('Clearing existing data...');

    // Insert categories
    const createdCategories = await Category.insertMany(sampleCategories);
    console.log('Categories created:', createdCategories.length);

    // Map category names to IDs
    const categoryMap = {};
    createdCategories.forEach(cat => {
      categoryMap[cat.name] = cat._id;
    });

    // Update products with category IDs
    const productsWithCategories = sampleProducts.map(product => {
      let categoryId;
      if (product.tags.includes('electronics')) {
        categoryId = categoryMap['Electronics'];
      } else if (product.tags.includes('clothing')) {
        categoryId = categoryMap['Clothing'];
      } else if (product.tags.includes('books')) {
        categoryId = categoryMap['Books'];
      } else {
        categoryId = categoryMap['Home & Garden'];
      }
      
      return {
        ...product,
        category: categoryId
      };
    });

    // Insert products
    const createdProducts = await Product.insertMany(productsWithCategories);
    console.log('Products created:', createdProducts.length);

    console.log('Database seeded successfully!');
    console.log('Sample data includes:');
    console.log('- 4 Categories');
    console.log('- 4 Products');
    console.log('Ready to start the application!');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
