import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface HeroSectionProps {
  onGetStarted: () => void;
}

const HeroSection = ({ onGetStarted }: HeroSectionProps) => {
  return (
    <section className="bg-secondary text-white py-16 flex-grow">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h2 className="font-montserrat font-bold text-4xl md:text-5xl mb-4 leading-tight">
              Expert Sports <span className="text-primary">Predictions</span> at Your Fingertips
            </h2>
            <p className="text-lg mb-6">
              We calculate statistics and predict multipliers based on comprehensive data analysis to give you the winning edge.
            </p>
            <div className="flex flex-wrap gap-4 mb-8">
              <div className="bg-black/30 p-4 rounded-lg flex-1 min-w-[150px]">
                <p className="text-gray-400 text-sm">Success Rate</p>
                <p className="text-2xl font-bold">89%</p>
              </div>
              <div className="bg-black/30 p-4 rounded-lg flex-1 min-w-[150px]">
                <p className="text-gray-400 text-sm">Active Users</p>
                <p className="text-2xl font-bold">10,000+</p>
              </div>
              <div className="bg-black/30 p-4 rounded-lg flex-1 min-w-[150px]">
                <p className="text-gray-400 text-sm">Avg. Multiplier</p>
                <p className="text-2xl font-bold">1.8x</p>
              </div>
            </div>
            <Button 
              onClick={onGetStarted}
              className="bg-primary hover:bg-red-700 text-white font-montserrat font-semibold py-3 px-8 rounded-lg text-lg transition-colors duration-300 inline-flex items-center"
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <div className="relative w-full max-w-md">
              <div className="bg-black/40 rounded-xl p-6 backdrop-blur-sm">
                <h3 className="font-montserrat font-semibold text-xl mb-4">Today's Hot Prediction</h3>
                <div className="bg-black/30 rounded-lg p-4 mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-300">Premier League</span>
                    <span className="text-xs bg-primary px-2 py-1 rounded">LIVE</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span>Manchester City</span>
                    <span className="font-bold">vs</span>
                    <span>Liverpool</span>
                  </div>
                  <div className="mt-3 flex justify-between items-center">
                    <div className="text-accent font-bold">
                      Prediction: <span className="text-white">Over 2.5</span>
                    </div>
                    <div className="bg-primary/90 px-3 py-1 rounded font-bold">1.8x</div>
                  </div>
                </div>
                <p className="text-gray-400 text-sm italic text-center">Unlock all predictions with your exclusive ID</p>
              </div>
              <div className="absolute -bottom-4 -right-4 bg-accent text-secondary font-bold p-2 rounded-lg transform rotate-12 shadow-lg">
                Premium Insights
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
