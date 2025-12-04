import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
    const { theme, toggleTheme } = useTheme();

    return (
        <nav className="fixed top-0 left-0 right-0 z-40 bg-stone-50/90 dark:bg-neutral-950/80 backdrop-blur-md shadow-sm dark:shadow-none border-b-0 dark:border-b dark:border-neutral-800 transition-colors duration-300">
            <div className="container mx-auto px-4 h-16 sm:h-20 flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 h-full">
                    <img src="/logo.png" alt="DZIN" className="h-5/6 w-auto object-contain" />
                </Link>

                {/* Desktop Links */}
                <div className="hidden md:flex items-center gap-8">
                    <NavLink
                        to="/"
                        className={({ isActive }) =>
                            `text-sm font-bold tracking-wide hover:text-emerald-600 dark:hover:text-emerald-500 transition-colors ${isActive ? 'text-emerald-600 dark:text-emerald-500' : 'text-neutral-600 dark:text-neutral-400'}`
                        }
                    >
                        HOME
                    </NavLink>
                    <NavLink
                        to="/shop"
                        className={({ isActive }) =>
                            `text-sm font-bold tracking-wide hover:text-emerald-600 dark:hover:text-emerald-500 transition-colors ${isActive ? 'text-emerald-600 dark:text-emerald-500' : 'text-neutral-600 dark:text-neutral-400'}`
                        }
                    >
                        SHOP
                    </NavLink>

                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 sm:gap-4">
                    <button
                        onClick={toggleTheme}
                        className="text-neutral-600 dark:text-neutral-400 hover:text-emerald-600 dark:hover:text-white transition-colors p-2 min-w-[44px] min-h-[44px] flex items-center justify-center"
                        aria-label="Toggle theme"
                    >
                        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                    </button>

                    <button className="md:hidden text-neutral-900 dark:text-white p-2 min-w-[44px] min-h-[44px] flex items-center justify-center" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle menu">
                        <Menu size={24} />
                    </button>

                    {/* Mobile menu */}
                    {mobileMenuOpen && (
                        <div className="absolute top-16 sm:top-20 left-0 w-full bg-stone-50/95 dark:bg-neutral-950/95 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 md:hidden shadow-lg">
                            <div className="flex flex-col gap-1 p-2">
                                <NavLink
                                    to="/"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={({ isActive }) => `text-base font-bold ${isActive ? 'text-emerald-600 dark:text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20' : 'text-neutral-600 dark:text-neutral-400'} transition-colors min-h-[48px] flex items-center px-4 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800`}
                                >
                                    HOME
                                </NavLink>
                                <NavLink
                                    to="/shop"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={({ isActive }) => `text-base font-bold ${isActive ? 'text-emerald-600 dark:text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20' : 'text-neutral-600 dark:text-neutral-400'} transition-colors min-h-[48px] flex items-center px-4 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800`}
                                >
                                    SHOP
                                </NavLink>

                            </div>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
