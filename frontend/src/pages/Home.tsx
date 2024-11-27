import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Features from '../components/Features';
import PremiumFeatures from '../components/PremiumFeatures';
import Footer from '../components/Footer';

function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <Navbar />
      <Hero />
      <Features />
      <PremiumFeatures />
      <Footer />
    </div>
  );
}

export default Home;