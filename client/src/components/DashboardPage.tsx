import { useState } from "react";
import { Banner } from "./Banner";
import { SearchBar } from "./SearchBar";
import { ListingCard } from "./ListingCard";
import { CTAModal } from "./CTAModal";
import { DetailedViewModal } from "./DetailedViewModal";

export function DashboardPage() {
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    type: 'private' | 'external';
  }>({
    isOpen: false,
    type: 'private'
  });

  const [detailsModal, setDetailsModal] = useState<{
    isOpen: boolean;
    listingId: number | null;
  }>({
    isOpen: false,
    listingId: null
  });

  // Mock user state - can toggle between logged in/out for demonstration
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const handleInterested = (id: number, type: 'private' | 'external') => {
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

  // Enhanced mock listing data with multiple images and detailed info
  const listings = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1723468357904-22ea41bc4157?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhcGFydG1lbnQlMjBiZWRyb29tJTIwc3R1ZGVudCUyMGhvdXNpbmd8ZW58MXx8fHwxNzU4OTY2NjI0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      images: [
        "https://images.unsplash.com/photo-1723468357904-22ea41bc4157?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhcGFydG1lbnQlMjBiZWRyb29tJTIwc3R1ZGVudCUyMGhvdXNpbmd8ZW58MXx8fHwxNzU4OTY2NjI0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        "https://images.unsplash.com/photo-1579632151052-92f741fb9b79?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3p5JTIwc3R1ZGVudCUyMGFwYXJ0bWVudCUyMGxpdmluZyUyMHJvb218ZW58MXx8fHwxNzU4OTY2NjI3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        "https://images.unsplash.com/photo-1665937863545-4978231e3a04?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaGFyZWQlMjBzdHVkZW50JTIwaG91c2luZyUyMGtpdGNoZW4lMjBtb2Rlcm58ZW58MXx8fHwxNzU4OTY2NjI5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
      ],
      price: 850,
      address: "123 Main St, Blacksburg",
      beds: 3,
      baths: 2,
      matchScore: 92,
      isPrivate: true,
      description: "Beautiful 3-bedroom, 2-bathroom apartment in a quiet residential area. This spacious unit features modern appliances, hardwood floors, and large windows that fill the space with natural light. Perfect for students who appreciate a peaceful environment while still being close to campus.",
      amenities: ["Wifi", "Parking", "Laundry", "Air Conditioning", "Utilities Included"]
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1579632151052-92f741fb9b79?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3p5JTIwc3R1ZGVudCUyMGFwYXJ0bWVudCUyMGxpdmluZyUyMHJvb218ZW58MXx8fHwxNzU4OTY2NjI3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      images: [
        "https://images.unsplash.com/photo-1579632151052-92f741fb9b79?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3p5JTIwc3R1ZGVudCUyMGFwYXJ0bWVudCUyMGxpdmluZyUyMHJvb218ZW58MXx8fHwxNzU4OTY2NjI3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        "https://images.unsplash.com/photo-1665937863545-4978231e3a04?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaGFyZWQlMjBzdHVkZW50JTIwaG91c2luZyUyMGtpdGNoZW4lMjBtb2Rlcm58ZW58MXx8fHwxNzU4OTY2NjI5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
      ],
      price: 720,
      address: "456 College Ave, Blacksburg",
      beds: 2,
      baths: 1,
      matchScore: 85,
      isPrivate: false,
      description: "Cozy 2-bedroom apartment right on College Avenue, perfect for students who want to be in the heart of campus life. Walking distance to all major campus buildings, with easy access to dining and entertainment options.",
      amenities: ["Wifi", "Laundry", "Air Conditioning"]
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1665937863545-4978231e3a04?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaGFyZWQlMjBzdHVkZW50JTIwaG91c2luZyUyMGtpdGNoZW4lMjBtb2Rlcm58ZW58MXx8fHwxNzU4OTY2NjI5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      images: [
        "https://images.unsplash.com/photo-1665937863545-4978231e3a04?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaGFyZWQlMjBzdHVkZW50JTIwaG91c2luZyUyMGtpdGNoZW4lMjBtb2Rlcm58ZW58MXx8fHwxNzU4OTY2NjI5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        "https://images.unsplash.com/photo-1723468357904-22ea41bc4157?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhcGFydG1lbnQlMjBiZWRyb29tJTIwc3R1ZGVudCUyMGhvdXNpbmd8ZW58MXx8fHwxNzU4OTY2NjI0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        "https://images.unsplash.com/photo-1579632151052-92f741fb9b79?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3p5JTIwc3R1ZGVudCUyMGFwYXJ0bWVudCUyMGxpdmluZyUyMHJvb218ZW58MXx8fHwxNzU4OTY2NjI3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
      ],
      price: 950,
      address: "789 University Blvd, Blacksburg",
      beds: 4,
      baths: 3,
      matchScore: 78,
      isPrivate: true,
      description: "Luxury 4-bedroom, 3-bathroom house perfect for a group of friends. Features include a modern kitchen with granite countertops, spacious bedrooms, and a large living area ideal for socializing and studying together.",
      amenities: ["Wifi", "Parking", "Gym", "Laundry", "Air Conditioning", "Coffee Bar"]
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1713346774461-f93209c40386?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicmlnaHQlMjBzdHVkaW8lMjBhcGFydG1lbnQlMjBzdHVkZW50fGVufDF8fHx8MTc1ODk2NjYzMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      images: [
        "https://images.unsplash.com/photo-1713346774461-f93209c40386?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicmlnaHQlMjBzdHVkaW8lMjBhcGFydG1lbnQlMjBzdHVkZW50fGVufDF8fHx8MTc1ODk2NjYzMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        "https://images.unsplash.com/photo-1579632151052-92f741fb9b79?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3p5JTIwc3R1ZGVudCUyMGFwYXJ0bWVudCUyMGxpdmluZyUyMHJvb218ZW58MXx8fHwxNzU4OTY2NjI3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
      ],
      price: 650,
      address: "321 Oak Street, Blacksburg",
      beds: 1,
      baths: 1,
      matchScore: 88,
      isPrivate: false,
      description: "Bright and efficient studio apartment perfect for students who value simplicity and affordability. Features a compact but well-designed layout with everything you need for comfortable student living.",
      amenities: ["Wifi", "Laundry", "Utilities Included"]
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Banner />
      <SearchBar />
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 pb-12">
        {/* Debug Toggle (for demonstration) */}
        <div className="mb-6 flex justify-center">
          <button
            onClick={() => setIsLoggedIn(!isLoggedIn)}
            className="text-sm text-gray-500 hover:text-gray-700 px-4 py-2 glass-subtle rounded-lg"
          >
            {isLoggedIn ? "Switch to Logged Out View" : "Switch to Logged In View"}
          </button>
        </div>

        {/* Listings Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {listings.map((listing) => (
            <ListingCard
              key={listing.id}
              id={listing.id}
              image={listing.image}
              price={listing.price}
              address={listing.address}
              beds={listing.beds}
              baths={listing.baths}
              matchScore={listing.matchScore}
              isPrivate={listing.isPrivate}
              isLoggedIn={isLoggedIn}
              onInterested={handleInterested}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>
      </div>

      {/* CTA Modal */}
      <CTAModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        type={modalState.type}
      />

      {/* Detailed View Modal */}
      {detailsModal.listingId && (
        <DetailedViewModal
          isOpen={detailsModal.isOpen}
          onClose={closeDetailsModal}
          listing={listings.find(l => l.id === detailsModal.listingId)!}
          isLoggedIn={isLoggedIn}
          onInterested={handleInterested}
        />
      )}
    </div>
  );
}