import React, { useState, useEffect } from 'react';
import { productsAPI, categoriesAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

// Image mapping function
const getImagePath = (type, name) => {
  const imageMap = {
    categories: {
      'Electronics': 'electronics.jpg',
      'Clothing': 'clothing.jpg', 
      'Books': 'books.jpg',
      'Home & Garden': 'home-&-garden.jpg'
    },
    products: {
      'Wireless Bluetooth Headphones': 'wireless-bluetooth-headphones.jpg',
      'Smart Fitness Watch': 'smart-fitness-watch.jpg',
      'Premium Cotton T-Shirt': 'premium-cotton-t-shirt.jpg',
      'JavaScript Programming Guide': 'javascript-programming-guide.jpg'
    }
  };
  
  const mappedName = imageMap[type][name];
  if (mappedName) {
    return `/images/${type}/${mappedName}`;
  }
  
  // Fallback to automatic conversion
  return `/images/${type}/${name.toLowerCase().replace(/\s+/g, '-')}.jpg`;
};

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [bestSellingProducts, setBestSellingProducts] = useState([]);
  const [topRatedProducts, setTopRatedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const { addToCart } = useCart();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [featuredResponse, categoriesResponse, bestSellingResponse, topRatedResponse] = await Promise.all([
          productsAPI.getFeatured(),
          categoriesAPI.getAll(),
          productsAPI.getAll({ sort: 'numReviews', limit: 8 }), // Best selling
          productsAPI.getAll({ sort: 'rating', limit: 8 }) // Top rated
        ]);
        
        setFeaturedProducts(featuredResponse.data);
        setCategories(categoriesResponse.data);
        setBestSellingProducts(bestSellingResponse.data.products || bestSellingResponse.data);
        setTopRatedProducts(topRatedResponse.data.products || topRatedResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddToCart = async (productId) => {
    const result = await addToCart(productId, 1);
    if (result.success) {
      alert('Product added to cart!');
    } else {
      alert(result.error || 'Please login to add items to cart');
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to E-Shop</h1>
          <p>Discover amazing products at great prices</p>
          <Link to="/products" className="cta-button">Shop Now</Link>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories">
        <div className="container">
          <h2>Shop by Category</h2>
          <div className="categories-grid">
            {categories.map((category, index) => {
              return (
                <Link 
                  key={category._id} 
                  to={`/products?category=${category._id}`}
                  className="category-card"
                >
                  <img 
                    src={getImagePath('categories', category.name)}
                    alt={category.name} 
                    onLoad={() => console.log(`Category image loaded: ${getImagePath('categories', category.name)}`)}
                    onError={(e) => {
                      console.log(`Category image failed: ${getImagePath('categories', category.name)}`);
                      e.target.src = "data:image/svg+xml,%3Csvg width='400' height='300' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='400' height='300' fill='%23699894'/%3E%3Ctext x='200' y='150' font-family='Arial' font-size='24' fill='white' text-anchor='middle'%3E" + encodeURIComponent(category.name) + "%3C/text%3E%3C/svg%3E";
                    }}
                  />
                  <h3>{category.name}</h3>
                  <p>{category.description}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="featured-products">
        <div className="container">
          <h2>Featured Products</h2>
          <div className="products-grid">
            {featuredProducts.map((product, index) => {
              return (
                <div key={product._id} className="product-card">
                  <Link to={`/products/${product._id}`} className="product-link">
                    <img 
                      src={getImagePath('products', product.name)}
                      alt={product.name} 
                      onLoad={() => console.log(`Product image loaded: ${getImagePath('products', product.name)}`)}
                      onError={(e) => {
                        console.log(`Product image failed: ${getImagePath('products', product.name)}`);
                        e.target.src = "data:image/svg+xml,%3Csvg width='400' height='300' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='400' height='300' fill='%234F7D7A'/%3E%3Ctext x='200' y='150' font-family='Arial' font-size='24' fill='white' text-anchor='middle'%3E" + encodeURIComponent(product.name) + "%3C/text%3E%3C/svg%3E";
                      }}
                    />
                    <div className="product-info">
                      <h3>{product.name}</h3>
                      <p className="brand">{product.brand}</p>
                      <div className="rating">
                        {'★'.repeat(Math.floor(product.rating))} ({product.numReviews})
                      </div>
                      <div className="price-info">
                        <span className="price">${product.price}</span>
                        {product.originalPrice && (
                          <span className="original-price">${product.originalPrice}</span>
                        )}
                        {product.discount > 0 && (
                          <span className="discount">-{product.discount}%</span>
                        )}
                      </div>
                    </div>
                  </Link>
                  <button 
                    className="add-to-cart-btn"
                    onClick={() => handleAddToCart(product._id)}
                  >
                    Add to Cart
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Best Selling Section */}
      <section className="best-selling">
        <div className="container">
          <h2>Best Selling</h2>
          <div className="products-grid">
            {bestSellingProducts.slice(0, 4).map((product, index) => {
              return (
                <div key={product._id} className="product-card">
                  <Link to={`/products/${product._id}`} className="product-link">
                    <img 
                      src={getImagePath('products', product.name)}
                      alt={product.name} 
                      onLoad={() => console.log(`Best Selling image loaded: ${getImagePath('products', product.name)}`)}
                      onError={(e) => {
                        console.log(`Best Selling image failed: ${getImagePath('products', product.name)}`);
                        e.target.src = "data:image/svg+xml,%3Csvg width='400' height='300' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='400' height='300' fill='%234F7D7A'/%3E%3Ctext x='200' y='150' font-family='Arial' font-size='24' fill='white' text-anchor='middle'%3E" + encodeURIComponent(product.name) + "%3C/text%3E%3C/svg%3E";
                      }}
                    />
                    <div className="product-info">
                      <h3>{product.name}</h3>
                      <p className="brand">{product.brand}</p>
                      <div className="rating">
                        {'★'.repeat(Math.floor(product.rating))} ({product.numReviews})
                      </div>
                      <div className="price-info">
                        <span className="price">${product.price}</span>
                        {product.originalPrice && (
                          <span className="original-price">${product.originalPrice}</span>
                        )}
                      </div>
                    </div>
                  </Link>
                  <button 
                    className="add-to-cart-btn"
                    onClick={() => handleAddToCart(product._id)}
                  >
                    Add to Cart
                  </button>
                </div>
              );
            })}
          </div>
          <div className="section-footer">
            <Link to="/products?sort=numReviews" className="view-all-btn">View All Best Selling</Link>
          </div>
        </div>
      </section>

      {/* Top Rating Section */}
      <section className="top-rating">
        <div className="container">
          <h2>Top Rating</h2>
          <div className="products-grid">
            {topRatedProducts.slice(0, 4).map((product, index) => {
              return (
                <div key={product._id} className="product-card">
                  <Link to={`/products/${product._id}`} className="product-link">
                    <img 
                      src={getImagePath('products', product.name)}
                      alt={product.name} 
                      onLoad={() => console.log(`Top Rating image loaded: ${getImagePath('products', product.name)}`)}
                      onError={(e) => {
                        console.log(`Top Rating image failed: ${getImagePath('products', product.name)}`);
                        e.target.src = "data:image/svg+xml,%3Csvg width='400' height='300' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='400' height='300' fill='%234F7D7A'/%3E%3Ctext x='200' y='150' font-family='Arial' font-size='24' fill='white' text-anchor='middle'%3E" + encodeURIComponent(product.name) + "%3C/text%3E%3C/svg%3E";
                      }}
                    />
                    <div className="product-info">
                      <h3>{product.name}</h3>
                      <p className="brand">{product.brand}</p>
                      <div className="rating">
                        {'★'.repeat(Math.floor(product.rating))} ({product.numReviews})
                      </div>
                      <div className="price-info">
                        <span className="price">${product.price}</span>
                        {product.originalPrice && (
                          <span className="original-price">${product.originalPrice}</span>
                        )}
                      </div>
                    </div>
                  </Link>
                  <button 
                    className="add-to-cart-btn"
                    onClick={() => handleAddToCart(product._id)}
                  >
                    Add to Cart
                  </button>
                </div>
              );
            })}
          </div>
          <div className="section-footer">
            <Link to="/products?sort=rating" className="view-all-btn">View All Top Rated</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
