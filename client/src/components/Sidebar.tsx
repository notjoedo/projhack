import React from "react";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import {
  Home,
  MessageSquare,
  FileText,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface SidebarProps {
  currentPage: "dashboard" | "inquiries" | "listing" | "profile";
  onPageChange: (page: "dashboard" | "inquiries" | "listing") => void;
  onProfileClick: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isLoggedIn: boolean;
  onLogin: () => void;
  onLogout: () => void;
}

export function Sidebar({
  currentPage,
  onPageChange,
  onProfileClick,
  isCollapsed,
  onToggleCollapse,
  isLoggedIn,
  onLogin,
  onLogout,
}: SidebarProps) {
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: Home, protected: false },
    {
      id: "inquiries",
      label: "Inquiries & Groups",
      icon: MessageSquare,
      protected: true,
    },
    { id: "listing", label: "My Listings", icon: FileText, protected: true },
  ];

  const NavButton = ({
    item,
    isActive,
    onClick,
    disabled,
  }: {
    item: any;
    isActive: boolean;
    onClick: () => void;
    disabled: boolean;
  }) => {
    const IconComponent = item.icon;
    const buttonContent = (
      <>
        <IconComponent className="w-5 h-5 flex-shrink-0" />
        {!isCollapsed && (
          <span className="font-medium ml-3 whitespace-nowrap">
            {item.label}
          </span>
        )}
      </>
    );

    const button = (
      <button
        onClick={onClick}
        disabled={disabled}
        className={`w-full flex items-center py-3 rounded-xl transition-colors duration-200 ${
          isCollapsed ? "justify-center px-3" : "px-4"
        } ${
          isActive && !disabled
            ? "bg-white/80 text-gray-900 shadow-sm backdrop-blur-sm"
            : "text-gray-600"
        } ${
          disabled
            ? "opacity-50 cursor-not-allowed"
            : "hover:bg-white/60 hover:text-gray-900 hover:shadow-sm hover:backdrop-blur-sm"
        }`}
      >
        {buttonContent}
      </button>
    );

    if (isCollapsed) {
      const tooltipContent = disabled
        ? `${item.label} (Sign in required)`
        : item.label;
      return (
        <Tooltip>
          <TooltipTrigger asChild>{button}</TooltipTrigger>
          <TooltipContent side="right">
            <p>{tooltipContent}</p>
          </TooltipContent>
        </Tooltip>
      );
    }

    return button;
  };

  return (
    <TooltipProvider>
      <div
        className={`${
          isCollapsed ? "w-20" : "w-64"
        } h-screen glass sticky top-0 border-r border-white/20 transition-all duration-300`}
      >
        <div className="relative h-full flex flex-col transition-all duration-300 !outline-none focus:!outline-none focus-visible:!outline-none bg-gray-100 p-4">
          {/* Logo and Toggle */}
          <div
            className={`flex items-center mb-8 ${
              isCollapsed ? "justify-center" : "pl-1"
            }`}
          >
            <div className="flex items-center">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold">H</span>
              </div>
              {!isCollapsed && (
                <span className="ml-3 text-xl font-semibold text-gray-900 whitespace-nowrap">
                  Hokie Home
                </span>
              )}
            </div>

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
            {navItems.map((item) => {
              const isDisabled = item.protected && !isLoggedIn;
              return (
                <React.Fragment key={item.id}>
                  <NavButton
                    item={item}
                    isActive={currentPage === item.id}
                    disabled={isDisabled}
                    onClick={() => {
                      if (!isDisabled) {
                        onPageChange(
                          item.id as "dashboard" | "inquiries" | "listing"
                        );
                      }
                    }}
                  />
                </React.Fragment>
              );
            })}
          </nav>

          {/* Profile Section or Sign In Button */}
          <div className="mt-auto">
            {isLoggedIn ? (
              // Logged In View: Profile Section
              isCollapsed ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={onProfileClick}
                      className={`w-full flex justify-center items-center py-3 rounded-xl transition-colors duration-200 ${
                        currentPage === "profile"
                          ? "bg-white/80 text-gray-900 shadow-sm backdrop-blur-sm"
                          : "text-gray-600 hover:bg-white/60 hover:text-gray-900 hover:shadow-sm hover:backdrop-blur-sm"
                      }`}
                    >
                      <Avatar className="w-8 h-8">
                        <AvatarImage src="user/PFP.jpg" />
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
                  className={`w-full flex items-center px-4 py-3 rounded-xl transition-colors duration-200 ${
                    currentPage === "profile"
                      ? "bg-white/80 text-gray-900 shadow-sm backdrop-blur-sm"
                      : "text-gray-600 hover:bg-white/60 hover:text-gray-900 hover:shadow-sm hover:backdrop-blur-sm"
                  }`}
                >
                  <Avatar className="w-8 h-8">
                    <AvatarImage src="user/PFP.jpg" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  {!isCollapsed && (
                    <span className="font-medium ml-3 whitespace-nowrap">
                      Profile
                    </span>
                  )}
                </button>
              )
            ) : (
              // Logged Out View: Sign In Button
              <Button
                onClick={onLogin}
                className="w-full gradient-primary hover:opacity-90 text-white rounded-xl py-3 shadow-lg"
              >
                Sign In
              </Button>
            )}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
