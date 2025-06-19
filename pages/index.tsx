'use client';

import { useState } from 'react';
import Head from 'next/head';
import Layout from '../components/Layout';
import WatchCard from '../components/WatchCard';
import { Crown, ArrowRight, Star, Shield, Award, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import type { Watch } from '../contexts/CartContext';

const watches: Watch[] = [
  {
    id: 1,
    name: 'Subwrecker',
    tagline: 'Water-resistant up to three lattes.',
    price: 9999,
    image: '/ChatGPT Image Jun 20, 2025, 12_21_14 AM.png',
    description: 'The ultimate diving companion for coffee shop adventures.',
    features: ['Caffeine-proof coating', 'Barista-approved design', 'Latte-depth rating']
  },
  {
    id: 2,
    name: 'Datejust-ish',
    tagline: 'Knows the date… give or take a day.',
    price: 8888,
    image: '/ChatGPT Image Jun 20, 2025, 12_20_56 AM.png',
    description: 'Perfect for those who live in the moment, or yesterday.',
    features: ['Approximate date display', 'Timezone confusion', 'Calendar-adjacent']
  },
  {
    id: 3,
    name: 'Yacht-Mess',
    tagline: 'For captains of group chats.',
    price: 12345,
    image: 'https://images.pexels.com/photos/1034063/pexels-photo-1034063.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Navigate social waters with questionable authority.',
    features: ['Message notification', 'Social compass', 'Drama-resistant']
  },
  {
    id: 4,
    name: 'Dayfaker',
    tagline: 'Pretends to know what day it is.',
    price: 11000,
    image: 'https://images.pexels.com/photos/1697209/pexels-photo-1697209.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'For professionals who wing it with style.',
    features: ['Confidence display', 'Fake-it-till-you-make-it mode', 'Bluff detection']
  },
  {
    id: 5,
    name: 'Airbluff',
    tagline: 'High-flying looks, grounded accuracy.',
    price: 7777,
    image: '/ChatGPT Image Jun 20, 2025, 12_21_01 AM.png',
    description: 'Soar through meetings with questionable precision.',
    features: ['Altitude estimation', 'Turbulence indicator', 'Landing gear optional']
  },
  {
    id: 6,
    name: 'Overexplorer',
    tagline: 'Pre-scuffed for that "been places" vibe.',
    price: 10101,
    image: 'https://images.pexels.com/photos/1697212/pexels-photo-1697212.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Adventure-ready straight from the box.',
    features: ['Authentic wear patterns', 'Story generator', 'Instant credibility']
  },
];

export default function Home() {
  return (
    <>
      <Head>
        <title>Brolex – Premium Watches That Almost Work</title>
        <meta 
          name="description" 
          content="Luxury timepieces that redefine punctuality. Shop our collection of premium watches with an AI concierge experience." 
        />
      </Head>
      <Layout>
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0">
            <div className="absolute top-20 left-10 w-72 h-72 bg-amber-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
            <div className="absolute top-40 right-10 w-72 h-72 bg-amber-600 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-1000"></div>
            <div className="absolute -bottom-8 left-20 w-72 h-72 bg-amber-400 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-2000"></div>
          </div>
          
          <div className="max-w-7xl mx-auto text-center relative">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="flex items-center justify-center mb-8"
            >
              <div className="relative">
                <Crown className="w-16 h-16 text-amber-500 mr-4 transform -rotate-12" />
                <div className="absolute inset-0 bg-amber-500 opacity-30 blur-xl rounded-full"></div>
              </div>
              <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold text-white font-playfair">
                Brolex
              </h1>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <p className="text-3xl sm:text-4xl text-amber-400 mb-4 font-playfair italic">
                Luxury that almost ticks.
              </p>
              <p className="text-slate-400 mb-12 text-lg">
                Warning: punctuality not guaranteed, but style is eternal.
              </p>
            </motion.div>
            
            {/* Premium Features */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex justify-center space-x-8 mb-12"
            >
              <div className="flex items-center space-x-2 text-slate-300">
                <Star className="w-5 h-5 text-amber-500" />
                <span className="text-sm">Premium Craftsmanship*</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-300">
                <Shield className="w-5 h-5 text-amber-500" />
                <span className="text-sm">Lifetime Warranty**</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-300">
                <Award className="w-5 h-5 text-amber-500" />
                <span className="text-sm">Award-Winning Design***</span>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Link href="/agent">
                <button className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-white font-semibold rounded-full shadow-2xl hover:shadow-amber-500/25 transform hover:scale-105 transition-all duration-300 text-lg border border-amber-400">
                  <Sparkles className="mr-3 w-5 h-5" />
                  Chat with Our AI Concierge
                  <ArrowRight className="ml-3 w-5 h-5" />
                </button>
              </Link>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.8 }}
              className="mt-8 text-xs text-slate-500 space-y-1"
            >
              <p>*Craftsmanship may vary by cosmic alignment</p>
              <p>**Valid in alternate dimensions only</p>
              <p>***Awards pending review by imaginary committee</p>
            </motion.div>
          </div>
        </section>

        {/* Product Grid */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white via-slate-50 to-white">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-5xl font-bold mb-4 font-playfair text-slate-900">
                Our Distinguished Collection
              </h2>
              <p className="text-slate-600 mb-8 text-xl max-w-3xl mx-auto">
                Timepieces that redefine the concept of time itself, crafted with questionable precision and undeniable style.
              </p>
              
              {/* Collection Stats */}
              <div className="flex justify-center space-x-12 text-center">
                <div>
                  <div className="text-3xl font-bold text-amber-600 font-playfair">6</div>
                  <div className="text-sm text-slate-500">Luxury Models</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-amber-600 font-playfair">∞</div>
                  <div className="text-sm text-slate-500">Style Points</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-amber-600 font-playfair">?</div>
                  <div className="text-sm text-slate-500">Accuracy Rating</div>
                </div>
              </div>
            </motion.div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {watches.map((watch, index) => (
                <motion.div
                  key={watch.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <WatchCard watch={watch} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

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
      </Layout>
    </>
  );
}