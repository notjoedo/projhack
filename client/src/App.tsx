import "./App.css";
import Sidebar from "./components/Sidebar";
import SearchBar from "./components/SearchBar";
import Listings from "./components/Listings";

function App() {
  return (
    <div className="dashboard-container">
      <Sidebar />
      <main className="main-content">
        <header className="main-header">
          <SearchBar />
        </header>
        <Listings />
      </main>
    </div>
  );
}

export default App;
