'use client';

import Head from 'next/head';
import Layout from '../components/Layout';
import WatchCard from '../components/WatchCard';
import { Crown, ArrowRight, Star, Shield, Award, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import type { Watch } from '../contexts/CartContext';
import productsJson from '../data/products.json';

const watches: Watch[] = productsJson as Watch[];

export default function Home() {
  return (
    <>
      <Head>
        <title>Brolex – Premium Watches That Almost Work</title>
        <meta 
          name="description" 
          content="Because telling time is overrated, but looking expensive isn't. Our 'luxury' timepieces come with a built-in excuse for being fashionably late." 
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        
        {/* Hero Section - Mobile Responsive */}
        <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-16 sm:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0">
            <div className="absolute top-20 left-10 w-48 h-48 sm:w-72 sm:h-72 bg-amber-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
            <div className="absolute top-40 right-10 w-48 h-48 sm:w-72 sm:h-72 bg-amber-600 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-1000"></div>
            <div className="absolute -bottom-8 left-20 w-48 h-48 sm:w-72 sm:h-72 bg-amber-400 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-2000"></div>
          </div>
          
          <div className="max-w-7xl mx-auto text-center relative">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="flex flex-col sm:flex-row items-center justify-center mb-6 sm:mb-8"
            >
              <div className="relative mb-4 sm:mb-0">
                <Crown className="w-12 h-12 sm:w-16 sm:h-16 text-amber-500 mr-0 sm:mr-4 transform -rotate-12" />
                <div className="absolute inset-0 bg-amber-500 opacity-30 blur-xl rounded-full"></div>
              </div>
              <div className="text-center sm:text-left">
                <h1 className="text-4xl sm:text-6xl lg:text-8xl font-bold text-white font-playfair">
                  Brolex
                </h1>
                <p className="text-amber-500 text-xs sm:text-sm mt-2">
                  *Not affiliated with any actual luxury brands. Or punctuality.
                </p>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <p className="text-2xl sm:text-3xl lg:text-4xl text-amber-400 mb-4 font-playfair italic px-4">
                The watch that tells time... sometimes.
              </p>
              <p className="text-slate-400 mb-8 sm:mb-12 text-base sm:text-lg px-4">
                Warning: May cause excessive watch checking. Time displayed is an artistic interpretation.
              </p>
            </motion.div>
            
            {/* Premium Features - Mobile Responsive */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-8 mb-8 sm:mb-12 px-4"
            >
              <div className="flex items-center justify-center space-x-2 text-slate-300">
                <Star className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />
                <span className="text-sm">"Premium" Craftsmanship*</span>
              </div>
              <div className="flex items-center justify-center space-x-2 text-slate-300">
                <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />
                <span className="text-sm">Lifetime Warranty**</span>
              </div>
              <div className="flex items-center justify-center space-x-2 text-slate-300">
                <Award className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />
                <span className="text-sm">Self-Awarded Design***</span>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Link href="/agent">
                <button className="flex items-center space-x-2 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-white font-semibold rounded-full shadow-2xl hover:shadow-amber-500/25 transform hover:scale-105 transition-all duration-300 text-base sm:text-lg border border-amber-400 mx-auto">
                  <Sparkles className="mr-2 sm:mr-3 w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-sm sm:text-base">Get Robo-Excuses for Being Late</span>
                  <ArrowRight className="ml-2 sm:ml-3 w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </Link>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.8 }}
              className="mt-6 sm:mt-8 text-xs text-slate-500 space-y-1 px-4"
            >
              <p>*Craftsmanship may vary by cosmic alignment</p>
              <p>**Valid in alternate dimensions only</p>
              <p>***Awards pending review by imaginary committee</p>
            </motion.div>
          </div>
        </section>

        {/* Product Grid - Mobile Responsive */}
        <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white via-slate-50 to-white">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12 sm:mb-16"
            >
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 font-playfair text-slate-900">
                Our "Luxury" Collection
              </h2>
              <p className="text-slate-600 mb-6 sm:mb-8 text-lg sm:text-xl px-4">
                For those who value the appearance of punctuality more than actual timekeeping. Each piece is a conversation starter, especially when you&apos;re late.
              </p>
              
              {/* Collection Stats - Mobile Responsive */}
              <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-12 text-center">
                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-amber-600 font-playfair">6</div>
                  <div className="text-sm text-slate-500">Overpriced Timepieces</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-amber-600 font-playfair">∞</div>
                  <div className="text-sm text-slate-500">Excuses to Be Late</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-amber-600 font-playfair">?</div>
                  <div className="text-sm text-slate-500">Chance of Working</div>
                </div>
              </div>
            </motion.div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
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
      </Layout>
    </>
  );
}