// Image utility for e-commerce cards
// This provides high-quality, consistent images from Unsplash

export const categoryImages = {
  books: 'https://images.unsplash.com/photo-1481349518771-20055b2a7b24?w=400&h=300&fit=crop&crop=center',
  clothing: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop&crop=center',
  electronics: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=300&fit=crop&crop=center',
  home: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop&crop=center',
  sports: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&crop=center',
  beauty: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=300&fit=crop&crop=center',
  toys: 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=400&h=300&fit=crop&crop=center',
  jewelry: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=300&fit=crop&crop=center'
};

export const productImages = [
  // Electronics & Gadgets
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop&crop=center', // watch
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop&crop=center', // headphones
  'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=300&fit=crop&crop=center', // sunglasses
  'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop&crop=center', // camera
  'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&h=300&fit=crop&crop=center', // clothing
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop&crop=center', // shoes
  
  // Fashion & Accessories
  'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop&crop=center', // retail store
  'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=300&fit=crop&crop=center', // electronics
  'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=300&fit=crop&crop=center', // jewelry
  'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop&crop=center', // bags
  
  // Home & Lifestyle
  'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop&crop=center', // plants
  'https://images.unsplash.com/photo-1481349518771-20055b2a7b24?w=400&h=300&fit=crop&crop=center', // books
  'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&crop=center', // fitness
  'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=300&fit=crop&crop=center', // beauty
  
  // Tech & Gaming
  'https://images.unsplash.com/photo-1493020258366-be3ead61c09c?w=400&h=300&fit=crop&crop=center', // laptop
  'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop&crop=center', // phone
  'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=400&h=300&fit=crop&crop=center', // toys
  'https://images.unsplash.com/photo-1589492477829-5e65395b66cc?w=400&h=300&fit=crop&crop=center'  // gaming
];

// Get image for a specific category
export const getCategoryImage = (categoryName) => {
  const key = categoryName.toLowerCase();
  return categoryImages[key] || categoryImages.electronics;
};

// Get image for a product by index
export const getProductImage = (index) => {
  return productImages[index % productImages.length];
};

// Get random product image
export const getRandomProductImage = () => {
  const randomIndex = Math.floor(Math.random() * productImages.length);
  return productImages[randomIndex];
};

// Get image based on product category
export const getProductImageByCategory = (categoryName, index = 0) => {
  const category = categoryName?.toLowerCase();
  
  // Category-specific product images
  const categoryProductImages = {
    books: [
      'https://images.unsplash.com/photo-1481349518771-20055b2a7b24?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&h=300&fit=crop'
    ],
    clothing: [
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop'
    ],
    electronics: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop'
    ]
  };
  
  const images = categoryProductImages[category] || productImages;
  return images[index % images.length];
};
