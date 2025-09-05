import React from 'react';
import Hero from '../components/Home/Hero.tsx';
import FeaturedProducts from '../components/Home/FeaturedProducts';
import Features from '../components/Home/Features';

const Home: React.FC = () => {
  return (
    <>
      <Hero />
      <FeaturedProducts />
      <Features />
    </>
  );
};

export default Home;