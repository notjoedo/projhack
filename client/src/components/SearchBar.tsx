import { Search, PawPrint, DollarSign, X } from "lucide-react";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { useState } from "react";

export function SearchBar() {
  const [searchValue, setSearchValue] = useState("pet-friendly laundry <$800");
  const [tags, setTags] = useState([
    { id: 1, text: "Pet Friendly", icon: PawPrint, color: "bg-green-100 text-green-800" },
    { id: 2, text: "< $800", icon: DollarSign, color: "bg-blue-100 text-blue-800" }
  ]);

  const removeTag = (tagId: number) => {
    setTags(tags.filter(tag => tag.id !== tagId));
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="relative glass-search rounded-lg p-3">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
            <Input
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Try 'pet-friendly', 'laundry', or '<$800'"
              className="pl-12 pr-4 py-4 text-lg rounded-lg border-0 bg-transparent focus:bg-transparent focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-gray-400"
            />
          </div>
        </div>
        
        {/* Search Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {tags.map((tag) => {
              const IconComponent = tag.icon;
              return (
                <Badge 
                  key={tag.id}
                  variant="secondary" 
                  className={`${tag.color} px-3 py-2 rounded-full flex items-center gap-2 text-sm font-medium border-0`}
                >
                  <IconComponent className="w-4 h-4" />
                  {tag.text}
                  <button
                    onClick={() => removeTag(tag.id)}
                    className="hover:bg-black/10 rounded-full p-0.5 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}