import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface InquiryCardProps {
  id: number;
  image: string;
  address: string;
  price: number;
  contactedDate: string;
  onViewListing: (id: number) => void;
}

export function InquiryCard({ 
  id, 
  image, 
  address, 
  price, 
  contactedDate, 
  onViewListing 
}: InquiryCardProps) {
  return (
    <div className="glass rounded-lg p-4 flex items-center gap-4 hover:shadow-xl transition-all duration-200">
      {/* Thumbnail */}
      <div className="flex-shrink-0">
        <ImageWithFallback
          src={image}
          alt="Property thumbnail"
          className="w-16 h-16 object-cover rounded-lg"
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-gray-900 truncate">{address}</h3>
        <p className="text-gray-600">${price} / month</p>
        <p className="text-sm text-gray-500">Contacted on: {contactedDate}</p>
      </div>

      {/* Action */}
      <div className="flex-shrink-0">
        <Button
          variant="outline"
          onClick={() => onViewListing(id)}
          className="rounded-xl border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          View Listing
        </Button>
      </div>
    </div>
  );
}