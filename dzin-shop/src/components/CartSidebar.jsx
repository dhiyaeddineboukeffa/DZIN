import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Plus, Minus, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import Button from './Button';

const CartSidebar = () => {
    const navigate = useNavigate();
    const {
        cart,
        isCartOpen,
        setIsCartOpen,
        removeFromCart,
        updateQuantity,
        cartTotal
    } = useCart();

    if (!isCartOpen) return null;

    const handleCheckout = () => {
        setIsCartOpen(false);
        navigate('/checkout');
    };

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 dark:bg-black/80 backdrop-blur-sm transition-opacity duration-300"
                onClick={() => setIsCartOpen(false)}
            />

            {/* Sidebar */}
            <div className="relative w-full max-w-md bg-white dark:bg-neutral-950 border-l border-neutral-200 dark:border-neutral-800 h-full flex flex-col animate-in slide-in-from-right duration-300 shadow-2xl">
                <div className="p-6 border-b border-neutral-200 dark:border-neutral-800 flex justify-between items-center">
                    <h2 className="text-xl font-bold font-mono text-neutral-900 dark:text-white">CART [{cart.length}]</h2>
                    <button
                        onClick={() => setIsCartOpen(false)}
                        className="text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {cart.length === 0 ? (
                        <div className="text-center text-neutral-500 py-12">
                            <p>Your cart is empty.</p>
                            <p className="text-sm mt-2">Go cop some drops.</p>
                        </div>
                    ) : (
                        cart.map((item) => (
                            <div key={`${item.id}-${item.size}`} className="flex gap-4">
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-20 h-24 object-cover bg-neutral-100 dark:bg-neutral-900"
                                />
                                <div className="flex-1">
                                    <h3 className="font-bold text-sm line-clamp-1 text-neutral-900 dark:text-white">{item.name}</h3>
                                    <p className="text-neutral-600 dark:text-neutral-400 text-xs font-mono mt-1">Size: {item.size}</p>
                                    <p className="text-emerald-600 dark:text-emerald-500 font-mono text-sm mt-1">{item.price.toLocaleString()} DZD</p>

                                    <div className="flex items-center gap-3 mt-3">
                                        <div className="flex items-center border border-neutral-200 dark:border-neutral-800 rounded-sm">
                                            <button
                                                onClick={() => updateQuantity(item.id, item.size, -1)}
                                                className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
                                            >
                                                <Minus size={14} />
                                            </button>
                                            <span className="px-2 text-sm font-mono text-neutral-900 dark:text-white">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.size, 1)}
                                                className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
                                            >
                                                <Plus size={14} />
                                            </button>
                                        </div>
                                        <button
                                            onClick={() => removeFromCart(item.id, item.size)}
                                            className="text-neutral-400 hover:text-red-500 transition-colors ml-auto"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="p-6 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950">
                    <div className="flex justify-between items-center mb-4 font-mono">
                        <span className="text-neutral-600 dark:text-neutral-400">SUBTOTAL</span>
                        <span className="text-xl font-bold text-emerald-600 dark:text-emerald-500">{cartTotal.toLocaleString()} DZD</span>
                    </div>
                    <Button className="w-full" disabled={cart.length === 0} onClick={handleCheckout}>
                        CHECKOUT
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default CartSidebar;
