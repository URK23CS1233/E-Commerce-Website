# Image Folder Structure

This folder contains all the images used in the e-commerce application.

## Folder Structure

```
/public/images/
├── categories/     # Category images
├── products/      # Product images
└── README.md      # This file
```

## Image Naming Convention

### Categories

Place category images in the `/categories/` folder with the following naming convention:

- Convert category name to lowercase
- Replace spaces with hyphens
- Use `.jpg` extension

Examples:

- "Electronics" → `electronics.jpg`
- "Home & Garden" → `home-&-garden.jpg`
- "Sports & Outdoors" → `sports-&-outdoors.jpg`

### Products

Place product images in the `/products/` folder with the following naming convention:

- Convert product name to lowercase
- Replace spaces with hyphens
- Use `.jpg` extension

Examples:

- "Wireless Headphones" → `wireless-headphones.jpg`
- "Smart Watch" → `smart-watch.jpg`
- "Gaming Laptop" → `gaming-laptop.jpg`

## Image Requirements

### Recommended Image Sizes

- **Category Images**: 400px × 300px
- **Product Images**: 400px × 300px

### Supported Formats

- JPG (recommended)
- PNG
- WebP

## Fallback System

If an image is not found, the application will automatically display a placeholder with the category/product name. The fallback system ensures the app continues to work even without images.

## How to Add Images

1. Navigate to the appropriate folder (`categories` or `products`)
2. Add your image file following the naming convention above
3. The image will automatically appear in the application

## Example File Structure

```
/public/images/
├── categories/
│   ├── electronics.jpg
│   ├── clothing.jpg
│   ├── home-&-garden.jpg
│   └── sports.jpg
├── products/
│   ├── wireless-headphones.jpg
│   ├── smart-watch.jpg
│   ├── gaming-laptop.jpg
│   └── running-shoes.jpg
└── README.md
```
