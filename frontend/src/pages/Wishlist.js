import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

const Wishlist = () => {
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const { 
    wishlistItems, 
    loading, 
    removeFromWishlist 
  } = useWishlist();

  const handleRemoveFromWishlist = async (productId) => {
    const result = await removeFromWishlist(productId);
    if (result.success) {
      alert('Product removed from wishlist');
    } else {
      alert(result.error);
    }
  };

  const handleAddToCart = async (productId) => {
    const result = await addToCart(productId, 1);
    if (result.success) {
      alert('Product added to cart!');
    } else {
      alert(result.error);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="wishlist-page">
        <div className="container">
          <div className="auth-required">
            <h2>Please log in to view your wishlist</h2>
            <Link to="/login" className="login-btn">Login</Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return <div className="loading">Loading wishlist...</div>;
  }

  return (
    <div className="wishlist-page">
      <div className="container">
        <div className="page-header">
          <h1 style={{ color: 'black' }}>My Wishlist</h1>
          <p>{wishlistItems.length} items</p>
        </div>

        {wishlistItems.length === 0 ? (
          <div className="empty-wishlist">
            <div className="empty-icon">❤️</div>
            <h3>Your wishlist is empty</h3>
            <p>Save items you love to your wishlist</p>
            <Link to="/products" className="shop-btn">Continue Shopping</Link>
          </div>
        ) : (
          <div className="wishlist-grid">
            {wishlistItems.map(item => (
              <div key={item.product._id} className="wishlist-card">
                <Link to={`/products/${item.product._id}`} className="product-link">
                  <img 
                    src={item.product.images?.[0] || '/placeholder-image.jpg'} 
                    alt={item.product.name}
                  />
                  <div className="product-info">
                    <h3>{item.product.name}</h3>
                    <p className="brand">{item.product.brand}</p>
                    <div className="rating">
                      {'★'.repeat(Math.floor(item.product.rating))} ({item.product.numReviews})
                    </div>
                    <div className="price">
                      <span className="current-price">${item.product.price}</span>
                      {item.product.originalPrice && (
                        <span className="original-price">${item.product.originalPrice}</span>
                      )}
                    </div>
                  </div>
                </Link>
                
                <div className="card-actions">
                  <button 
                    className="add-to-cart-btn"
                    onClick={() => handleAddToCart(item.product._id)}
                  >
                    Add to Cart
                  </button>
                  <button 
                    className="remove-btn"
                    onClick={() => handleRemoveFromWishlist(item.product._id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
