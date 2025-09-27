import { useState } from "react";
import { Sidebar } from "./components/Sidebar";
import { DashboardPage } from "./components/DashboardPage";
import { InquiriesPage } from "./components/InquiriesPage";
import { MyListingPage } from "./components/MyListingPage";
import { ProfilePage } from "./components/ProfilePage";
import { OnboardingPage } from "./components/OnboardingPage";
import type { ProfileData } from "./components/OnboardingPage";

export default function App() {
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'inquiries' | 'listing' | 'profile'>('dashboard');
  const [isOnboarded, setIsOnboarded] = useState(true); // Set to false for new users
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handlePageChange = (page: 'dashboard' | 'inquiries' | 'listing') => {
    setCurrentPage(page);
  };

  const handleProfileClick = () => {
    setCurrentPage('profile');
  };

  const handleOnboardingComplete = (profileData: ProfileData) => {
    // In a real app, save the profile data to your backend/state management
    console.log('Onboarding completed with data:', profileData);
    setIsOnboarded(true);
    setCurrentPage('dashboard');
  };

  const handleToggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage />;
      case 'inquiries':
        return <InquiriesPage />;
      case 'listing':
        return <MyListingPage />;
      case 'profile':
        return <ProfilePage />;
      default:
        return <DashboardPage />;
    }
  };

  // Show onboarding for new users
  if (!isOnboarded) {
    return <OnboardingPage onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="min-h-screen bg-white flex">
      <Sidebar 
        currentPage={currentPage} 
        onPageChange={handlePageChange} 
        onProfileClick={handleProfileClick}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={handleToggleSidebar}
      />
      <div className="flex-1">
        {renderCurrentPage()}
      </div>
    </div>
  );
}