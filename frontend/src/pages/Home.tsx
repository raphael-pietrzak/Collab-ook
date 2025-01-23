import Hero from '../components/home/Hero';
import Features from '../components/home/Features';
import PremiumFeatures from '../components/home/PremiumFeatures';
import Footer from '../components/home/Footer';

function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <Hero />
      <Features />
      <PremiumFeatures />
      <Footer />
    </div>
  );
}

export default Home;