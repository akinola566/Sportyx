import { Button } from "@/components/ui/button";

interface HeaderProps {
  isAuthenticated: boolean;
  onLogin?: () => void;
  onRegister?: () => void;
  onLogout?: () => void;
  username?: string;
}

const Header = ({ 
  isAuthenticated,
  onLogin,
  onRegister,
  onLogout,
  username
}: HeaderProps) => {
  return (
    <header className="bg-secondary shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-white font-montserrat font-bold text-2xl">SportPredictPro</h1>
        </div>
        
        <nav className="flex items-center">
          {isAuthenticated ? (
            <>
              <span className="text-white mr-4">{username}</span>
              <Button
                variant="ghost"
                className="bg-transparent hover:bg-white/10 text-white font-montserrat font-medium"
                onClick={onLogout}
              >
                <i className="fas fa-sign-out-alt mr-1"></i> Logout
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                className="bg-transparent hover:bg-white/10 text-white font-montserrat font-medium"
                onClick={onLogin}
              >
                Login
              </Button>
              <Button
                className="bg-primary hover:bg-red-700 text-white font-montserrat font-medium ml-2"
                onClick={onRegister}
              >
                Register
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
