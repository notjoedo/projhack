import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface HeaderProps {
  currentPage: 'dashboard' | 'inquiries' | 'listing' | 'profile';
  onProfileClick: () => void;
  pageTitle?: string;
}

export function Header({ currentPage, onProfileClick, pageTitle }: HeaderProps) {
  const getPageTitle = () => {
    switch (currentPage) {
      case 'inquiries':
        return 'My Inquiries & Groups';
      case 'listing':
        return 'My Listing';
      case 'profile':
        return 'Profile Settings';
      default:
        return pageTitle;
    }
  };

  return (
    <header className="glass border-b border-white/20 sticky top-0 z-50">
      <div className="w-full px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center shadow-lg">
            <span className="text-white font-bold">H</span>
          </div>
          <span className="ml-3 text-xl font-semibold text-gray-900">HouseAI</span>
        </div>
        
        {/* Page Title (for management pages) */}
        {currentPage !== 'dashboard' && (
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <h2 className="font-bold text-gray-900">{getPageTitle()}</h2>
          </div>
        )}

        {/* Right side */}
        <div className="flex items-center space-x-4">
          <Button className="gradient-primary hover:opacity-90 text-white rounded-xl px-6 shadow-lg">
            + Post Listing
          </Button>
          <button 
            onClick={onProfileClick}
            className="ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-full hover:opacity-80 transition-opacity"
          >
            <Avatar className="w-9 h-9 shadow-lg border-2 border-white/50">
              <AvatarImage src="https://images.unsplash.com/photo-1494790108755-2616b9e59a10?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=96&w=96" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
          </button>
        </div>
      </div>
    </header>
  );
}