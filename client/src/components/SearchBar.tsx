import { useState } from "react";
import { FaWandMagicSparkles } from "react-icons/fa6";
import SearchSuggestions from "./SearchSuggestions";
import "./SearchBar.css";

const SearchBar = () => {
  const [isActive, setIsActive] = useState(false);
  const [query, setQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState([
    "pet-friendly laundry <$800",
    "gym parking utilities included",
    "downtown studio <$600",
  ]);

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    if (!recentSearches.includes(suggestion)) {
      setRecentSearches([suggestion, ...recentSearches].slice(0, 3));
    }
    setIsActive(false);
  };

  return (
    <div className="search-bar-container">
      <div
        className={`search-bar ${isActive ? "active" : ""}`}
        onFocus={() => setIsActive(true)}
        onBlur={() => setIsActive(false)}
      >
        <FaWandMagicSparkles />
        <input
          type="text"
          placeholder="Ask me to find your perfect home"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      {isActive && (
        <SearchSuggestions
          recentSearches={recentSearches}
          onSuggestionClick={handleSuggestionClick}
        />
      )}
    </div>
  );
};

export default SearchBar;
