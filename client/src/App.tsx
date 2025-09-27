import React, { useState, useEffect } from "react";
import { Sidebar } from "./components/Sidebar";
import { DashboardPage } from "./pages/DashboardPage";
import { InquiriesPage } from "./pages/InquiriesPage";
import { MyListingPage } from "./pages/MyListingPage";
import { ProfilePage } from "./pages/ProfilePage";
import { OnboardingPage } from "./pages/OnboardingPage";
import type { ProfileData } from "./pages/OnboardingPage";
import {
  fetchListings as fetchListingsService,
  findListingById as findListingByIdService,
} from "./services/listingService";
import { UserProfile, fetchUser } from "./services/userService";
import { Listing } from "./types";
import { DetailedViewModal } from "./components/DetailedViewModal";
import { TooltipProvider } from "./components/ui/tooltip";

function App() {
  const [currentPage, setCurrentPage] = useState<
    "dashboard" | "inquiries" | "listing" | "profile" | "onboarding"
  >("dashboard");
  const [isOnboarded, setIsOnboarded] = useState(true); // Set to false for new users
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [listings, setListings] = useState<Listing[]>([]);
  const [selectedListingId, setSelectedListingId] = useState<number | null>(
    null
  );

  // New state for auth and user
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const loadListings = async () => {
      const listingsData = await fetchListingsService();
      setListings(listingsData);
    };
    loadListings();
  }, []);

  const handlePageChange = (page: "dashboard" | "inquiries" | "listing") => {
    setCurrentPage(page);
  };

  const handleProfileClick = () => {
    setCurrentPage("profile");
  };

  const handleOnboardingComplete = (profileData: ProfileData) => {
    // In a real app, save the profile data to your backend/state management
    console.log("Onboarding completed with data:", profileData);
    setIsOnboarded(true);
    setCurrentPage("dashboard");
  };

  const handleToggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const handleLogin = async () => {
    const userData = await fetchUser();
    setUser(userData);
    setIsLoggedIn(true);
    // Navigate to dashboard after login
    setCurrentPage("dashboard");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    setCurrentPage("dashboard"); // Go to dashboard after logout
  };

  const handleCardClick = (id: number) => {
    setSelectedListingId(id);
  };

  const handleInterested = async (listingId: number) => {
    const listing = await findListingByIdService(listingId);
    if (listing) {
      // In a real app, you would add the listing to a user's favorites or inquiries
      console.log("User interested in listing:", listing);
      // For now, we'll just close the modal
      setSelectedListingId(null);
    } else {
      console.error("Listing not found for interested action.");
    }
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <DashboardPage />;
      case "inquiries":
        return <InquiriesPage />;
      case "listing":
        return <MyListingPage />;
      case "profile":
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
    <TooltipProvider>
      <div className="min-h-screen bg-white flex">
        <Sidebar
          currentPage={currentPage}
          onPageChange={handlePageChange}
          onProfileClick={() => setCurrentPage("profile")}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          isLoggedIn={isLoggedIn}
          onLogin={handleLogin}
          onLogout={handleLogout}
        />
        <main className="flex-1 overflow-y-auto bg-gray-50">
          {currentPage === "dashboard" && (
            <DashboardPage
              listings={listings}
              onCardClick={handleCardClick}
              isLoggedIn={isLoggedIn}
              onLogin={handleLogin}
            />
          )}
          {currentPage === "inquiries" && <InquiriesPage />}
          {currentPage === "listing" && <MyListingPage />}
          {currentPage === "profile" && <ProfilePage />}
          {currentPage === "onboarding" && (
            <OnboardingPage onComplete={() => setCurrentPage("dashboard")} />
          )}
        </main>
        <DetailedViewModal
          isOpen={selectedListingId !== null}
          onClose={() => setSelectedListingId(null)}
          listingId={selectedListingId!}
          isLoggedIn={isLoggedIn}
          onInterested={handleInterested}
        />
      </div>
    </TooltipProvider>
  );
}

export default App;
