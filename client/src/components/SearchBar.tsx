import { FaWandMagicSparkles } from "react-icons/fa6";
import "./SearchBar.css";

const SearchBar = () => {
  return (
    <div className="search-bar">
      <FaWandMagicSparkles />
      <input type="text" placeholder="Ask me to find your perfect home" />
    </div>
  );
};

export default SearchBar;
