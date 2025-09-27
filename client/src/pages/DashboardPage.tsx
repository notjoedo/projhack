import { useState, useEffect } from "react";
import { Banner } from "../components/Banner";
import { SearchBar } from "../components/SearchBar";
import { ListingCard } from "../components/ListingCard";
import { CTAModal } from "../components/CTAModal";
import { DetailedViewModal } from "../components/DetailedViewModal";
import { fetchListings } from "../services/listingService";
import { Listing } from "../types";

interface DashboardPageProps {
  listings: Listing[];
  onCardClick: (id: number) => void;
  isLoggedIn: boolean;
  onLogin: () => void;
}

export function DashboardPage({
  listings,
  onCardClick,
  isLoggedIn,
  onLogin,
}: DashboardPageProps) {
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    type: "private" | "external";
  }>({
    isOpen: false,
    type: "private",
  });

  const [detailsModal, setDetailsModal] = useState<{
    isOpen: boolean;
    listingId: number | null;
  }>({
    isOpen: false,
    listingId: null,
  });

  // Mock user state - can toggle between logged in/out for demonstration
  // const [isLoggedIn, setIsLoggedIn] = useState(true); // This line is removed as per the new_code

  useEffect(() => {
    const loadListings = async () => {
      const data = await fetchListings();
      // setListings(data); // This line is removed as per the new_code
    };

    loadListings();
  }, []);

  const handleInterested = (id: number, type: "private" | "external") => {
    setModalState({ isOpen: true, type });
  };

  const handleViewDetails = (id: number) => {
    setDetailsModal({ isOpen: true, listingId: id });
  };

  const closeModal = () => {
    setModalState({ ...modalState, isOpen: false });
  };

  const closeDetailsModal = () => {
    setDetailsModal({ isOpen: false, listingId: null });
  };

  return (
    <div className="min-h-screen bg-white">
      {!isLoggedIn && <Banner />}
      <SearchBar />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 pb-12">
        {/* Listings Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {listings.map((listing) => (
            <ListingCard
              key={listing.id}
              {...listing}
              isLoggedIn={isLoggedIn}
              onInterested={handleInterested}
              onViewDetails={onCardClick}
            />
          ))}
        </div>
      </div>

      {/* CTA Modal */}
      <CTAModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        type={modalState.type}
        isLoggedIn={isLoggedIn}
        onLogin={onLogin}
      />

      {/* Detailed View Modal */}
      {detailsModal.listingId && (
        <DetailedViewModal
          isOpen={detailsModal.isOpen}
          onClose={closeDetailsModal}
          listingId={detailsModal.listingId}
          isLoggedIn={isLoggedIn}
          onInterested={handleInterested}
        />
      )}
    </div>
  );
}
