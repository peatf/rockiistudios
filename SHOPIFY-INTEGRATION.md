# Rockii Builder - Shopify Integration Guide

This document explains how the Rockii Builder has been refactored for Shopify integration.

## What Was Changed

The React/Vite project has been refactored to support **two build modes**:

1. **SPA Mode** (existing) - For GitHub Pages deployment
2. **Shopify Mode** (new) - For embedding in Shopify Online Store 2.0

## Project Structure

```
src/
├── config/
│   └── defaults.js           # All global constants (BEAD_LIBRARY, CUSTOM_PRICING, etc.)
├── RockiiBuilder.jsx          # Standalone builder component
├── shopify-entry.jsx          # Shopify global API entry point
├── App.jsx                    # Main SPA app (imports RockiiBuilder)
└── main.jsx                   # SPA entry point

shopify-test.html              # Test harness for IIFE bundle
dist/
└── rockii-builder.iife.js     # Shopify embeddable bundle (generated)
```

## Key Files

### 1. `src/RockiiBuilder.jsx`

The standalone builder component that accepts props:

```jsx
<RockiiBuilder
  beadLibrary={...}           // Optional: defaults to DEFAULT_BEAD_LIBRARY
  customPricing={...}         // Optional: defaults to DEFAULT_CUSTOM_PRICING
  productId={123}             // Shopify product ID
  productVariants={[...]}     // Shopify product variants
  onAddToCart={(payload) => {
    // Handle add to cart
  }}
  onClose={() => {
    // Handle close
  }}
/>
```

### 2. `src/shopify-entry.jsx`

Exposes the global `window.RockiiBuilder` API for Shopify:

```javascript
window.RockiiBuilder = {
  mount: (element, options) => { ... },
  version: '1.0.0'
}
```

### 3. `src/config/defaults.js`

All constants extracted into a single file:
- `BEAD_LIBRARY` - Bead inventory
- `CUSTOM_PRICING` - Pricing by bead count
- `PRODUCTS` - Product catalog
- `IMAGES` - Asset URLs
- `WORKSHOPS` - Workshop data
- `NAV_LINKS` - Navigation links

## Build Commands

### Development (SPA Mode)
```bash
npm run dev
```
Runs at: `http://localhost:5173/rockiistudios/`

### Production SPA Build
```bash
npm run build
```
Outputs to: `dist/` (for GitHub Pages)

### Shopify Build
```bash
npm run build:shopify
```
Outputs: `dist/rockii-builder.iife.js` (728 KB, 224 KB gzipped)

## Testing the Shopify Bundle

### Local Test
1. Build the Shopify bundle:
   ```bash
   npm run build:shopify
   ```

2. Open `shopify-test.html` in a browser or serve it:
   ```bash
   npx serve .
   ```

3. Click "Launch Builder" to test the mount function

### Test Harness Features
- Mock product ID input
- Simulated product variants
- Console output logging
- Add to cart callback testing
- Mount/unmount functionality

## Shopify Integration

### Option 1: Theme App Extension (Recommended)

1. Upload `dist/rockii-builder.iife.js` to your Shopify app
2. In your Liquid template:

```liquid
<!-- Product page template -->
<div id="rockii-builder-root"></div>

{{ 'rockii-builder.iife.js' | asset_url | script_tag }}

<script>
  window.RockiiBuilder.mount(
    document.getElementById('rockii-builder-root'),
    {
      productId: {{ product.id }},
      productVariants: {{ product.variants | json }},
      onAddToCart: function(payload) {
        // Map payload.beadCount to variant ID
        const variant = {{ product.variants | json }}.find(
          v => v.option1 == payload.beadCount
        );

        // Prepare line item properties
        const properties = {
          'Chain Metal': payload.chainMetal,
          'Chain Length': payload.chainLength + '"',
          'Beads': payload.beads.map(b => b.code).join(', ')
        };

        // Add to Shopify cart
        fetch('/cart/add.js', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: variant.id,
            quantity: 1,
            properties: properties
          })
        })
        .then(response => response.json())
        .then(data => {
          console.log('Added to cart:', data);
          window.location.href = '/cart';
        })
        .catch(error => console.error('Error:', error));
      },
      onClose: function() {
        // Hide the builder
        document.getElementById('rockii-builder-root').innerHTML = '';
      }
    }
  );
</script>
```

