// MongoDB initialization script
db = db.getSiblingDB('ecommerce');

// Create user for the ecommerce database
db.createUser({
  user: 'ecommerce_user',
  pwd: 'userpassword123',
  roles: [
    {
      role: 'readWrite',
      db: 'ecommerce'
    }
  ]
});

// Create collections
db.createCollection('users');
db.createCollection('products');
db.createCollection('categories');
db.createCollection('orders');

// Insert sample categories
db.categories.insertMany([
  {
    name: 'Electronics',
    description: 'Latest electronic gadgets and devices',
    image: '/images/categories/electronics.jpg',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Clothing',
    description: 'Fashion and apparel for all occasions',
    image: '/images/categories/clothing.jpg',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Books',
    description: 'Books, magazines, and educational materials',
    image: '/images/categories/books.jpg',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Home & Garden',
    description: 'Home decor and gardening supplies',
    image: '/images/categories/home-&-garden.jpg',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

console.log('Database initialized with sample data');
