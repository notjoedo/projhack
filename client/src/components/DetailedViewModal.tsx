import React, { useState, useEffect } from "react";
import {
  X,
  Heart,
  ChevronLeft,
  ChevronRight,
  Bed,
  Bath,
  Car,
  Wifi,
  Dumbbell,
  Shield,
  PawPrint,
  Snowflake,
  Zap,
  Coffee,
  Sparkles,
  MapPin,
  Users,
  Star,
  Home,
  DollarSign,
  Wand2,
  Check,
  AlertTriangle,
} from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Listing } from "../types";
import { findListingById } from "../services/listingService";

interface DetailedViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  listingId: number;
  isLoggedIn: boolean;
  onInterested: (id: number, type: "private" | "external") => void;
}

interface SmartChip {
  type: string;
  icon: React.ElementType;
  text: string;
}

export function DetailedViewModal({
  isOpen,
  onClose,
  listingId,
  isLoggedIn,
  onInterested,
}: DetailedViewModalProps) {
  const [listing, setListing] = useState<Listing | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    if (isOpen && listingId) {
      const loadListing = async () => {
        const data = await findListingById(listingId);
        if (data) {
          setListing(data);
        }
      };
      loadListing();
    }
  }, [isOpen, listingId]);

  if (!listing) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] flex items-center justify-center">
          <div>Loading...</div>
        </DialogContent>
      </Dialog>
    );
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === listing.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? listing.images.length - 1 : prev - 1
    );
  };

  // AI Match Report Data
  const getMatchReport = () => {
    const criteria = [
      {
        label: "Budget Range",
        match: listing.price <= 800,
        weight: "High Priority",
      },
      {
        label: "Pet Policy",
        match: listing.id !== 2 && listing.id !== 4,
        weight: "High Priority",
      },
      {
        label: "Quiet Area",
        match: listing.id === 1,
        weight: "Medium Priority",
      },
      {
        label: "Walkable to Campus",
        match: listing.id === 2 || listing.id === 3,
        weight: "Medium Priority",
      },
      {
        label: "Laundry On-Site",
        match: listing.amenities.includes("Laundry"),
        weight: "Low Priority",
      },
      {
        label: "Parking Available",
        match: listing.amenities.includes("Parking"),
        weight: "Medium Priority",
      },
    ];

    const matchedCount = criteria.filter((c) => c.match).length;
    const matchPercentage = Math.round((matchedCount / criteria.length) * 100);

    return { criteria, matchPercentage };
  };

  const { criteria, matchPercentage } = getMatchReport();

  // Smart Chips
  const getSmartChips = () => {
    const chips: SmartChip[] = [];

    if (listing.price <= 800) {
      chips.push({ type: "match", icon: DollarSign, text: "Fits Your Budget" });
    }

    if (listing.id !== 2 && listing.id !== 4) {
      chips.push({ type: "match", icon: PawPrint, text: "Pet Friendly" });
    } else {
      chips.push({
        type: "warning",
        icon: AlertTriangle,
        text: "No Pets Allowed",
      });
    }

    if (listing.id === 1) {
      chips.push({ type: "insight", icon: Sparkles, text: "Quiet Area" });
    } else if (listing.id === 2) {
      chips.push({ type: "insight", icon: MapPin, text: "Walkable Campus" });
    } else if (listing.id === 3) {
      chips.push({ type: "insight", icon: Users, text: "Social Building" });
    } else {
      chips.push({ type: "insight", icon: Star, text: "Top Rated" });
    }

    if (listing.isPrivate) {
      chips.push({ type: "insight", icon: Home, text: "Direct Owner" });
    }

    return chips.slice(0, 4);
  };

  const smartChips = getSmartChips();

  const getChipStyles = (type: string) => {
    switch (type) {
      case "match":
        return "chip-match";
      case "warning":
        return "chip-warning";
      case "insight":
        return "chip-insight";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getAIDescriptor = () => {
    const hasNoPets = listing.id === 2 || listing.id === 4;
    const isAffordable = listing.price <= 800;

    if (isAffordable && !hasNoPets) {
      return "A great budget fit in a quiet neighborhood with pet-friendly policies and excellent walkability.";
    } else if (isAffordable && hasNoPets) {
      return "A great budget fit in a quiet neighborhood with good amenities, though pets aren't allowed.";
    } else if (!isAffordable && !hasNoPets) {
      return "Premium location with excellent amenities, pet-friendly policies, and top-rated community features.";
    } else {
      return "Well-located property with good amenities and premium features, though pets aren't allowed.";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden p-0 gradient-modal [&>button]:hidden">
        <DialogHeader className="sr-only">
          <DialogTitle>Property Details for {listing.address}</DialogTitle>
          <DialogDescription>
            View detailed information about this {listing.beds}-bedroom,{" "}
            {listing.baths}-bathroom property including amenities, location, and
            AI match analysis.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col md:flex-row max-h-[90vh] overflow-hidden">
          {/* --- LEFT COLUMN (RED BOX) --- */}
          <div className="md:w-1/2 flex flex-col relative bg-white">
            {/* Header for the left column */}
            <div className="p-6 pb-4 border-b border-gray-100 flex-shrink-0">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-gray-800">
                    ${listing.price}/month
                  </h1>
                  <p className="text-lg text-gray-600">{listing.address}</p>
                </div>
                <button
                  onClick={onClose}
                  className="w-10 h-10 bg-gray-100/80 rounded-full flex items-center justify-center hover:bg-gray-200/80 transition-all ml-4 md:hidden"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Image Gallery */}
            <div className="relative flex-1 min-h-[320px]">
              <ImageWithFallback
                src={listing.images[currentImageIndex]}
                alt={`Listing image ${currentImageIndex + 1}`}
                className="w-full h-full object-cover"
              />

              {/* Navigation buttons */}
              {listing.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 glass-subtle rounded-full flex items-center justify-center hover:opacity-90 hover:scale-105 transition-all"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 glass-subtle rounded-full flex items-center justify-center hover:opacity-90 hover:scale-105 transition-all"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Image indicators */}
              {listing.images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {listing.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentImageIndex
                          ? "bg-white"
                          : "bg-white/60 hover:bg-white/80"
                      }`}
                    />
                  ))}
                </div>
              )}

              {/* Header overlay */}
              <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-start">
                {listing.isPrivate && (
                  <Badge className="bg-white/90 text-gray-700 border-0 rounded-full px-3 py-1 flex items-center gap-1 text-sm font-medium">
                    <Shield className="w-3 h-3" />
                    Private Listing
                  </Badge>
                )}
                <button
                  onClick={() => setIsLiked(!isLiked)}
                  className="w-10 h-10 glass-subtle rounded-full flex items-center justify-center hover:opacity-90 transition-all ml-auto"
                >
                  <Heart
                    className={`w-5 h-5 ${
                      isLiked ? "fill-red-500 text-red-500" : "text-gray-600"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* --- RIGHT COLUMN (GREEN BOX) --- */}
          <div className="md:w-1/2 flex flex-col overflow-hidden relative">
            {/* Close button for desktop */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-10 h-10 bg-gray-100/80 rounded-full items-center justify-center hover:bg-gray-200/80 transition-all z-20 hidden md:flex"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto overscroll-contain">
              <div className="p-6 space-y-8 pb-4">
                {/* Key Info Section */}
                <div className="space-y-6">
                  {/* Basic Info */}
                  <div className="flex items-center gap-8 text-gray-600">
                    <div className="flex items-center gap-2">
                      <Bed className="w-5 h-5 flex-shrink-0" />
                      <span className="font-medium">
                        {listing.beds} Bed{listing.beds !== 1 ? "s" : ""}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Bath className="w-5 h-5 flex-shrink-0" />
                      <span className="font-medium">
                        {listing.baths} Bath{listing.baths !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>

                  {/* Smart Chips */}
                  {isLoggedIn && smartChips.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-3">
                        Quick Insights
                      </h3>
                      <div className="flex flex-wrap gap-2 items-center">
                        {smartChips.map((chip, index) => {
                          const IconComponent = chip.icon;
                          return (
                            <div
                              key={index}
                              className={`px-3 py-2 rounded-full text-sm font-medium flex items-center gap-2 transition-all hover:scale-105 ${getChipStyles(
                                chip.type
                              )}`}
                            >
                              <IconComponent className="w-4 h-4 flex-shrink-0" />
                              <span className="whitespace-nowrap">
                                {chip.text}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* AI Match Report */}
                  {isLoggedIn && (
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100 rounded-xl p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 gradient-primary rounded-full flex items-center justify-center">
                          <Wand2 className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">
                            AI Match Report
                          </h3>
                          <p className="text-sm text-gray-600">
                            {matchPercentage}% match with your preferences
                          </p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        {criteria.map((criterion, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between"
                          >
                            <div className="flex items-center gap-3">
                              {criterion.match ? (
                                <Check className="w-4 h-4 text-green-600" />
                              ) : (
                                <AlertTriangle className="w-4 h-4 text-amber-500" />
                              )}
                              <span className="text-sm font-medium text-gray-700">
                                {criterion.label}
                              </span>
                            </div>
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                              {criterion.weight}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="mt-4 p-3 bg-white/70 rounded-lg">
                        <div className="flex items-start gap-2">
                          <Wand2
                            className="w-4 h-4 mt-0.5 flex-shrink-0"
                            style={{
                              background:
                                "linear-gradient(135deg, #007BFF 0%, #6C5CE7 100%)",
                              WebkitBackgroundClip: "text",
                              WebkitTextFillColor: "transparent",
                              backgroundClip: "text",
                            }}
                          />
                          <p className="text-gray-700 italic text-sm leading-relaxed">
                            {getAIDescriptor()}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Full Description */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    Description
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {listing.description}
                  </p>
                </div>

                {/* Amenities */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Amenities
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {listing.amenities.map((amenity, index) => {
                      const getAmenityIcon = (amenity: string) => {
                        switch (amenity.toLowerCase()) {
                          case "wifi":
                            return Wifi;
                          case "parking":
                            return Car;
                          case "gym":
                            return Dumbbell;
                          case "laundry":
                            return Sparkles;
                          case "air conditioning":
                            return Snowflake;
                          case "utilities included":
                            return Zap;
                          case "coffee bar":
                            return Coffee;
                          default:
                            return Check;
                        }
                      };

                      const IconComponent = getAmenityIcon(amenity);

                      return (
                        <div
                          key={index}
                          className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <IconComponent className="w-4 h-4 text-gray-600 flex-shrink-0" />
                          <span className="text-sm font-medium text-gray-700 flex-1">
                            {amenity}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Location Map Placeholder */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    Location
                  </h3>
                  <div className="bg-gray-100 rounded-xl h-64 flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <MapPin className="w-8 h-8 mx-auto mb-2" />
                      <p className="text-lg font-medium">Interactive Map</p>
                      <p className="text-sm">Location: {listing.address}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Sticky Footer */}
            <div className="flex-shrink-0 border-t border-gray-200 p-6 bg-white/95 backdrop-blur-sm">
              <div className="flex items-center justify-between gap-6">
                <div className="flex-1">
                  <p className="text-2xl font-bold text-gray-800">
                    ${listing.price}/month
                  </p>
                  <p className="text-sm text-gray-600">{listing.address}</p>
                </div>
                <div className="flex-shrink-0">
                  <Button
                    onClick={() =>
                      onInterested(
                        listing.id,
                        listing.isPrivate ? "private" : "external"
                      )
                    }
                    className="gradient-primary hover:opacity-90 text-white rounded-xl px-8 py-3 shadow-lg whitespace-nowrap"
                  >
                    Request to Join
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