### Option 2: Direct Asset Upload

1. Upload `rockii-builder.iife.js` to Shopify theme assets
2. Reference it in your theme:

```liquid
<script src="{{ 'rockii-builder.iife.js' | asset_url }}"></script>
```

## Add to Cart Payload Structure

When the user confirms their design, `onAddToCart` receives:

```javascript
{
  productId: 123,
  beadCount: 5,
  beads: [
    { position: 1, id: 'silver-blue-rock', name: 'Blue Gem Rock', code: 'S-BGR-01', img: '...' },
    { position: 2, id: 'silver-spiral', name: 'Spiral', code: 'S-SPR-06', img: '...' },
    // ...
  ],
  chainMetal: 'silver',        // 'silver' or 'gold'
  chainLength: 18,             // Number in inches
  chainLengthType: 'standard', // 'standard' or 'custom'
  price: 225,                  // Calculated price
  description: '925 Sterling Silver Chain (18") | 5 Beads'
}
```

## Shopify Product Setup

### Create Variants by Bead Count

In Shopify, create variants for the "Rockii Beads" product:

- **Option 1: Bead Count** (values: 1, 2, 3, 4, 5, 6, 7, 8)
- **Option 2: Metal** (values: Silver, Gold)

Set prices:
- 1 bead: $65
- 2 beads: $105
- 3 beads: $145
- 4 beads: $185
- 5 beads: $225
- 6 beads: $245
- 7 beads: $285
- 8 beads: $325

## TODO: Future Shopify Integration

The following items are stubbed in `src/shopify-entry.jsx` and need completion:

1. ✅ Extract builder into standalone component
2. ✅ Create Shopify entry point
3. ✅ Build IIFE bundle
4. ⚠️ **TODO**: Map `beadCount` to Shopify variant ID
5. ⚠️ **TODO**: POST to `/cart/add.js` with line item properties
6. ⚠️ **TODO**: Handle cart drawer or redirect after add to cart
7. ⚠️ **TODO**: Add error handling for failed cart operations

Search for `// TODO:` in `src/shopify-entry.jsx` for details.

## File Sizes

- **IIFE Bundle**: 728 KB (uncompressed)
- **Gzipped**: 224 KB
- Includes: React, React DOM, Framer Motion, Lucide React, all builder logic

## Browser Support

The bundle targets modern browsers:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## Development Notes

### Keeping SPA and Shopify in Sync

Both modes use the same `RockiiBuilder` component, so:
- ✅ Changes to builder logic apply to both
- ✅ Constants in `src/config/defaults.js` are shared
- ✅ Single source of truth for pricing and bead library

### Customizing the Builder

To modify bead library or pricing:
1. Edit `src/config/defaults.js`
2. Rebuild: `npm run build:shopify`
3. Upload new bundle to Shopify

### Props vs Defaults

The `RockiiBuilder` component accepts optional props. If not provided, it uses defaults from `src/config/defaults.js`:

```jsx
// Uses defaults
<RockiiBuilder onAddToCart={handler} onClose={handler} />

// Custom data
<RockiiBuilder
  beadLibrary={customBeads}
  customPricing={customPrices}
  onAddToCart={handler}
  onClose={handler}
/>
```

## Troubleshooting

### Bundle not loading
- Check browser console for errors
- Verify script tag is loading the correct asset URL
- Ensure `window.RockiiBuilder` is defined after script loads

### Builder not mounting
- Check that the target element exists in DOM
- Verify element ID matches mount call
- Check console for mount errors

### Add to cart not working
- Verify `onAddToCart` callback is provided
- Check payload structure matches expected format
- Ensure Shopify variants are configured correctly

## Support

For issues or questions:
1. Check browser console for errors
2. Test with `shopify-test.html` locally
3. Review Shopify variant configuration
4. Verify all TODO items in `shopify-entry.jsx` are completed

---

**Version**: 1.0.0
**Last Updated**: November 22, 2025
**Build**: Vite 7.2.4 + React 19.2.0
