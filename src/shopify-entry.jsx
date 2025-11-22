import React from 'react';
import { createRoot } from 'react-dom/client';
import RockiiBuilder from './RockiiBuilder.jsx';

/**
 * Shopify Entry Point for RockiiBuilder
 *
 * This file exposes the RockiiBuilder component as a global mount function
 * that can be called from Shopify Liquid templates.
 *
 * Usage in Shopify:
 * <div id="rockii-builder-root"></div>
 * <script src="{{ 'rockii-builder.iife.js' | asset_url }}"></script>
 * <script>
 *   window.RockiiBuilder.mount(
 *     document.getElementById('rockii-builder-root'),
 *     {
 *       productId: {{ product.id }},
 *       productVariants: {{ product.variants | json }},
 *       beadLibrary: { ... },
 *       customPricing: { ... },
 *       onAddToCart: function(payload) {
 *         // Handle add to cart
 *       }
 *     }
 *   );
 * </script>
 */

/**
 * Mount the RockiiBuilder component to a DOM element
 *
 * @param {HTMLElement} el - The DOM element to mount the builder to
 * @param {Object} options - Configuration options
 * @param {Object} options.beadLibrary - Library of available beads
 * @param {Object} options.customPricing - Pricing table
 * @param {string|number} options.productId - Shopify product ID
 * @param {Array} options.productVariants - Shopify product variants
 * @param {Function} options.onAddToCart - Callback when design is confirmed
 * @param {Function} options.onClose - Callback when builder is closed
 * @returns {Object} React root instance
 */
function mountRockiiBuilder(el, options = {}) {
    if (!el) {
        console.error('[RockiiBuilder] Mount failed: No element provided');
        return null;
    }

    // Provide default onAddToCart handler if not supplied
    const defaultOnAddToCart = (payload) => {
        console.log('[RockiiBuilder] Add to cart:', payload);
        shopifyAddToCart(payload, options.productVariants);
    };

    // Provide default onClose handler if not supplied
    const defaultOnClose = () => {
        console.log('[RockiiBuilder] Close builder');
        // You might want to hide the builder container instead of unmounting
    };

    const root = createRoot(el);
    root.render(
        <RockiiBuilder
            beadLibrary={options.beadLibrary}
            customPricing={options.customPricing}
            productId={options.productId}
            productVariants={options.productVariants}
            onAddToCart={options.onAddToCart || defaultOnAddToCart}
            onClose={options.onClose || defaultOnClose}
        />
    );

    return root;
}

/**
 * Shopify Add to Cart Integration (STUB)
 *
 * This function will map the builder payload to a Shopify variant
 * and submit it to the cart.
 *
 * TODO: Complete implementation once integrated with Shopify
 *
 * @param {Object} payload - The builder payload from onAddToCart
 * @param {Array} productVariants - Shopify product variants
 */
async function shopifyAddToCart(payload, productVariants = []) {
    console.log('[RockiiBuilder] Shopify Add to Cart - TODO');
    console.log('Payload:', payload);
    console.log('Product Variants:', productVariants);

    // TODO: Map payload.beadCount to the correct variant ID
    // Example: Find variant where option1 == beadCount
    // const variant = productVariants.find(v => v.option1 == payload.beadCount);

    // TODO: Prepare line item properties for custom data
    // const properties = {
    //   'Chain Metal': payload.chainMetal,
    //   'Chain Length': payload.chainLength + '"',
    //   'Beads': payload.beads.map(b => b.code).join(', ')
    // };

    // TODO: POST to Shopify Cart API
    // try {
    //   const response = await fetch('/cart/add.js', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({
    //       id: variant.id,
    //       quantity: 1,
    //       properties: properties
    //     })
    //   });
    //   const data = await response.json();
    //   console.log('Added to cart:', data);
    //   // Optionally trigger cart drawer or redirect
    //   window.location.href = '/cart';
    // } catch (error) {
    //   console.error('Failed to add to cart:', error);
    // }
}

// Expose global API
if (typeof window !== 'undefined') {
    window.RockiiBuilder = {
        mount: mountRockiiBuilder,
        version: '1.0.0'
    };
}

// For ES module imports (not used in IIFE mode, but available)
export { mountRockiiBuilder };
export default { mount: mountRockiiBuilder };
