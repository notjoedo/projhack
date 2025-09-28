import { FiHeart, FiFilter, FiChevronDown } from "react-icons/fi";
import Card, { Listing } from "./Card";
import "./DashboardContent.css";

const mockListings: Listing[] = [
    {
      id: 1,
      name: "Listing name",
      address: "123 Main St, Blacksburg",
      price: 850,
      beds: 3,
      baths: 2,
      sqft: 1482,
      description: "Premium location with excellent amenities and pet-friendly policies. Perfect for blah blah blahdsakdhasdhsaodjskadlskajd",
      tags: ["Pet Friendly", "Quiet Area", "Direct Owner"],
      imageUrl: "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      pros: ["Premium location", "High-quality amenities", "Pet-friendly policies"],
      cons: [],
      goodToKnow: ["15-minute walk to campus", "Nearby grocery stores", "First month + security deposit required"],
      galleryImages: [
        "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        "https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        "https://images.pexels.com/photos/271816/pexels-photo-271816.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        "https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      ]
    },
    // ... you can add more mock listings here
  ];

const DashboardContent = () => {
  return (
    <section className="listings-section">
      <div className="listings-header">
        <h2>Showing {mockListings.length} of 124 listings</h2>
        <div className="listings-actions">
          <button className="btn-icon">
            <FiHeart />
          </button>
          <button className="btn filters-btn">
            <FiFilter />
            <span>Filters (1)</span>
            <FiChevronDown />
          </button>
          <button className="btn">
            <div className="sort-icon-placeholder" />
            <span>Sort</span>
            <FiChevronDown />
          </button>
        </div>
      </div>
      <div className="listings-content">
        {mockListings.map((listing) => (
          <Card key={listing.id} listing={listing} />
        ))}
      </div>
    </section>
  );
};

export default DashboardContent;
