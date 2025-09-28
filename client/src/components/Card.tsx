import { FiHeart, FiCheck, FiX, FiMapPin, FiBriefcase } from "react-icons/fi";
import {
  FaWandMagicSparkles,
  FaBed,
  FaBath,
  FaRulerCombined,
} from "react-icons/fa6";
import "./Card.css";

export type Listing = {
  id: number;
  name: string;
  address: string;
  price: number;
  beds: number;
  baths: number;
  sqft: number;
  description: string;
  tags: string[];
  imageUrl: string;
  pros: string[];
  cons: string[];
  goodToKnow: string[];
  galleryImages: string[];
};

type CardProps = {
  listing: Listing;
};

const Card = ({ listing }: CardProps) => {
  return (
    <div className="listing-card">
      <div className="listing-card-top">
        <div className="listing-image">
          <img src={listing.imageUrl} alt={listing.name} />
        </div>
        <div className="listing-details">
          <div className="listing-tags">
            {listing.tags.map((tag) => (
              <span
                key={tag}
                className={`tag ${tag.toLowerCase().replace(" ", "-")}`}
              >
                {tag === "Pet Friendly" && <FiCheck />}
                {tag === "Direct Owner" && <FiBriefcase />}
                {tag}
              </span>
            ))}
          </div>
          <div className="listing-title">
            <h3>{listing.name}</h3>
            <p className="listing-address">
              <FiMapPin /> {listing.address}
            </p>
          </div>
          <div className="listing-price-details">
            <div className="listing-price">
              <span className="price">${listing.price}</span>
              <span className="period">/ month</span>
            </div>
            <div className="listing-specs">
              <span>
                <FaBed /> {listing.beds} Bed
              </span>
              <span className="separator">•</span>
              <span>
                <FaBath /> {listing.baths} Bath
              </span>
              <span className="separator">•</span>
              <span>
                <FaRulerCombined /> {listing.sqft} sqft
              </span>
            </div>
          </div>
          <p className="listing-description">{listing.description}</p>
        </div>
      </div>
      <hr className="divider" />
      <div className="ai-summary">
        <h4>HokieHome's AI Summary</h4>
        <div className="summary-columns">
          <div className="summary-column pros">
            <h5>
              <FiCheck /> Pros
            </h5>
            <ul>
              {listing.pros.map((pro) => (
                <li key={pro}>{pro}</li>
              ))}
            </ul>
          </div>
          <div className="summary-column cons">
            <h5>
              <FiX /> Cons
            </h5>
            <ul>
              {listing.cons.map((con) => (
                <li key={con}>{con}</li>
              ))}
            </ul>
          </div>
          <div className="summary-column good-to-know">
            <h5>
              <FaWandMagicSparkles /> Good to Know
            </h5>
            <ul>
              {listing.goodToKnow.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="photo-gallery">
        <h4>Photo Gallery</h4>
        <div className="gallery-images">
          {listing.galleryImages.map((image, index) => (
            <img key={index} src={image} alt={`Gallery image ${index + 1}`} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Card;
