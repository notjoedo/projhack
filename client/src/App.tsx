import "./App.css";
import Sidebar from "./components/Sidebar";
import SearchBar from "./components/SearchBar";
import DashboardContent from "./components/DashboardContent";

function App() {
  return (
    <div className="dashboard-container">
      <Sidebar />
      <main className="main-content">
        <header className="main-header">
          <SearchBar />
        </header>
        <DashboardContent />
      </main>
    </div>
  );
}

export default App;
