import { useLocation } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import FeatureSection from "@/components/FeatureSection";
import TestimonialSection from "@/components/TestimonialSection";

const LandingPage = () => {
  const [location, setLocation] = useLocation();

  const handleLogin = () => {
    setLocation("/auth/login");
  };

  const handleRegister = () => {
    setLocation("/auth/register");
  };

  const handleGetStarted = () => {
    setLocation("/auth/register");
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header 
        onLogin={handleLogin} 
        onRegister={handleRegister} 
        isAuthenticated={false}
      />
      <HeroSection onGetStarted={handleGetStarted} />
      <FeatureSection />
      <TestimonialSection />
      <Footer />
    </div>
  );
};

export default LandingPage;
