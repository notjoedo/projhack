import {
  Bed,
  Bath,
  Heart,
  Check,
  X,
  Sparkles,
  Shield,
  PawPrint,
  DollarSign,
  MapPin,
  Users,
  Shirt,
  Star,
  Home,
  Wand2,
} from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { useState } from "react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface SmartChip {
  type: "match" | "warning" | "insight";
  icon: React.ComponentType<{ className?: string }>;
  text: string;
}

interface ListingCardProps {
  id: number;
  image: string;
  price: number;
  address: string;
  beds: number;
  baths: number;
  matchScore?: number;
  isPrivate: boolean;
  isLoggedIn: boolean;
  onInterested: (id: number, type: "private" | "external") => void;
  onViewDetails?: (id: number) => void;
}

export function ListingCard({
  id,
  image,
  price,
  address,
  beds,
  baths,
  matchScore,
  isPrivate,
  isLoggedIn,
  onInterested,
  onViewDetails,
}: ListingCardProps) {
  const [isLiked, setIsLiked] = useState(false);

  // Generate smart chips based on listing data and user preferences
  const getSmartChips = (): SmartChip[] => {
    if (!isLoggedIn) return [];

    const chips: SmartChip[] = [];

    // Budget chip (always show for logged in users)
    if (price <= 800) {
      chips.push({
        type: "match",
        icon: DollarSign,
        text: "Fits Your Budget",
      });
    }

    // Pet policy chip
    if (id === 2 || id === 4) {
      // Mock: some listings don't allow pets
      chips.push({
        type: "warning",
        icon: X,
        text: "No Pets Allowed",
      });
    } else {
      chips.push({
        type: "match",
        icon: PawPrint,
        text: "Pet Friendly",
      });
    }

    // Diverse AI Insight chips based on listing ID
    if (id === 1) {
      chips.push({
        type: "insight",
        icon: Sparkles,
        text: "Quiet Area",
      });
    } else if (id === 2) {
      chips.push({
        type: "insight",
        icon: MapPin,
        text: "Walkable Campus",
      });
    } else if (id === 3) {
      chips.push({
        type: "insight",
        icon: Users,
        text: "Social Building",
      });
    } else {
      chips.push({
        type: "insight",
        icon: Star,
        text: "Top Rated",
      });
    }

    // Additional contextual chips
    if (isPrivate) {
      chips.push({
        type: "insight",
        icon: Home,
        text: "Direct Owner",
      });
    } else if (id === 2) {
      chips.push({
        type: "match",
        icon: Shirt,
        text: "Laundry On-Site",
      });
    }

    return chips.slice(0, 4); // Limit to 4 chips max
  };

  const getAIDescriptor = (): string => {
    if (!isLoggedIn) return "Log in to see personalized insights";

    const hasNoPets = id === 2 || id === 4;
    const isAffordable = price <= 800;

    if (isAffordable && !hasNoPets) {
      return "A great budget fit in a quiet neighborhood with pet-friendly policies.";
    } else if (isAffordable && hasNoPets) {
      return "A great budget fit in a quiet neighborhood, but it's not pet-friendly.";
    } else if (!isAffordable && !hasNoPets) {
      return "Premium location with excellent amenities and pet-friendly policies.";
    } else {
      return "Well-located property with good amenities, though pets aren't allowed.";
    }
  };

  const smartChips = getSmartChips();
  const aiDescriptor = getAIDescriptor();

  const getChipStyles = (type: SmartChip["type"]) => {
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

  return (
    <div
      className="gradient-card backdrop-blur-sm rounded-xl border border-white/20 hover:shadow-xl hover:bg-white/85 transition-all duration-200 overflow-hidden flex flex-col h-full cursor-pointer group"
      onClick={() => onViewDetails?.(id)}
    >
      {/* Image */}
      <div className="relative">
        <ImageWithFallback
          src={image}
          alt="Listing image"
          className="w-full h-48 object-cover"
        />

        {/* Heart icon */}
        {isLoggedIn && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsLiked(!isLiked);
            }}
            className="absolute top-3 right-3 w-8 h-8 glass-subtle rounded-full flex items-center justify-center hover:opacity-90 transition-all"
          >
            <Heart
              className={`w-4 h-4 ${
                isLiked ? "fill-red-500 text-red-500" : "text-gray-600"
              }`}
            />
          </button>
        )}

        {/* Private listing badge */}
        {isPrivate && (
          <Badge className="absolute top-3 left-3 bg-white/90 text-gray-700 border-0 rounded-full px-3 py-1 flex items-center gap-1 text-xs font-medium">
            <Shield className="w-3 h-3" />
            Private Listing
          </Badge>
        )}
      </div>

      {/* Content - Flexible grow area */}
      <div className="p-5 flex flex-col flex-1">
        {/* Smart Chips Section - Primary Focus */}
        {isLoggedIn && smartChips.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1.5">
              {smartChips.map((chip, index) => {
                const IconComponent = chip.icon;
                return (
                  <div
                    key={index}
                    className={`px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1 transition-all duration-200 hover:scale-105 ${getChipStyles(
                      chip.type
                    )}`}
                  >
                    <IconComponent className="w-3 h-3" />
                    <span>{chip.text}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* AI Insight Block - Secondary Focus */}
        {isLoggedIn && (
          <div className="mb-4 bg-gradient-to-r from-blue-50/70 to-purple-50/70 border border-blue-100/50 rounded-lg p-3">
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
              <p className="text-gray-600 italic text-sm leading-relaxed flex-1">
                {aiDescriptor}
              </p>
            </div>
          </div>
        )}

        {/* Core Info - Grows to fill available space */}
        <div className="space-y-3 flex-1">
          {/* Price */}
          <div>
            <span className="text-xl font-semibold text-gray-700">
              ${price}
            </span>
            <span className="text-gray-500 ml-1">/ month</span>
          </div>

          {/* Address */}
          <p className="text-gray-600 text-sm">{address}</p>

          {/* Bed/Bath */}
          <div className="flex items-center gap-4 text-gray-500 text-sm">
            <div className="flex items-center gap-1">
              <Bed className="w-4 h-4" />
              <span>
                {beds} Bed{beds !== 1 ? "s" : ""}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Bath className="w-4 h-4" />
              <span>
                {baths} Bath{baths !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Card Footer - Always at bottom */}
      <div className="p-5 pt-0 mt-auto">
        <Button
          onClick={(e) => {
            e.stopPropagation();
            onInterested(id, isPrivate ? "private" : "external");
          }}
          className="w-full gradient-primary hover:opacity-90 text-white rounded-xl py-3 shadow-lg group-hover:shadow-xl transition-all duration-200"
        >
          Request to Join
        </Button>
      </div>
    </div>
  );
}
