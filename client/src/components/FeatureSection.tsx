const FeatureSection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-montserrat font-bold text-center mb-12">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
              <i className="fas fa-user-plus"></i>
            </div>
            <h3 className="text-xl font-montserrat font-semibold mb-3">1. Create Account</h3>
            <p className="text-gray-600">Sign up in seconds with your email, username, password and phone number.</p>
          </div>
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
              <i className="fas fa-key"></i>
            </div>
            <h3 className="text-xl font-montserrat font-semibold mb-3">2. Activate Your ID</h3>
            <p className="text-gray-600">Enter your exclusive ID to access premium predictions and multipliers.</p>
          </div>
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
              <i className="fas fa-chart-line"></i>
            </div>
            <h3 className="text-xl font-montserrat font-semibold mb-3">3. Get Predictions</h3>
            <p className="text-gray-600">Access calculated statistics and predicted multipliers based on our advanced algorithms.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
