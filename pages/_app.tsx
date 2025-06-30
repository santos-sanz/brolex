import '../styles/globals.css';
import type { AppProps } from 'next/app';
import dynamic from 'next/dynamic';
import { CartProvider } from '../contexts/CartContext';
import CartSidebar from '../components/CartSidebar';
import { BoltNewBadge } from '../components/ui/bolt-new-badge';

const Toaster = dynamic(
  () => import('react-hot-toast').then((mod) => mod.Toaster),
  { ssr: false }
);

export default function App({ Component, pageProps }: AppProps) {
  return (
    <CartProvider>
      <Component {...pageProps} />
      <CartSidebar />
      <BoltNewBadge 
        position="bottom-right" 
        variant="auto" 
        size="medium"
      />
      <Toaster 
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1e293b',
            color: '#f8fafc',
            borderRadius: '12px',
            border: '1px solid #334155',
          },
        }}
      />
    </CartProvider>
  );
}