import { PlusIcon, SquarePenIcon, XIcon, TicketPercentIcon, ChevronDownIcon } from 'lucide-react';
import React, { useState, useEffect } from 'react'
import AddressModal from './AddressModal';
import { useSelector, useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import { fetchAPI } from '@/lib/api';
import { clearCart } from '@/lib/features/cart/cartSlice';

const OrderSummary = ({ totalPrice, items }) => {

    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$';

    const router = useRouter();

    const [addressList, setAddressList] = useState([]);
    const [paymentMethod, setPaymentMethod] = useState('COD');
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [couponCodeInput, setCouponCodeInput] = useState('');
    const [coupon, setCoupon] = useState('');
    const [availableCoupons, setAvailableCoupons] = useState([]);
    const [showCouponSuggestions, setShowCouponSuggestions] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const { userId, getToken } = useAuth();
    const dispatch = useDispatch();

    const fetchAddresses = async () => {
        if (!userId) return;
        try {
            const addresses = await fetchAPI(`/users/${userId}/addresses`, { getToken });
            setAddressList(addresses || []);
        } catch (error) {
            console.error('Failed to fetch addresses:', error);
        }
    };

    const fetchAvailableCoupons = async () => {
        if (!userId) return;
        try {
            const coupons = await fetchAPI(`/users/${userId}/coupons`, { getToken });
            setAvailableCoupons(coupons || []);
        } catch (error) {
            console.error('Failed to fetch coupons:', error);
        }
    };

    useEffect(() => {
        fetchAddresses();
        fetchAvailableCoupons();
    }, [userId]);

    const handleCouponCode = async (event) => {
        event.preventDefault();
        if (!couponCodeInput.trim()) return;
        // Let the error propagate so toast.promise can catch and display it
        const validatedCoupon = await fetchAPI(`/users/${userId}/validate-coupon`, {
            method: 'POST',
            body: JSON.stringify({ code: couponCodeInput.trim().toUpperCase() }),
            getToken
        });
        setCoupon(validatedCoupon);
        return validatedCoupon;
    }

    const applySuggestedCoupon = (suggestedCoupon) => {
        setCoupon(suggestedCoupon);
        setCouponCodeInput(suggestedCoupon.code);
        toast.success(`Coupon "${suggestedCoupon.code}" applied! ${suggestedCoupon.discount}% off`);
    };

    const handleAddressAdded = (newAddress) => {
        setAddressList([...addressList, newAddress]);
        setSelectedAddress(newAddress);
    };

    const handlePlaceOrder = async (e) => {
        e.preventDefault();

        if (!userId) throw new Error('You must be logged in to place an order');
        if (!selectedAddress || !selectedAddress.id) throw new Error('Please select a shipping address');
        if (items.length === 0) throw new Error('Your cart is empty');

        // Group items by storeId
        const itemsByStore = {};
        items.forEach(item => {
            if (!itemsByStore[item.storeId]) itemsByStore[item.storeId] = [];
            itemsByStore[item.storeId].push({ productId: item.id, quantity: item.quantity, price: item.price });
        });

        // Iterate and create orders per store
        for (const storeId of Object.keys(itemsByStore)) {
            const storeItems = itemsByStore[storeId];
            const storeTotal = storeItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
            const finalStoreTotal = coupon ? storeTotal - (coupon.discount / 100 * storeTotal) : storeTotal;

            await fetchAPI('/orders', {
                method: 'POST',
                body: JSON.stringify({
                    userId,
                    storeId,
                    addressId: selectedAddress.id,
                    paymentMethod,
                    total: finalStoreTotal,
                    items: storeItems,
                    isCouponUsed: !!coupon,
                    coupon: coupon || {}
                }),
                getToken
            });
        }

        dispatch(clearCart());
        setShowSuccessModal(true);
    }

    return (
        <div className='w-full max-w-lg lg:max-w-[340px] bg-slate-50/30 border border-slate-200 text-slate-500 text-sm rounded-xl p-7'>
            <h2 className='text-xl font-medium text-slate-600'>Payment Summary</h2>
            <p className='text-slate-400 text-xs my-4'>Payment Method</p>
            <div className='flex gap-2 items-center'>
                <input type="radio" id="COD" onChange={() => setPaymentMethod('COD')} checked={paymentMethod === 'COD'} className='accent-gray-500' />
                <label htmlFor="COD" className='cursor-pointer'>COD</label>
            </div>
            <div className='flex gap-2 items-center mt-1'>
                <input type="radio" id="STRIPE" name='payment' onChange={() => setPaymentMethod('STRIPE')} checked={paymentMethod === 'STRIPE'} className='accent-gray-500' />
                <label htmlFor="STRIPE" className='cursor-pointer'>Stripe Payment</label>
            </div>
            <div className='my-4 py-4 border-y border-slate-200 text-slate-400'>
                <p>Address</p>
                {
                    selectedAddress ? (
                        <div className='flex gap-2 items-center'>
                            <p>{selectedAddress.name}, {selectedAddress.city}, {selectedAddress.state}, {selectedAddress.zip}</p>
                            <SquarePenIcon onClick={() => setSelectedAddress(null)} className='cursor-pointer' size={18} />
                        </div>
                    ) : (
                        <div>
                            {
                                addressList.length > 0 && (
                                    <select className='border border-slate-400 p-2 w-full my-3 outline-none rounded' onChange={(e) => setSelectedAddress(addressList[e.target.value])} >
                                        <option value="">Select Address</option>
                                        {
                                            addressList.map((address, index) => (
                                                <option key={index} value={index}>{address.name}, {address.city}, {address.state}, {address.zip}</option>
                                            ))
                                        }
                                    </select>
                                )
                            }
                            <button className='flex items-center gap-1 text-slate-600 mt-1' onClick={() => setShowAddressModal(true)} >Add Address <PlusIcon size={18} /></button>
                        </div>
                    )
                }
            </div>
            <div className='pb-4 border-b border-slate-200'>
                <div className='flex justify-between'>
                    <div className='flex flex-col gap-1 text-slate-400'>
                        <p>Subtotal:</p>
                        <p>Shipping:</p>
                        {coupon && <p>Coupon:</p>}
                    </div>
                    <div className='flex flex-col gap-1 font-medium text-right'>
                        <p>{currency}{totalPrice.toLocaleString()}</p>
                        <p>Free</p>
                        {coupon && <p>{`-${currency}${(coupon.discount / 100 * totalPrice).toFixed(2)}`}</p>}
                    </div>
                </div>
                {
                    !coupon ? (
                        <div className='relative'>
                            <form onSubmit={e => toast.promise(handleCouponCode(e), {
                            loading: 'Checking coupon...',
                            success: (c) => `Coupon "${c?.code}" applied! ${c?.discount}% off`,
                            error: (err) => err?.message || 'Invalid coupon code'
                        })} className='flex justify-center gap-3 mt-3'>
                                <input list="coupon-suggestions" onChange={(e) => setCouponCodeInput(e.target.value)} value={couponCodeInput} type="text" placeholder='Coupon Code' className='border border-slate-400 p-1.5 rounded w-full outline-none' />
                                <datalist id="coupon-suggestions">
                                    {availableCoupons.map((c) => (
                                        <option key={c.code} value={c.code}>{c.description} ({c.discount}% OFF)</option>
                                    ))}
                                </datalist>
                                <button className='bg-slate-600 text-white px-3 rounded hover:bg-slate-800 active:scale-95 transition-all'>Apply</button>
                            </form>
                        </div>
                    ) : (
                        <div className='w-full flex items-center justify-center gap-2 text-xs mt-2'>
                            <p>Code: <span className='font-semibold ml-1'>{coupon.code.toUpperCase()}</span></p>
                            <p>{coupon.description}</p>
                            <XIcon size={18} onClick={() => setCoupon('')} className='hover:text-red-700 transition cursor-pointer' />
                        </div>
                    )
                }
            </div>
            <div className='flex justify-between py-4'>
                <p>Total:</p>
                <div className='text-right'>
                    {coupon ? (
                        <>
                            <span className='text-sm text-slate-400 line-through mr-2'>{currency}{totalPrice.toLocaleString()}</span>
                            <span className='font-medium text-green-600'>{currency}{(totalPrice - (coupon.discount / 100 * totalPrice)).toFixed(2)}</span>
                        </>
                    ) : (
                        <span className='font-medium'>{currency}{totalPrice.toLocaleString()}</span>
                    )}
                </div>
            </div>
            <button onClick={e => toast.promise(handlePlaceOrder(e), {
                loading: 'Placing order...',
                success: 'Order placed successfully! 🎉',
                error: (err) => err?.message || 'Failed to place order'
            })} className='w-full bg-slate-700 text-white py-2.5 rounded hover:bg-slate-900 active:scale-95 transition-all'>Place Order</button>

            {showAddressModal && <AddressModal setShowAddressModal={setShowAddressModal} onAddressAdded={handleAddressAdded} />}

            {showSuccessModal && (
                <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm'>
                    <div className='bg-white p-8 rounded-xl shadow-xl w-96 relative flex flex-col items-center text-center'>
                        <div className='w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4'>
                            <svg className='w-8 h-8' fill='none' stroke='currentColor' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' /></svg>
                        </div>
                        <h2 className='text-2xl font-bold text-slate-800 mb-2'>Order Placed!</h2>
                        <p className='text-slate-500 mb-6'>Your order has been placed successfully. You will receive an email confirmation shortly.</p>
                        <div className='flex flex-col w-full gap-3'>
                            <button onClick={() => router.push('/orders')} className='w-full bg-green-500 text-white py-2.5 rounded font-medium hover:bg-green-600 transition'>
                                View My Orders
                            </button>
                            <button onClick={() => router.push('/')} className='w-full bg-slate-100 text-slate-700 py-2.5 rounded font-medium hover:bg-slate-200 transition'>
                                Continue Shopping
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    )
}

export default OrderSummary