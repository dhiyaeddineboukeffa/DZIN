import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingBag, Truck, ShieldCheck } from 'lucide-react';
import Button from '../components/Button';
import { useCart } from '../context/CartContext';
import { mockDatabase } from '../services/mockDatabase';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();

    const [product, setProduct] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedSize, setSelectedSize] = useState(null);

    useEffect(() => {
        const loadProduct = async () => {
            try {
                const data = await mockDatabase.getProductById(id);
                if (!data) {
                    navigate('/shop'); // Redirect if not found
                    return;
                }
                setProduct(data);
            } catch (error) {
                console.error('Failed to load product', error);
            } finally {
                setIsLoading(false);
            }
        };
        loadProduct();
    }, [id, navigate]);

    const handleAddToCart = () => {
        if (!selectedSize) return;
        addToCart(product, selectedSize);
    };

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-20 flex justify-center">
                <div className="animate-pulse text-emerald-500 font-mono">LOADING DATA...</div>
            </div>
        );
    }

    if (!product) return null;

    return (
        <div className="container mx-auto px-4 py-8 sm:py-12 pb-24 sm:pb-12">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center text-neutral-600 dark:text-neutral-400 hover:text-emerald-600 dark:hover:text-white mb-6 sm:mb-8 transition-colors min-h-[44px]"
            >
                <ArrowLeft size={20} className="mr-2" /> BACK TO DROPS
            </button>

            <div className="grid md:grid-cols-2 gap-8 sm:gap-12 lg:gap-20">
                {/* Image Section */}
                <div className="relative aspect-[4/5] bg-neutral-100 dark:bg-neutral-900 overflow-hidden border border-neutral-200 dark:border-neutral-800">
                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-4 left-4 bg-white/80 dark:bg-black/80 backdrop-blur px-3 py-1 border border-emerald-500/30">
                        <span className="text-emerald-600 dark:text-emerald-500 font-mono text-xs">DZIN AUTHENTIC</span>
                    </div>
                </div>

                {/* Details Section */}
                <div className="flex flex-col justify-center">
                    <div className="mb-2">
                        <span className="text-emerald-600 dark:text-emerald-500 font-mono text-xs sm:text-sm tracking-widest uppercase">{product.category}</span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter mb-3 sm:mb-4 leading-none text-neutral-900 dark:text-white">
                        {product.name}
                    </h1>
                    <p className="text-xl sm:text-2xl font-mono text-neutral-900 dark:text-white mb-6 sm:mb-8">
                        {product.price.toLocaleString()} DZD
                    </p>

                    <div className="prose prose-invert mb-6 sm:mb-8 text-neutral-600 dark:text-neutral-400">
                        <p>{product.description}</p>
                    </div>

                    {/* Size Selector */}
                    <div className="mb-6 sm:mb-8">
                        <div className="flex justify-between mb-3">
                            <span className="font-bold text-sm text-neutral-900 dark:text-white">SELECT SIZE</span>
                            <button className="text-xs text-neutral-500 dark:text-neutral-400 underline hover:text-emerald-600 dark:hover:text-white min-h-[44px] flex items-center">Size Guide</button>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            {product.sizes.map((size) => (
                                <button
                                    key={size}
                                    onClick={() => setSelectedSize(size)}
                                    className={`w-14 h-14 sm:w-12 sm:h-12 flex items-center justify-center border font-mono transition-all duration-200 text-base sm:text-sm ${selectedSize === size
                                        ? 'bg-neutral-900 dark:bg-white text-white dark:text-black border-neutral-900 dark:border-white'
                                        : 'bg-white dark:bg-transparent text-neutral-900 dark:text-neutral-400 border-neutral-200 dark:border-neutral-800 hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-white'
                                        }`}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                        {!selectedSize && (
                            <p className="text-red-500 text-xs mt-2 animate-pulse">Please select a size</p>
                        )}
                    </div>

                    {/* Actions - Desktop */}
                    <div className="space-y-4 hidden md:block">
                        <Button
                            size="lg"
                            className="w-full min-h-[48px]"
                            onClick={() => navigate(`/order/${product._id}`)}
                            disabled={!product.inStock}
                        >
                            {product.inStock ? 'ORDER NOW' : 'SOLD OUT'}
                        </Button>
                    </div>

                    {/* Trust Indicators */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-neutral-200 dark:border-neutral-900">
                        <div className="flex items-center gap-3 text-neutral-600 dark:text-neutral-400">
                            <Truck size={20} className="text-emerald-600 dark:text-emerald-500 flex-shrink-0" />
                            <span className="text-sm">Fast Delivery (58 Wilayas)</span>
                        </div>
                        <div className="flex items-center gap-3 text-neutral-600 dark:text-neutral-400">
                            <ShieldCheck size={20} className="text-emerald-600 dark:text-emerald-500 flex-shrink-0" />
                            <span className="text-sm">Premium Quality Guarantee</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sticky Action Button - Mobile Only */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-stone-50/95 dark:bg-neutral-950/95 backdrop-blur-md border-t border-neutral-200 dark:border-neutral-800 z-30">
                <Button
                    size="lg"
                    className="w-full min-h-[52px]"
                    onClick={() => navigate(`/order/${product._id}`)}
                    disabled={!product.inStock}
                >
                    {product.inStock ? 'ORDER NOW' : 'SOLD OUT'}
                </Button>
            </div>
        </div>
    );
};

export default ProductDetails;
