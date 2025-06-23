'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { Crown, ShoppingCart, Sparkles } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { motion } from 'framer-motion';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { state, toggleCart } = useCart();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md shadow-lg sticky top-0 z-30 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity group">
              <div className="relative">
                <Crown className="w-8 h-8 text-amber-600 transform -rotate-12 group-hover:rotate-0 transition-transform duration-300" />
                <div className="absolute inset-0 bg-amber-600 opacity-20 blur-lg rounded-full group-hover:opacity-30 transition-opacity duration-300"></div>
              </div>
              <span className="text-2xl font-bold text-slate-900 font-playfair">Brolex</span>
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-slate-700 hover:text-slate-900 transition-colors font-medium relative group">
                Collection
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-600 group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link href="/agent" className="text-slate-700 hover:text-slate-900 transition-colors font-medium relative group flex items-center space-x-1">
                <Sparkles className="w-4 h-4" />
                <span>AI Concierge</span>
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-600 group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link href="#" className="text-slate-700 hover:text-slate-900 transition-colors font-medium relative group">
                Heritage
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-600 group-hover:w-full transition-all duration-300"></span>
              </Link>
            </div>

            {/* Cart */}
            <div className="flex items-center">
              <button 
                onClick={toggleCart}
                className="relative p-3 text-slate-700 hover:text-slate-900 transition-colors group bg-slate-100 hover:bg-slate-200 rounded-full"
              >
                <ShoppingCart className="w-6 h-6 group-hover:scale-110 transition-transform duration-200" />
                {state.itemCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 bg-gradient-to-r from-amber-600 to-amber-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold shadow-lg"
                  >
                    {state.itemCount > 99 ? '99+' : state.itemCount}
                  </motion.span>
                )}
                <span className="sr-only">Shopping cart</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-6">
              <div className="relative">
                <Crown className="w-10 h-10 text-amber-500 mr-3 transform -rotate-12" />
                <div className="absolute inset-0 bg-amber-500 opacity-30 blur-lg rounded-full"></div>
              </div>
              <span className="text-3xl font-bold font-playfair">Brolex</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div>
                <h3 className="font-semibold mb-4 text-amber-400">Customer Service</h3>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li>AI Concierge Available 24/7*</li>
                  <li>Dream Fulfillment Center</li>
                  <li>Warranty Claims (Parallel Universe)</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-4 text-amber-400">Company</h3>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li>About Our Questionable Heritage</li>
                  <li>Careers in Luxury Parody</li>
                  <li>Press & Media Confusion</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-4 text-amber-400">Legal</h3>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li>Terms of Delusion</li>
                  <li>Privacy Policy (What Privacy?)</li>
                  <li>Cookie Preferences</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="border-t border-slate-700 pt-8 text-center">
            <p className="text-slate-400 mb-2">
              © 2025 Brolex — All rights reversed, some wrongs corrected.
            </p>
            <p className="text-xs text-slate-500">
              Batteries not included, actual time may vary, side effects may include sudden urges to check your phone.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}