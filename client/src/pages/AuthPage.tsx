import { useLocation } from "wouter";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import AuthForms from "@/components/AuthForms";

interface AuthPageProps {
  isLogin: boolean;
}

const AuthPage = ({ isLogin }: AuthPageProps) => {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>(isLogin ? 'login' : 'register');

  const handleBackToHome = () => {
    setLocation("/");
  };

  const handleTabChange = (tab: 'login' | 'register') => {
    setActiveTab(tab);
    setLocation(tab === 'login' ? '/auth/login' : '/auth/register');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-lg">
        <div className="flex border-b border-gray-200">
          <button 
            onClick={() => handleTabChange('login')}
            className={`px-4 py-2 font-montserrat font-medium ${
              activeTab === 'login'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-500 border-b-2 border-transparent'
            }`}
          >
            Login
          </button>
          <button 
            onClick={() => handleTabChange('register')}
            className={`px-4 py-2 font-montserrat font-medium ${
              activeTab === 'register'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-500 border-b-2 border-transparent'
            }`}
          >
            Register
          </button>
        </div>

        <AuthForms activeTab={activeTab} />

        <div className="text-center mt-4">
          <Button
            variant="ghost"
            className="text-primary hover:text-primary/90 hover:bg-transparent"
            onClick={handleBackToHome}
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
