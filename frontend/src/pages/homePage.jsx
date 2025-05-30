import React from 'react';
import Header from '../components/header';
import Layout from '../components/layout';
import HomeHero from '../components/homeHero';
import WhyParentsZen from '../components/whyParentsZen';
import HomeSections from '../sections/homeSections';
const HomePage = () => {
  return (
    <>
      {/* Tout ton contenu principal */}
      <Header logo="/images/logo_ParentsZen.png" />
      <HomeHero />
      <HomeSections />
      
      {/* autres sections */}

      {/* Footer en bas */}
      <Layout />
    </>
  );
};

export default HomePage;
