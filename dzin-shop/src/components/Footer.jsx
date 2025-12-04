import React from 'react';
import { Instagram, Twitter, Facebook } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-neutral-100 dark:bg-neutral-950 border-t border-neutral-200 dark:border-neutral-800 py-12 mt-auto transition-colors duration-300">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                    <div className="col-span-1 md:col-span-2">
                        <div className="mb-6">
                            <img src="/logo-footer-trimmed.png" alt="DZIN" className="h-64 w-auto object-contain mb-2 dark:invert" />
                        </div>
                        <p className="text-neutral-600 dark:text-neutral-400 max-w-xs mb-2">
                            Algerian Streetwear x Anime Fusion.
                            <span className="text-emerald-600 dark:text-emerald-500 font-bold"> Born in DZ</span>
                            <br />
                            Designed by the Streets.
                        </p>
                        <p className="text-emerald-600 dark:text-emerald-500/80 font-bold tracking-widest text-sm mb-6">
                            アルジェリア生まれ
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="text-neutral-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-500 transition-colors">
                                <Instagram size={20} />
                            </a>
                            <a href="#" className="text-neutral-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-500 transition-colors">
                                <Twitter size={20} />
                            </a>
                            <a href="#" className="text-neutral-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-500 transition-colors">
                                <Facebook size={20} />
                            </a>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-bold mb-4 text-emerald-600 dark:text-emerald-500">SHOP</h3>
                        <ul className="space-y-2 text-neutral-600 dark:text-neutral-400 text-sm">
                            <li><a href="#" className="hover:text-neutral-900 dark:hover:text-white transition-colors">New Arrivals</a></li>
                            <li><a href="#" className="hover:text-neutral-900 dark:hover:text-white transition-colors">Hoodies</a></li>
                            <li><a href="#" className="hover:text-neutral-900 dark:hover:text-white transition-colors">T-Shirts</a></li>
                            <li><a href="#" className="hover:text-neutral-900 dark:hover:text-white transition-colors">Accessories</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-bold mb-4 text-emerald-600 dark:text-emerald-500">SUPPORT</h3>
                        <ul className="space-y-2 text-neutral-600 dark:text-neutral-400 text-sm">
                            <li><a href="#" className="hover:text-neutral-900 dark:hover:text-white transition-colors">FAQ</a></li>
                            <li><a href="#" className="hover:text-neutral-900 dark:hover:text-white transition-colors">Shipping & Returns</a></li>
                            <li><a href="#" className="hover:text-neutral-900 dark:hover:text-white transition-colors">Size Guide</a></li>
                            <li><a href="#" className="hover:text-neutral-900 dark:hover:text-white transition-colors">Contact Us</a></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-neutral-200 dark:border-neutral-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-neutral-500 font-mono">
                    <p>&copy; {new Date().getFullYear()} DZIN. All rights reserved.</p>
                    <p>MADE IN ALGIERS</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
