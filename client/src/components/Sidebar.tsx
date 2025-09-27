import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { Home, MessageSquare, FileText, ChevronLeft, ChevronRight } from "lucide-react";

interface SidebarProps {
  currentPage: 'dashboard' | 'inquiries' | 'listing' | 'profile';
  onPageChange: (page: 'dashboard' | 'inquiries' | 'listing') => void;
  onProfileClick: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export function Sidebar({ currentPage, onPageChange, onProfileClick, isCollapsed, onToggleCollapse }: SidebarProps) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'inquiries', label: 'My Inquiries', icon: MessageSquare },
    { id: 'listing', label: 'My Listings', icon: FileText },
  ];

  const NavButton = ({ item, isActive, onClick }: { item: any, isActive: boolean, onClick: () => void }) => {
    const IconComponent = item.icon;
    const button = (
      <button
        onClick={onClick}
        className={`w-full flex items-center ${isCollapsed ? 'justify-center px-3' : 'space-x-3 px-4'} py-3 rounded-xl transition-all duration-200 ${
          isActive
            ? 'bg-white/80 text-gray-900 shadow-sm backdrop-blur-sm'
            : 'text-gray-600 hover:bg-white/60 hover:text-gray-900 hover:shadow-sm hover:backdrop-blur-sm'
        }`}
      >
        <IconComponent className="w-5 h-5 flex-shrink-0" />
        {!isCollapsed && <span className="font-medium">{item.label}</span>}
      </button>
    );

    if (isCollapsed) {
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            {button}
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>{item.label}</p>
          </TooltipContent>
        </Tooltip>
      );
    }

    return button;
  };

  return (
    <TooltipProvider>
      <div className={`${isCollapsed ? 'w-16' : 'w-64'} h-screen glass sticky top-0 border-r border-white/20 transition-all duration-300`}>
        <div className={`${isCollapsed ? 'p-3' : 'p-6'} h-full flex flex-col transition-all duration-300 !outline-none focus:!outline-none focus-visible:!outline-none bg-gray-100`}>
          {/* Logo and Toggle */}
          <div className={`flex items-center mb-8 ${isCollapsed ? 'justify-center' : ''}`}>
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">H</span>
            </div>
            {!isCollapsed && <span className="ml-3 text-xl font-semibold text-gray-900">Hokie Home</span>}
            
            {/* Toggle Button */}
            <button
              onClick={onToggleCollapse}
              className="absolute top-1/2 -translate-y-1/2 -right-3 p-1.5 rounded-full glass-subtle hover:opacity-90 transition-all z-10 bg-[rgba(255,255,255,1)]"
            >
              {isCollapsed ? (
                <ChevronRight className="w-4 h-4 text-gray-600" />
              ) : (
                <ChevronLeft className="w-4 h-4 text-gray-600" />
              )}
            </button>
          </div>

          {/* Navigation */}
          <nav className="space-y-1 flex-1">
            {navItems.map((item) => (
              <NavButton
                key={item.id}
                item={item}
                isActive={currentPage === item.id}
                onClick={() => onPageChange(item.id as 'dashboard' | 'inquiries' | 'listing')}
              />
            ))}
          </nav>

          {/* Profile Section */}
          <div className="mt-auto">
            {isCollapsed ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={onProfileClick}
                    className={`w-full flex items-center justify-center px-3 py-3 rounded-xl transition-all duration-200 ${
                      currentPage === 'profile'
                        ? 'bg-white/80 text-gray-900 shadow-sm backdrop-blur-sm'
                        : 'text-gray-600 hover:bg-white/60 hover:text-gray-900 hover:shadow-sm hover:backdrop-blur-sm'
                    }`}
                  >
                    <Avatar className="w-5 h-5">
                      <AvatarImage src="https://images.unsplash.com/photo-1494790108755-2616b9e59a10?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=96&w=96" />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>Profile</p>
                </TooltipContent>
              </Tooltip>
            ) : (
              <button
                onClick={onProfileClick}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  currentPage === 'profile'
                    ? 'bg-white/80 text-gray-900 shadow-sm backdrop-blur-sm'
                    : 'text-gray-600 hover:bg-white/60 hover:text-gray-900 hover:shadow-sm hover:backdrop-blur-sm'
                }`}
              >
                <Avatar className="w-5 h-5">
                  <AvatarImage src="https://images.unsplash.com/photo-1494790108755-2616b9e59a10?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=96&w=96" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <span className="font-medium">Profile</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}