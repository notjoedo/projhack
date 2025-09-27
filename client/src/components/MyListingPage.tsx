import { useState } from "react";
import { Button } from "./ui/button";
import { ListingCard } from "./ListingCard";
import { ListingPerformance } from "./ListingPerformance";
import { Trash2, Home } from "lucide-react";

export function MyListingPage() {
  // Toggle this state to demo both views
  const [hasListing, setHasListing] = useState(true);
  
  // Mock listing data for the user's listing
  const userListing = {
    id: 999,
    image: "https://images.unsplash.com/photo-1723468357904-22ea41bc4157?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhcGFydG1lbnQlMjBiZWRyb29tJTIwc3R1ZGVudCUyMGhvdXNpbmd8ZW58MXx8fHwxNzU4OTY2NjI0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    price: 850,
    address: "123 Main St, Blacksburg",
    beds: 3,
    baths: 2,
    matchScore: undefined, // Don't show match score for own listing
    isPrivate: true
  };

  const handleEditListing = () => {
    console.log("Edit listing");
    // Handle edit listing action
  };

  const handleDuplicateListing = () => {
    console.log("Duplicate listing");
    // Handle duplicate listing action
  };

  const handleDeactivateListing = () => {
    console.log("Deactivate listing");
    setHasListing(false);
    // Handle deactivate listing action
  };

  const handleCreateListing = () => {
    console.log("Create listing");
    setHasListing(true);
    // Handle create listing action
  };

  const handleInterested = () => {
    // No-op for user's own listing
  };

  if (!hasListing) {
    // Empty State
    return (
      <div className="flex-1 p-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-md mx-auto text-center py-20">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Home className="w-10 h-10 text-primary" />
            </div>
            
            <h1 className="font-heading mb-4">
              Find the perfect roommate for your place.
            </h1>
            
            <Button 
              onClick={handleCreateListing}
              className="gradient-primary hover:opacity-90 text-white rounded-xl px-8 py-3 shadow-lg"
            >
              + Create Your Listing
            </Button>
          </div>
          
          {/* Demo toggle */}
          <div className="flex justify-center mt-8">
            <button
              onClick={() => setHasListing(true)}
              className="text-subtle hover:text-gray-700 px-4 py-2 border border-white/20 rounded-xl glass"
            >
              Switch to Active Listing View
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Active Listing State
  return (
    <div className="flex-1 p-8 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="font-heading">Manage Your Listing</h1>
          <p className="text-subtle">Edit your listing details and track performance</p>
        </div>

        <div className="max-w-2xl space-y-8">
          {/* User's Listing Card */}
          <div className="space-y-6">
            <ListingCard
              id={userListing.id}
              image={userListing.image}
              price={userListing.price}
              address={userListing.address}
              beds={userListing.beds}
              baths={userListing.baths}
              matchScore={userListing.matchScore}
              isPrivate={userListing.isPrivate}
              isLoggedIn={true}
              onInterested={handleInterested}
            />
            
            {/* Management Buttons */}
            <div className="space-y-3">
              <Button 
                onClick={handleEditListing}
                className="w-full gradient-primary hover:opacity-90 text-white rounded-xl py-3 shadow-lg"
              >
                Edit Listing
              </Button>
              
              <Button 
                onClick={handleDuplicateListing}
                variant="outline"
                className="w-full border-white/20 text-gray-700 hover:bg-white/50 rounded-xl py-3"
              >
                Duplicate for Next Year
              </Button>
              
              <button
                onClick={handleDeactivateListing}
                className="w-full flex items-center justify-center gap-2 text-subtle hover:text-red-600 transition-colors py-2"
              >
                <Trash2 className="w-4 h-4" />
                Deactivate Listing
              </button>
            </div>
          </div>

          {/* Listing Performance */}
          <ListingPerformance views={247} inquiries={12} />
        </div>
        
        {/* Demo toggle */}
        <div className="flex justify-center mt-12">
          <button
            onClick={() => setHasListing(false)}
            className="text-sm text-gray-500 hover:text-gray-700 px-4 py-2 glass-subtle rounded-lg"
          >
            Switch to Empty State View
          </button>
        </div>
      </div>
    </div>
  );
}