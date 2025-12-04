import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { api } from '../services/api';
import Button from '../components/Button';

const Checkout = () => {
    const { cart, cartTotal, clearCart } = useCart();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [wilayas, setWilayas] = useState([]);
    const [selectedWilayaObj, setSelectedWilayaObj] = useState(null);

    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        wilaya: '',
        commune: '',
        address: '',
        ageGroup: ''
    });

    // Coupon State
    const [couponCode, setCouponCode] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [couponError, setCouponError] = useState('');

    useEffect(() => {
        const loadWilayas = async () => {
            try {
                const data = await api.getWilayas();
                setWilayas(data);
            } catch (error) {
                console.error('Failed to load wilayas', error);
            }
        };
        loadWilayas();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleWilayaChange = (e) => {
        const wilayaName = e.target.value;
        const wilayaObj = wilayas.find(w => w.name === wilayaName);
        setSelectedWilayaObj(wilayaObj);
        setFormData({
            ...formData,
            wilaya: wilayaName,
            commune: ''
        });
    };

    const handleApplyCoupon = async () => {
        if (!couponCode.trim()) return;

        setCouponError('');
        try {
            const coupon = await api.validateCoupon(couponCode);
            setAppliedCoupon(coupon);
            setCouponError('');
        } catch (error) {
            setCouponError(error.message);
            setAppliedCoupon(null);
        }
    };

    const handleRemoveCoupon = () => {
        setAppliedCoupon(null);
        setCouponCode('');
        setCouponError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const deliveryFee = selectedWilayaObj ? selectedWilayaObj.deliveryFee : 0;

            let couponDiscount = 0;
            if (appliedCoupon) {
                if (appliedCoupon.discountType === 'percentage') {
                    couponDiscount = Math.round(cartTotal * (appliedCoupon.discountValue / 100));
                } else {
                    couponDiscount = appliedCoupon.discountValue;
                }
            }

            const finalTotal = cartTotal + deliveryFee - couponDiscount;

            const orderData = {
                customer: formData,
                items: cart,
                subtotal: cartTotal,
                deliveryFee: deliveryFee,
                coupon: appliedCoupon ? { code: appliedCoupon.code, discount: couponDiscount } : null,
                total: finalTotal,
                date: new Date().toISOString(),
                status: 'Pending'
            };

            const response = await api.createOrder(orderData);

            if (response.success) {
                clearCart();
                alert(`Order Placed Successfully! Order ID: ${response.orderId}`);
                navigate('/');
            }
        } catch (error) {
            console.error('Checkout failed', error);
            alert('Failed to place order. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if (cart.length === 0) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <h2 className="text-2xl font-bold mb-4 text-neutral-900 dark:text-white">YOUR CART IS EMPTY</h2>
                <Button onClick={() => navigate('/shop')}>GO SHOPPING</Button>
            </div>
        );
    }

    const deliveryFee = selectedWilayaObj ? selectedWilayaObj.deliveryFee : 0;

    let couponDiscount = 0;
    if (appliedCoupon) {
        if (appliedCoupon.discountType === 'percentage') {
            couponDiscount = Math.round(cartTotal * (appliedCoupon.discountValue / 100));
        } else {
            couponDiscount = appliedCoupon.discountValue;
        }
    }

    const finalTotal = cartTotal + deliveryFee - couponDiscount;

    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-3xl font-black tracking-tighter mb-8 text-neutral-900 dark:text-white">CHECKOUT</h1>

            <div className="grid md:grid-cols-2 gap-12">
                <div>
                    <h2 className="text-xl font-bold mb-6 text-emerald-600 dark:text-emerald-500">SHIPPING DETAILS</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-mono text-neutral-600 dark:text-neutral-400 mb-1">FULL NAME</label>
                            <input
                                type="text"
                                name="fullName"
                                required
                                className="w-full bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-3 text-neutral-900 dark:text-white focus:border-emerald-500 focus:outline-none transition-colors"
                                value={formData.fullName}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-mono text-neutral-600 dark:text-neutral-400 mb-1">PHONE NUMBER</label>
                            <input
                                type="tel"
                                name="phone"
                                required
                                className="w-full bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-3 text-neutral-900 dark:text-white focus:border-emerald-500 focus:outline-none transition-colors"
                                value={formData.phone}
                                onChange={(e) => {
                                    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                                    setFormData({ ...formData, phone: val });
                                }}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-mono text-neutral-600 dark:text-neutral-400 mb-1">AGE GROUP</label>
                            <select
                                name="ageGroup"
                                required
                                className="w-full bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-3 text-neutral-900 dark:text-white focus:border-emerald-500 focus:outline-none transition-colors appearance-none"
                                value={formData.ageGroup}
                                onChange={handleChange}
                            >
                                <option value="">Select Age Group</option>
                                <option value="Under 18">Under 18</option>
                                <option value="18-24">18-24</option>
                                <option value="25-34">25-34</option>
                                <option value="35-44">35-44</option>
                                <option value="45-54">45-54</option>
                                <option value="55+">55+</option>
                            </select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-mono text-neutral-600 dark:text-neutral-400 mb-1">WILAYA</label>
                                <select
                                    name="wilaya"
                                    required
                                    className="w-full bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-3 text-neutral-900 dark:text-white focus:border-emerald-500 focus:outline-none transition-colors appearance-none"
                                    value={formData.wilaya}
                                    onChange={handleWilayaChange}
                                >
                                    <option value="">Select Wilaya</option>
                                    {wilayas.map(w => (
                                        <option key={w.code} value={w.name}>{w.code} - {w.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-mono text-neutral-600 dark:text-neutral-400 mb-1">COMMUNE</label>
                                <select
                                    name="commune"
                                    required
                                    disabled={!selectedWilayaObj}
                                    className="w-full bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-3 text-neutral-900 dark:text-white focus:border-emerald-500 focus:outline-none transition-colors appearance-none disabled:opacity-50"
                                    value={formData.commune}
                                    onChange={handleChange}
                                >
                                    <option value="">Select Commune</option>
                                    {selectedWilayaObj?.communes?.map(c => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-mono text-neutral-600 dark:text-neutral-400 mb-1">FULL ADDRESS</label>
                            <textarea
                                name="address"
                                required
                                rows="3"
                                className="w-full bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-3 text-neutral-900 dark:text-white focus:border-emerald-500 focus:outline-none transition-colors"
                                value={formData.address}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="bg-neutral-50 dark:bg-neutral-900/50 p-4 border border-neutral-200 dark:border-neutral-800 rounded mb-6">
                            <h3 className="text-sm font-bold mb-3 text-neutral-900 dark:text-white">HAVE A PROMO CODE?</h3>
                            {!appliedCoupon ? (
                                <div className="space-y-2">
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            placeholder="Enter code"
                                            className="flex-1 bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 p-2 text-sm text-neutral-900 dark:text-white focus:border-emerald-500 focus:outline-none uppercase font-mono"
                                            value={couponCode}
                                            onChange={(e) => setCouponCode(e.target.value)}
                                        />
                                        <Button
                                            type="button"
                                            onClick={handleApplyCoupon}
                                            variant="primary"
                                            size="sm"
                                        >
                                            APPLY
                                        </Button>
                                    </div>
                                    {couponError && (
                                        <p className="text-xs text-red-500 font-mono">{couponError}</p>
                                    )}
                                </div>
                            ) : (
                                <div className="flex items-center justify-between bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-500 p-3 rounded">
                                    <div>
                                        <p className="text-sm font-mono text-emerald-600 dark:text-emerald-500 font-bold">{appliedCoupon.code}</p>
                                        <p className="text-xs text-neutral-600 dark:text-neutral-400 font-mono">
                                            {appliedCoupon.discountType === 'percentage' ? `${appliedCoupon.discountValue}% off` : `${appliedCoupon.discountValue} DZD off`}
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleRemoveCoupon}
                                        className="text-xs text-red-500 hover:text-red-600 font-bold px-2 py-1 border border-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                    >
                                        REMOVE
                                    </button>
                                </div>
                            )}
                        </div>

                        <Button
                            type="submit"
                            className="w-full mt-8"
                            size="lg"
                            isLoading={isLoading}
                        >
                            CONFIRM ORDER - {finalTotal.toLocaleString()} DZD
                        </Button>
                    </form>


                </div>

                <div className="bg-white dark:bg-neutral-900 p-6 h-fit border border-neutral-200 dark:border-neutral-800 sticky top-24">
                    <h2 className="text-xl font-bold mb-6 text-emerald-600 dark:text-emerald-500">ORDER SUMMARY</h2>
                    <div className="space-y-4 mb-6">
                        {cart.map((item) => (
                            <div key={`${item._id}-${item.size}`} className="flex justify-between items-start text-neutral-900 dark:text-white">
                                <div>
                                    <p className="font-bold text-sm">{item.name}</p>
                                    <p className="text-xs text-neutral-500 dark:text-neutral-400 font-mono">Size: {item.size} x {item.quantity}</p>
                                </div>
                                <p className="font-mono text-sm">{(item.price * item.quantity).toLocaleString()} DZD</p>
                            </div>
                        ))}
                    </div>

                    <div className="border-t border-neutral-200 dark:border-neutral-800 pt-4 space-y-2">
                        <div className="flex justify-between text-sm text-neutral-600 dark:text-neutral-400">
                            <span>Subtotal</span>
                            <span>{cartTotal.toLocaleString()} DZD</span>
                        </div>
                        <div className="flex justify-between text-sm text-neutral-600 dark:text-neutral-400">
                            <span>Delivery ({formData.wilaya || 'Select Wilaya'})</span>
                            <span>{deliveryFee.toLocaleString()} DZD</span>
                        </div>
                        {appliedCoupon && (
                            <div className="flex justify-between text-sm text-emerald-600 dark:text-emerald-500">
                                <span>Discount ({appliedCoupon.code})</span>
                                <span>-{couponDiscount.toLocaleString()} DZD</span>
                            </div>
                        )}
                        <div className="flex justify-between items-center font-bold text-lg text-neutral-900 dark:text-white pt-2 border-t border-neutral-200 dark:border-neutral-800 mt-2">
                            <span>TOTAL</span>
                            <span className="text-emerald-600 dark:text-emerald-500">{finalTotal.toLocaleString()} DZD</span>
                        </div>
                    </div>

                    <div className="mt-6 text-xs text-neutral-500 text-center">
                        Payment on Delivery (Cash Only)
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
