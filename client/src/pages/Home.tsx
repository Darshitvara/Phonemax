import React, { Suspense, lazy } from 'react';
import Hero from '../components/Home/Hero.tsx';
const FeaturedProducts = lazy(() => import('../components/Home/FeaturedProducts'));
const Features = lazy(() => import('../components/Home/Features'));

const Home: React.FC = () => {
  return (
    <>
      <Hero />
      <Suspense fallback={<div className="py-16 text-center text-gray-500">Loading products…</div>}>
        <FeaturedProducts />
      </Suspense>
      <Suspense fallback={<div className="py-12 text-center text-gray-400">Loading features…</div>}>
        <Features />
      </Suspense>
    </>
  );
};

export default Home;