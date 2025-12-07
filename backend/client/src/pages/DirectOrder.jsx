import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import Button from '../components/Button';
import { ArrowLeft, CheckCircle, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';

const DirectOrder = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [wilayas, setWilayas] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Fallback if images array is empty but image string exists (handling potential merged strings)
    let displayImages = product?.images?.length > 0 ? product.images : [];
    if (displayImages.length === 0 && product?.image) {
        // Check if the single image field actually contains multiple URLs
        if (product.image.includes('\n') || product.image.includes(',')) {
            displayImages = product.image.split(/[\n,]+/).map(url => url.trim()).filter(url => url.length > 0);
        } else {
            displayImages = [product.image];
        }
    }

    const nextImage = () => {
        if (displayImages.length > 1) {
            setCurrentImageIndex((prev) => (prev + 1) % displayImages.length);
        }
    };

    const prevImage = () => {
        if (displayImages.length > 1) {
            setCurrentImageIndex((prev) => (prev === 0 ? displayImages.length - 1 : prev - 1));
        }
    };

    // Swipe Support
    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);
    const minSwipeDistance = 50;

    const onTouchStart = (e) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;
        if (isLeftSwipe) {
            nextImage();
        }
        if (isRightSwipe) {
            prevImage();
        }
    };

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        wilaya: '',
        commune: '',
        address: '',
        size: ''
    });

    const [selectedWilayaObj, setSelectedWilayaObj] = useState(null);

    // Coupon State
    const [couponCode, setCouponCode] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [couponError, setCouponError] = useState('');

    useEffect(() => {
        const loadData = async () => {
            try {
                const [productData, wilayasData] = await Promise.all([
                    api.getProductById(id),
                    api.getWilayas()
                ]);
                setProduct(productData);
                setWilayas(wilayasData);
                // Default size if available
                if (productData.sizes && productData.sizes.length > 0) {
                    setFormData(prev => ({ ...prev, size: productData.sizes[0] }));
                }
            } catch (error) {
                console.error('Failed to load data', error);
                setError(error);
                // alert('Failed to load product details'); // Removed alert to show UI error
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, [id, navigate]);

    const handleWilayaChange = (e) => {
        const wilayaName = e.target.value;
        const wilayaObj = wilayas.find(w => w.name === wilayaName);
        setSelectedWilayaObj(wilayaObj);
        setFormData({
            ...formData,
            wilaya: wilayaName,
            commune: '' // Reset commune when wilaya changes
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

        // Validation
        if (!formData.phone.match(/^\d{10}$/)) {
            alert('Phone number must be exactly 10 digits');
            return;
        }
        if (!formData.wilaya) {
            alert('Please select a Wilaya');
            return;
        }
        if (!formData.commune) {
            alert('Please select a Commune');
            return;
        }

        setIsSubmitting(true);

        try {
            const finalProductPrice = product.discountPrice && product.discountPrice < product.price ? product.discountPrice : product.price;
            const deliveryFee = selectedWilayaObj?.deliveryFee || 0;
            let couponDiscount = 0;
            if (appliedCoupon) {
                if (appliedCoupon.discountType === 'percentage') {
                    couponDiscount = Math.round(finalProductPrice * (appliedCoupon.discountValue / 100));
                } else {
                    couponDiscount = appliedCoupon.discountValue;
                }
            }
            const totalAmount = finalProductPrice + deliveryFee - couponDiscount;

            const orderData = {
                customer: {
                    fullName: formData.name || 'Guest',
                    phone: formData.phone,
                    wilaya: formData.wilaya,
                    commune: formData.commune,
                    address: formData.address || `${formData.commune}, ${formData.wilaya}`,
                    ageGroup: '18-24' // Default or add field
                },
                items: [{
                    productId: product._id,
                    name: product.name,
                    price: finalProductPrice,
                    size: formData.size,
                    quantity: 1,
                    image: product.image
                }],
                subtotal: finalProductPrice,
                deliveryFee: deliveryFee,
                coupon: appliedCoupon ? { code: appliedCoupon.code, discount: couponDiscount } : null,
                totalAmount: totalAmount,
                paymentMethod: 'Cash on Delivery'
            };

            await api.createOrder(orderData);
            alert('Order placed successfully!');
            navigate('/');
        } catch (error) {
            console.error('Order failed', error);
            alert('Failed to place order. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) return <div className="min-h-screen bg-neutral-950 flex items-center justify-center text-emerald-500">LOADING...</div>;

    if (!product) return (
        <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center text-white">
            <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
            <p className="text-red-500 mb-4">Error: {error ? error.message : 'Unknown error'}</p>
            <p className="text-neutral-400 mb-4 text-sm">ID: {id}</p>
            <Button onClick={() => navigate('/shop')}>RETURN TO SHOP</Button>
        </div>
    );

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white pt-24 pb-12 px-4 transition-colors duration-300">
            <div className="max-w-4xl mx-auto">
                <button onClick={() => navigate(-1)} className="flex items-center text-neutral-600 dark:text-neutral-400 hover:text-emerald-600 dark:hover:text-white mb-8 transition-colors">
                    <ArrowLeft size={20} className="mr-2" /> BACK
                </button>

                <div className="grid md:grid-cols-2 gap-12">
                    {/* Product Summary */}
                    <div>
                        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 sticky top-24 transition-colors duration-300">
                            <div
                                className="relative aspect-square mb-6 bg-neutral-100 dark:bg-neutral-800 overflow-hidden group touch-pan-y"
                                onTouchStart={onTouchStart}
                                onTouchMove={onTouchMove}
                                onTouchEnd={onTouchEnd}
                            >
                                {displayImages.length > 0 && (
                                    <img
                                        src={displayImages[currentImageIndex]}
                                        alt={`${product.name} - View ${currentImageIndex + 1}`}
                                        className="w-full h-full object-cover transition-transform duration-500 select-none"
                                    />
                                )}

                                {/* Navigation Arrows */}
                                {displayImages.length > 1 && (
                                    <>
                                        <button
                                            onClick={(e) => { e.preventDefault(); prevImage(); }}
                                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
                                        >
                                            <ChevronLeft size={20} />
                                        </button>
                                        <button
                                            onClick={(e) => { e.preventDefault(); nextImage(); }}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
                                        >
                                            <ChevronRight size={20} />
                                        </button>

                                        {/* Dots Indicator */}
                                        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                                            {displayImages.map((_, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => setCurrentImageIndex(idx)}
                                                    className={`w-2 h-2 rounded-full transition-all ${currentImageIndex === idx ? 'bg-white w-4' : 'bg-white/50 hover:bg-white/80'
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                            <h2 className="text-2xl font-bold mb-2 text-neutral-900 dark:text-white">{product.name}</h2>
                            {product.discountPrice && product.discountPrice < product.price ? (
                                <div className="flex items-center gap-3 mb-4">
                                    <p className="text-neutral-500 dark:text-neutral-400 font-mono text-lg line-through">{product.price.toLocaleString()} DZD</p>
                                    <p className="text-emerald-600 dark:text-emerald-500 font-mono text-xl font-bold">{product.discountPrice.toLocaleString()} DZD</p>
                                </div>
                            ) : (
                                <p className="text-emerald-600 dark:text-emerald-500 font-mono text-xl mb-4">{product.price.toLocaleString()} DZD</p>
                            )}

                            <div className="mb-6 text-sm text-neutral-600 dark:text-neutral-400 prose prose-sm dark:prose-invert">
                                <p>{product.description}</p>
                            </div>

                            <div className="border-t border-neutral-200 dark:border-neutral-800 pt-4 mt-4 space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span>{(product.discountPrice && product.discountPrice < product.price ? product.discountPrice : product.price).toLocaleString()} DZD</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Delivery ({formData.wilaya || 'Select Wilaya'})</span>
                                    <span>{selectedWilayaObj ? selectedWilayaObj.deliveryFee : 0} DZD</span>
                                </div>
                                <div className="flex justify-between text-neutral-900 dark:text-white font-bold text-lg pt-2 border-t border-neutral-200 dark:border-neutral-800 mt-2">
                                    <span>Total</span>
                                    <span>{((product.discountPrice && product.discountPrice < product.price ? product.discountPrice : product.price) + (selectedWilayaObj?.deliveryFee || 0)).toLocaleString()} DZD</span>
                                </div>
                            </div>
                            {appliedCoupon && (
                                <div className="flex justify-between text-emerald-600 dark:text-emerald-500 text-sm mt-2">
                                    <span>Discount ({appliedCoupon.code})</span>
                                    <span>
                                        -{appliedCoupon.discountType === 'percentage'
                                            ? Math.round((product.discountPrice && product.discountPrice < product.price ? product.discountPrice : product.price) * (appliedCoupon.discountValue / 100)).toLocaleString()
                                            : appliedCoupon.discountValue.toLocaleString()} DZD
                                    </span>
                                </div>
                            )}
                            <div className="flex justify-between text-neutral-900 dark:text-white font-bold text-lg pt-2 border-t border-neutral-200 dark:border-neutral-800 mt-2">
                                <span>Total</span>
                                <span>
                                    {((product.discountPrice && product.discountPrice < product.price ? product.discountPrice : product.price) + (selectedWilayaObj?.deliveryFee || 0) - (appliedCoupon
                                        ? (appliedCoupon.discountType === 'percentage'
                                            ? Math.round((product.discountPrice && product.discountPrice < product.price ? product.discountPrice : product.price) * (appliedCoupon.discountValue / 100))
                                            : appliedCoupon.discountValue)
                                        : 0)).toLocaleString()} DZD
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Order Form */}
                    <div>
                        <h1 className="text-3xl font-black tracking-tighter mb-8 text-neutral-900 dark:text-white">COMPLETE YOUR ORDER</h1>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-neutral-600 dark:text-neutral-400 mb-2">FULL NAME (OPTIONAL)</label>
                                <input
                                    type="text"
                                    className="w-full bg-neutral-100 dark:bg-black border border-neutral-200 dark:border-neutral-800 p-4 text-neutral-900 dark:text-white focus:border-emerald-500 outline-none transition-colors"
                                    placeholder="Enter your name"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-emerald-600 dark:text-emerald-500 mb-2">PHONE NUMBER (REQUIRED)</label>
                                <input
                                    type="tel"
                                    required
                                    className="w-full bg-neutral-100 dark:bg-black border border-emerald-500/50 p-4 text-neutral-900 dark:text-white focus:border-emerald-500 outline-none transition-colors"
                                    placeholder="0555..."
                                    value={formData.phone}
                                    onChange={e => {
                                        const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                                        setFormData({ ...formData, phone: val });
                                    }}
                                />
                                <p className="text-xs text-neutral-500 mt-1">Must be 10 digits</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-neutral-600 dark:text-neutral-400 mb-2">WILAYA</label>
                                    <select
                                        required
                                        className="w-full bg-neutral-100 dark:bg-black border border-neutral-200 dark:border-neutral-800 p-4 text-neutral-900 dark:text-white focus:border-emerald-500 outline-none appearance-none"
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
                                    <label className="block text-sm font-bold text-neutral-600 dark:text-neutral-400 mb-2">COMMUNE</label>
                                    <select
                                        required
                                        disabled={!selectedWilayaObj}
                                        className="w-full bg-neutral-100 dark:bg-black border border-neutral-200 dark:border-neutral-800 p-4 text-neutral-900 dark:text-white focus:border-emerald-500 outline-none appearance-none disabled:opacity-50"
                                        value={formData.commune}
                                        onChange={e => setFormData({ ...formData, commune: e.target.value })}
                                    >
                                        <option value="">Select Commune</option>
                                        {selectedWilayaObj?.communes?.map(c => (
                                            <option key={c} value={c}>{c}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-neutral-600 dark:text-neutral-400 mb-2">ADDRESS (OPTIONAL)</label>
                                <textarea
                                    rows="2"
                                    className="w-full bg-neutral-100 dark:bg-black border border-neutral-200 dark:border-neutral-800 p-4 text-neutral-900 dark:text-white focus:border-emerald-500 outline-none transition-colors"
                                    placeholder="Street address, building, etc."
                                    value={formData.address}
                                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-neutral-600 dark:text-neutral-400 mb-2">SIZE</label>
                                <div className="grid grid-cols-4 gap-2">
                                    {product.sizes.map(size => (
                                        <button
                                            key={size}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, size })}
                                            className={`p-3 border ${formData.size === size ? 'bg-neutral-900 dark:bg-white text-white dark:text-black border-neutral-900 dark:border-white' : 'border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:border-neutral-400 dark:hover:border-neutral-600'} transition-all font-bold`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
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
                                className="w-full py-4 text-lg"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'PROCESSING...' : 'CONFIRM ORDER'}
                            </Button>
                            <p className="text-center text-xs text-neutral-500">
                                Payment is Cash on Delivery. You will receive a confirmation call.
                            </p>
                        </form>
                    </div>
                </div>
            </div >
        </div >
    );
};

export default DirectOrder;
