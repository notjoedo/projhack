import {
  Search,
  PawPrint,
  DollarSign,
  X,
  Wand2,
  Clock,
  TrendingUp,
} from "lucide-react";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { useState, useRef, useEffect } from "react";

export function SearchBar() {
  const [searchValue, setSearchValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [tags, setTags] = useState([
    {
      id: 1,
      text: "Pet Friendly",
      icon: PawPrint,
      color: "bg-green-100 text-green-800",
    },
    {
      id: 2,
      text: "< $800",
      icon: DollarSign,
      color: "bg-blue-100 text-blue-800",
    },
  ]);

  const searchRef = useRef<HTMLDivElement>(null);

  const recentSearches = [
    "pet-friendly laundry <$800",
    "gym parking utilities included",
    "downtown studio <$600",
  ];

  const aiSuggestions = [
    "Apartments with a gym",
    "Pet-friendly places near campus",
    "Budget-friendly options with parking",
  ];

  const removeTag = (tagId: number) => {
    setTags(tags.filter((tag) => tag.id !== tagId));
  };

  const handleSearchSelect = (searchText: string) => {
    setSearchValue(searchText);
    setIsFocused(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="max-w-2xl mx-auto">
        <div ref={searchRef} className="relative">
          {/* AI Command Center Search Bar */}
          <div
            className={`relative glass-search rounded-xl p-3 transition-all duration-300 ${
              isFocused
                ? "ring-2 ring-primary/30 shadow-lg shadow-primary/10 bg-white/80"
                : "hover:shadow-md"
            }`}
          >
            <div className="relative">
              {/* Magic Wand Icon with Gradient */}
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                <Wand2
                  className={`w-5 h-5 transition-all duration-300 ${
                    isFocused
                      ? "text-primary animate-color-pulse"
                      : "text-primary"
                  }`}
                />
              </div>

              <Input
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onFocus={() => setIsFocused(true)}
                placeholder="try asking 'find me a 3 bedroom, girls only'"
                className="text-left pl-12 pr-4 py-4 text-lg rounded-xl border-0 bg-transparent focus:bg-transparent focus:ring-0 focus:outline-none transition-all placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* AI Command Dropdown Panel */}
          {isFocused && (
            <div className="absolute top-full left-0 right-0 mt-3 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-in slide-in-from-top-2 duration-200">
              <div className="p-4 space-y-4 text-left">
                {/* Recent Searches Section */}
                <div>
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                    Recent Searches
                  </h4>
                  <div className="space-y-1">
                    {recentSearches.map((search, index) => (
                      <button
                        key={index}
                        onClick={() => handleSearchSelect(search)}
                        className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors group"
                      >
                        <Clock className="w-4 h-4 text-gray-400 group-hover:text-gray-600 flex-shrink-0" />
                        <span className="text-gray-700 group-hover:text-gray-900 flex-1">
                          {search}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* AI Suggestions Section */}
                <div className="border-t border-gray-100 pt-4">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                    AI Suggestions
                  </h4>
                  <div className="space-y-1">
                    {aiSuggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSearchSelect(suggestion)}
                        className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-all group"
                      >
                        <TrendingUp className="w-4 h-4 text-primary group-hover:text-purple-600 flex-shrink-0" />
                        <span className="text-gray-700 group-hover:text-gray-900 flex-1">
                          {suggestion}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
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
