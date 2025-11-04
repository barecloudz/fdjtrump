# Fuck DJ Trump Shop

A modern, mobile-first e-commerce web application built with React and deployed on Netlify.

## Features

### Storefront
- **Home Page**: Featured products, recently viewed items, stories section
- **Shop Page**: Product categories, flash sales, product browsing
- **Flash Sale Page**: Countdown timer, discount filters, sale items
- **Product Detail Page**: Full product information with images and pricing
- **Mobile-First Design**: Optimized for mobile devices with bottom navigation

### Admin Panel
- **Secure Login**: Password-protected admin access (default: admin123)
- **Dashboard**: Overview statistics and quick actions
- **Product Management**: Add, edit, and delete products
- **Image Upload**: Upload product images directly
- **Product Features**: Set discounts, mark as popular, categorize products

## Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **Storage**: LocalStorage (for product data)
- **Hosting**: Netlify

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Deployment to Netlify

1. Push your code to GitHub
2. Connect your repository to Netlify
3. Netlify will automatically detect the build settings from `netlify.toml`
4. Deploy!

Or use the Netlify CLI:

```bash
npm install -g netlify-cli
netlify deploy --prod
```

## Admin Access

- **URL**: `/admin`
- **Default Password**: `admin123`

### Admin Features

1. **Add Products**: Upload images, set prices, add descriptions
2. **Edit Products**: Update existing product information
3. **Delete Products**: Remove products from the store
4. **Set Discounts**: Apply percentage discounts to products
5. **Mark Popular**: Highlight popular items on the homepage

## Project Structure

```
├── public/               # Static assets
├── src/
│   ├── components/      # Reusable UI components
│   │   ├── BottomNav.jsx
│   │   └── ProductCard.jsx
│   ├── pages/           # Page components
│   │   ├── Home.jsx
│   │   ├── Shop.jsx
│   │   ├── FlashSale.jsx
│   │   ├── Profile.jsx
│   │   ├── ProductDetail.jsx
│   │   └── admin/       # Admin pages
│   │       ├── AdminLogin.jsx
│   │       ├── AdminDashboard.jsx
│   │       └── AdminProducts.jsx
│   ├── App.jsx          # Main app component
│   ├── main.jsx         # App entry point
│   └── index.css        # Global styles
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── netlify.toml         # Netlify configuration
```

## Design

The app follows a modern mobile-first design pattern inspired by popular e-commerce platforms:

- **Color Scheme**:
  - Primary: Blue (#3B82F6)
  - Secondary: Yellow/Gold (#FCD34D)
  - Accent: Red (#EF4444)
- **Layout**: Card-based UI with grid layouts
- **Navigation**: Fixed bottom navigation bar
- **Typography**: Clean sans-serif fonts

## Notes

- Product data is stored in browser localStorage
- Images are stored as base64 data URLs
- Admin authentication is basic (password-only) - suitable for demo purposes
- For production use, implement proper backend authentication and database storage

## License

MIT
