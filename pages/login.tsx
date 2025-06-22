import Head from 'next/head';
import Layout from '../components/Layout';
import products from '../data/products.json';
import { GetStaticProps } from 'next';

interface Product {
  id: number;
  name: string;
  tagline: string;
  price: number;
  image: string;
  description: string;
  features: string[];
}

interface LoginProps {
  products: Product[];
}

export const getStaticProps: GetStaticProps<LoginProps> = async () => {
  // Since we import products JSON directly, it is already statically bundled.
  return {
    props: {
      products: products as Product[],
    },
  };
};

export default function Login({ products }: LoginProps) {
  return (
    <>
      <Head>
        <title>Login – Brolex</title>
      </Head>
      <Layout>
        <div className="min-h-screen flex flex-col items-center justify-center py-20 bg-slate-100">
          <h1 className="text-4xl font-bold mb-4">Login</h1>
          {/* Render JSON data */}
          <pre className="bg-white p-4 shadow rounded max-w-2xl w-full overflow-x-auto text-sm text-slate-800">
            {JSON.stringify(products, null, 2)}
          </pre>
        </div>
      </Layout>
    </>
  );
}
