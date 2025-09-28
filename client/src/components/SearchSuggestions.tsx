import { FiClock, FiTrendingUp } from "react-icons/fi";
import "./SearchSuggestions.css";

type SearchSuggestionsProps = {
  recentSearches: string[];
  onSuggestionClick: (suggestion: string) => void;
};

const SearchSuggestions = ({
  recentSearches,
  onSuggestionClick,
}: SearchSuggestionsProps) => {
  const aiSuggestions = [
    "Apartments with a gym",
    "Pet-friendly places near campus",
    "Budget-friendly options with parking",
  ];

  return (
    <div className="search-suggestions">
      <div className="suggestions-section">
        <h4>Recent Searches</h4>
        <ul>
          {recentSearches.map((search) => (
            <li
              key={search}
              className="suggestion-item"
              onMouseDown={() => onSuggestionClick(search)}
            >
              <FiClock />
              <span>{search}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="suggestions-section">
        <h4>AI Suggestions</h4>
        <ul>
          {aiSuggestions.map((suggestion) => (
            <li
              key={suggestion}
              className="suggestion-item ai-suggestion"
              onMouseDown={() => onSuggestionClick(suggestion)}
            >
              <FiTrendingUp />
              <span>{suggestion}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SearchSuggestions;
