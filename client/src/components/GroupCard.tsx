import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface GroupCardProps {
  id: number;
  image: string;
  address: string;
  price: number;
  onShareGroup: (id: number) => void;
}

export function GroupCard({ 
  id, 
  image, 
  address, 
  price, 
  onShareGroup 
}: GroupCardProps) {
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
      </div>

      {/* Action */}
      <div className="flex-shrink-0">
        <Button
          onClick={() => onShareGroup(id)}
          className="bg-primary hover:bg-primary/90 text-white rounded-xl"
        >
          Share Group Link
        </Button>
      </div>
    </div>
  );
}