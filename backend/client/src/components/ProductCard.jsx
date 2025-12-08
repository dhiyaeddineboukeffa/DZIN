import React from 'react';
import { Link } from 'react-router-dom';
import Button from './Button';

const ProductCard = ({ product }) => {
    return (
        <div className="group relative bg-white dark:bg-neutral-900 border-none dark:border dark:border-neutral-800 overflow-hidden shadow-sm hover:shadow-md dark:shadow-none transition-all duration-300 p-3 sm:p-4">
            {/* Glitch Border Effect on Hover */}
            <div className="absolute inset-0 pointer-events-none border border-transparent group-hover:border-emerald-500/20 translate-x-1 translate-y-1 transition-all duration-300" />

            <Link to={`/order/${product._id}`} className="block aspect-[4/5] overflow-hidden mix-blend-multiply dark:mix-blend-normal">
                <img
                    src={product.images && product.images.length > 0 ? product.images[0] : (product.image && (product.image.includes('\n') || product.image.includes(',')) ? product.image.split(/[\n,]+/)[0].trim() : product.image)}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {!product.inStock && (
                    <div className="absolute top-2 right-2 bg-red-500 text-black text-xs font-bold px-2 py-1">
                        SOLD OUT
                    </div>
                )}
            </Link>

            <div className="p-3 sm:p-4">
                <div className="flex justify-between items-start mb-3">
                    <Link to={`/order/${product._id}`} className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-500 transition-colors line-clamp-2">
                        {product.name}
                    </Link>
                </div>

                <div className="flex flex-col gap-3">
                    <div>
                        <p className="text-neutral-500 dark:text-neutral-400 text-xs font-mono mb-1">{product.category}</p>
                        {product.discountPrice && product.discountPrice < product.price ? (
                            <div className="flex flex-col gap-1">
                                <p className="text-neutral-500 dark:text-neutral-400 font-mono text-sm line-through">{product.price.toLocaleString()} DZD</p>
                                <p className="text-emerald-700 dark:text-emerald-500 font-mono font-bold text-lg">{product.discountPrice.toLocaleString()} DZD</p>
                            </div>
                        ) : (
                            <p className="text-emerald-700 dark:text-emerald-500 font-mono font-bold text-base">{product.price.toLocaleString()} DZD</p>
                        )}
                    </div>
                    <Link
                        to={`/order/${product._id}`}
                    >
                        <Button
                            variant="secondary"
                            size="sm"
                            className="w-full sm:w-auto sm:opacity-0 sm:group-hover:opacity-100 sm:translate-y-2 sm:group-hover:translate-y-0 transition-all duration-300 min-h-[44px]"
                        >
                            VIEW
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
