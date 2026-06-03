// CustomerCart.jsx - Main Component
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';

import { axiosInstance } from '../../../Config/axios';
import { FaShoppingCart } from 'react-icons/fa';
// Components
import CustomerCartSkeletonLoader from './CustomerCartSkeletonLoader';
import CustomerEmptyCart from './CustomerEmptyCart';
import CustomerCartHeader from './CustomerCartHeader';
import CustomerCartShopSection from './CustomerCartShopSection';
import CustomerCartOrderSummaryCard from './CustomerCartOrderSummaryCard';
import CustomerCartConfirmationModal from './CustomerCartConfirmationModal';
import ComponentLoading from "../../ComponentLoading"
// utils
import {
  groupItemsByShop,
  calculateCartTotals,
  prepareOrderSummary,
  formatPKR,
} from '../../../utils/cartUtils';
import { addOrder } from '../../../Store/user/user.item.slice';
import useCart from '../../../hooks/useCart';
const CustomerCart = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    cartItems,
    loading,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartSummary,
  } = useCart();
  const { user } = useSelector((state) => state.auth);

  const [processingItem, setProcessingItem] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderSummary, setOrderSummary] = useState(null);

  const { totalItems } = getCartSummary();
  const shops = groupItemsByShop(cartItems);
  const totals = calculateCartTotals(shops);
  const { subtotal, totalSavings, totalDelivery, grandTotal } = totals;

  const validateMinOrders = () => {
    const invalid = shops.find((shop) => shop.subtotal < shop.minOrder);
    if (invalid) {
      toast.error(
        `${invalid.name} requires minimum order of ${formatPKR(
          invalid.minOrder
        )} PKR`
      );
      return false;
    }
    return true;
  };

  const handleQuantityChange = (itemId, delta, e) => {
    e.stopPropagation();
    setProcessingItem(itemId);
    updateQuantity(itemId, delta, false);
    setTimeout(() => setProcessingItem(null), 300);
  };

  const handleRemoveItem = (itemId, itemName, quantity, e) => {
    e.stopPropagation();
    if (quantity > 1 && !window.confirm(`Remove ${itemName} from cart?`))
      return;

    setProcessingItem(itemId);
    removeFromCart(itemId, true);
    setTimeout(() => setProcessingItem(null), 300);
    toast.info(`${itemName} removed from cart`);
  };

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your entire cart?')) {
      clearCart();
      toast.success('Cart cleared successfully');
    }
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast.error('Your cart is empty. Add some delicious items first!');
      return;
    }
    if (!validateMinOrders()) return;

    const summary = prepareOrderSummary(shops, totals, totalItems);
    setOrderSummary(summary);
    setShowModal(true);
  };

  const placeOrder = async () => {
    if (!orderSummary?.shops?.length) return;

    setIsPlacingOrder(true);
    let successCount = 0;
    let failCount = 0;

    try {
      for (const shop of orderSummary.shops) {
        const orderPayload = {
          shop: shop.shopId,
          totalAmount: shop.total,
          totalSavings: shop.savings,
          items: shop.items.map((item) => ({
            item: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            total: item.total,
            picture: item.picture,
          })),
          status: 'pending',
          deliveryLocation: user.location,
        };

        try {
          const res = await axiosInstance.post('/user/order', orderPayload);
          if (res.data?.success) {
            successCount++;
            res.data.order && dispatch(addOrder(res.data.order));
          } else {
            failCount++;
          }
        } catch (err) {
          console.log(err);
          failCount++;
        }
      }

      if (successCount > 0 && failCount === 0) {
        toast.success('All orders placed successfully!');

        setTimeout(() => {
          navigate('/customer/order');
          clearCart();
          setShowModal(false);
        }, 3000);
      } else if (successCount > 0) {
        toast.warning(
          `${successCount} order(s) placed successfully, ${failCount} failed.`
        );
      } else {
        toast.error('All orders failed. Please try again.');
      }
    } catch (error) {
      console.error('Order error:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <ComponentLoading />
      </div>
    );
  }

  if (cartItems.length === 0) {
    return <CustomerEmptyCart />;
  }
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });

  return (
    <>
      <div className="min-h-screen ">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <CustomerCartHeader
            totalItems={totalItems}
            onClearCart={handleClearCart}
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
                  key={shop.id}
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
                address={user.location.address}
                onCheckout={handleCheckout}
              />
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <CustomerCartConfirmationModal
          orderSummary={orderSummary}
          isPlacingOrder={isPlacingOrder}
          onClose={() => setShowModal(false)}
          onConfirm={placeOrder}
        />
      )}
    </>
  );
};

export default CustomerCart;
