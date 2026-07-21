// CustomerCart.jsx - Main Component
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { FaShoppingCart, FaSync } from 'react-icons/fa';

// Components
import CustomerEmptyCart from './CustomerEmptyCart';
import CustomerCartHeader from './CustomerCartHeader';
import CustomerCartShopSection from './CustomerCartShopSection';
import CustomerCartOrderSummaryCard from './CustomerCartOrderSummaryCard';
import CustomerCartConfirmationModal from './CustomerCartConfirmationModal';
import ComponentLoading from '../../ComponentLoading';
import useCart from '../../../hooks/useCart';
// utils
import {
  groupItemsByShop,
  calculateCartTotals,
  prepareOrderSummary,
  validateMinOrders,
} from '../../../utils/cartUtils';
import {
  useGetCartItemsQuery,
  useGetPlaceOrderMutation,
} from '../../../services/customer.api';

const CustomerCart = () => {
  
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  // Use RTK Query to fetch cart items with automatic cache management
  const {
    data: cartItemsData = [],
    isLoading: isCartLoading,
    error: cartError,
    refetch: refetchCart, // Add refetch for manual refresh
  } = useGetCartItemsQuery(undefined, {
    skip: !user?._id,
  });

  // Use RTK Query mutation for placing orders
  const [placeCustomerOrder, { isLoading: isOrderPlacing }] =
    useGetPlaceOrderMutation();

  // Use cart hook for mutations
  const {
    updateQuantity,
    removeFromCart,
    clearCart,
    isLoading: mutationLoading,
  } = useCart();

  // Local state
  const [processingItem, setProcessingItem] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [orderSummary, setOrderSummary] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false); // For global loading state

  // Get cart items from RTK Query data - memoized to prevent re-renders
  const cartItems = useMemo(() => {
    return cartItemsData?.data || [];
  }, [cartItemsData]);

  // Calculate cart data with useMemo for performance
  const { shops, totals, totalItems } = useMemo(() => {
    const shops = groupItemsByShop(cartItems);
    const totals = calculateCartTotals(shops);
    const totalItems = cartItems.length;

    return { shops, totals, totalItems };
  }, [cartItems]);

  const { subtotal, totalSavings, totalDelivery, grandTotal } = totals;

  // Scroll to top on mount only once
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, []);

  // Handle quantity change with proper loading state
  const handleQuantityChange = useCallback(
    async (itemId, delta, e) => {
      e?.stopPropagation();

      if (!itemId) {
        toast.error('Invalid item');
        return;
      }

      // Set loading state for this specific item
      setProcessingItem(itemId);
      
      try {
        // Update quantity using the cart hook
        await updateQuantity(itemId, delta);
        
        // After successful update, we can keep the loading state briefly
        // to show a smooth transition
        setTimeout(() => {
          setProcessingItem(null);
        }, 300);
        
      } catch (error) {
        console.error('Quantity update error:', error);
        toast.error('Failed to update quantity');
        setProcessingItem(null);
      } finally {
        // Ensure loading state is cleared even if there's an error
        // The setTimeout will handle this in the success case
        if (!error) {
          // Already handled above
        } else {
          setProcessingItem(null);
        }
      }
    },
    [updateQuantity]
  );

  // Handle remove item
  const handleRemoveItem = useCallback(
    async (itemId, itemName, quantity, e) => {
      e?.stopPropagation();

      if (!itemId) {
        toast.error('Invalid item');
        return;
      }

      if (quantity > 1 && !window.confirm(`Remove ${itemName} from cart?`)) {
        return;
      }

      setProcessingItem(itemId);
      try {
        const result = await removeFromCart(itemId);

        if (result?.success) {
          toast.info(`${itemName} removed from cart`);
          // Refetch cart to ensure data is up to date
          await refetchCart();
        } else {
          toast.error(result?.error || `Failed to remove ${itemName}`);
        }
      } catch (error) {
        toast.error(`Failed to remove ${itemName}`);
        console.error('Remove item error:', error);
      } finally {
        setProcessingItem(null);
      }
    },
    [removeFromCart, refetchCart]
  );

  // Handle clear cart
  const handleClearCart = useCallback(async () => {
    if (!window.confirm('Are you sure you want to clear your entire cart?')) {
      return;
    }

    setIsUpdating(true);
    try {
      const result = await clearCart();

      if (result?.success) {
        toast.success('Cart cleared successfully');
        await refetchCart();
      } else {
        toast.error(result?.error || 'Failed to clear cart');
      }
    } catch (error) {
      toast.error('Failed to clear cart');
      console.error('Clear cart error:', error);
    } finally {
      setIsUpdating(false);
    }
  }, [clearCart, refetchCart]);

  // Handle checkout
  const handleCheckout = useCallback(() => {
    if (cartItems.length === 0) {
      toast.error('Your cart is empty. Add some delicious items first!');
      return;
    }

    // Validate minimum orders
    const validation = validateMinOrders(shops);
    if (!validation.isValid) {
      validation.errors.forEach((error) => {
        toast.error(error.message);
      });
      return;
    }

    const summary = prepareOrderSummary(shops, totals, totalItems);
    setOrderSummary(summary);
    setShowModal(true);
  }, [cartItems, shops, totals, totalItems]);

  // Place order using RTK Query mutation
  const placeOrder = useCallback(async () => {
    if (!orderSummary?.shops?.length) {
      toast.error('No shops in order summary');
      return;
    }

    if (!user?.location?.address) {
      toast.error('Please add your delivery address before placing an order');
      return;
    }

    let successCount = 0;
    let failCount = 0;
    const errors = [];
    const placedOrders = [];

    setIsUpdating(true);
    try {
      // Process each shop's order
      for (const shop of orderSummary.shops) {
        if (!shop.items || shop.items.length === 0) {
          errors.push(`No items in order for ${shop.shopName}`);
          failCount++;
          continue;
        }

        const orderPayload = {
          shop: shop.shopId,
          totalAmount: shop.total,
          totalSavings: shop.savings || 0,
          items: shop.items.map((item) => ({
            item: item.id,
            name: item.name || 'Unnamed Item',
            price: item.price || 0,
            quantity: item.quantity || 0,
            total: item.total || 0,
            picture: item.picture || '',
          })),
          status: 'pending',
          deliveryLocation: user?.location,
        };

        const invalidItems = orderPayload.items.filter(
          (item) => !item.item || item.quantity <= 0 || item.price < 0
        );

        if (invalidItems.length > 0) {
          errors.push(`Invalid items in order for ${shop.shopName}`);
          failCount++;
          continue;
        }

        try {
          // Use RTK Query mutation instead of axiosInstance
          const result = await placeCustomerOrder(orderPayload).unwrap();

          if (result?.success) {
            successCount++;
            if (result.order) {
              placedOrders.push(result.order);
            }
          } else {
            failCount++;
            const errorMsg =
              result?.message || `Failed to place order for ${shop.shopName}`;
            errors.push(errorMsg);
            toast.error(errorMsg);
          }
        } catch (err) {
          console.error('Order error for shop:', shop.shopName, err);
          failCount++;
          const errorMsg =
            err?.data?.message || err?.message || 'Unknown error';
          const errorMessage = `Error placing order for ${shop.shopName}: ${errorMsg}`;
          errors.push(errorMessage);
          toast.error(errorMessage);
        }
      }

      // Handle results - cart will auto-update via RTK Query cache invalidation
      if (successCount > 0 && failCount === 0) {
        toast.success('All orders placed successfully! 🎉');

        // Clear cart - this will invalidate the cache
        await clearCart();
        setShowModal(false);
        navigate('/customer/order');
      } else if (successCount > 0 && failCount > 0) {
        toast.warning(
          `${successCount} order(s) placed successfully, ${failCount} failed. 
          Check your orders for details.`
        );
        setShowModal(false);
        navigate('/customer/order');
      } else {
        toast.error('All orders failed. Please try again.');
        console.error('Order errors:', errors);
        setShowModal(false);
      }
    } catch (error) {
      console.error('Order placement error:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  }, [orderSummary, user, placeCustomerOrder, clearCart, navigate]);

  // Loading states
  if (isCartLoading) {
    return <ComponentLoading />;
  }

  // Empty cart state
  if (!cartItems || cartItems.length === 0) {
    return <CustomerEmptyCart />;
  }

  // Error state
  if (cartError) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-8">
          <h3 className="text-red-600 text-xl font-semibold mb-2">
            Failed to Load Cart
          </h3>
          <p className="text-red-500 mb-4">
            There was an error loading your cart. Please try again.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <CustomerCartHeader
            onClearCart={handleClearCart}
            isUpdating={isUpdating}
          />

          <div className="mb-10 text-center sm:text-left">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent flex items-center justify-center sm:justify-start gap-3">
              <FaShoppingCart className="text-orange-500" />
              My Cart
            </h2>
            <p className="text-gray-500 mt-2">
              {shops.length} {shops.length === 1 ? 'restaurant' : 'restaurants'}{' '}
              • {totalItems} items
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-2/3 space-y-8">
              {shops.map((shop) => (
                <CustomerCartShopSection
                  key={shop.id || shop.shopId}
                  shop={shop}
                  processingItem={processingItem}
                  onQuantityChange={handleQuantityChange}
                  onRemove={handleRemoveItem}
                />
              ))}
            </div>

            <div className="lg:w-1/3">
              <CustomerCartOrderSummaryCard
                totalItems={totalItems}
                subtotal={subtotal}
                totalSavings={totalSavings}
                totalDelivery={totalDelivery}
                grandTotal={grandTotal}
                address={user?.location?.address || 'No address set'}
                onCheckout={handleCheckout}
                isCheckoutDisabled={isOrderPlacing || mutationLoading || isUpdating}
              />
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <CustomerCartConfirmationModal
          orderSummary={orderSummary}
          isPlacingOrder={isOrderPlacing}
          onClose={() => setShowModal(false)}
          onConfirm={placeOrder}
        />
      )}
    </>
  );
};

export default CustomerCart;