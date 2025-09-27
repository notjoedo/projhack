import { InquiryCard } from "../components/InquiryCard";
import { GroupCard } from "../components/GroupCard";
import { EmptyState } from "../components/EmptyState";

export function InquiriesPage() {
  // Mock data for sent inquiries
  const sentInquiries = [
    {
      id: 1,
      image:
        "https://images.unsplash.com/photo-1723468357904-22ea41bc4157?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhcGFydG1lbnQlMjBiZWRyb29tJTIwc3R1ZGVudCUyMGhvdXNpbmd8ZW58MXx8fHwxNzU4OTY2NjI0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      address: "123 Main St, Blacksburg",
      price: 850,
      contactedDate: "Dec 15, 2024",
    },
    {
      id: 2,
      image:
        "https://images.unsplash.com/photo-1579632151052-92f741fb9b79?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3p5JTIwc3R1ZGVudCUyMGFwYXJ0bWVudCUyMGxpdmluZyUyMHJvb218ZW58MXx8fHwxNzU4OTY2NjI3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      address: "456 College Ave, Blacksburg",
      price: 720,
      contactedDate: "Dec 12, 2024",
    },
  ];

  // Mock data for potential groups
  const potentialGroups = [
    {
      id: 3,
      image:
        "https://images.unsplash.com/photo-1665937863545-4978231e3a04?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaGFyZWQlMjBzdHVkZW50JTIwaG91c2luZyUyMGtpdGNoZW4lMjBtb2Rlcm58ZW58MXx8fHwxNzU4OTY2NjI5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      address: "789 University Blvd, Blacksburg",
      price: 950,
    },
  ];

  const handleViewListing = (id: number) => {
    console.log("View listing:", id);
    // Handle view listing action
  };

  const handleShareGroup = (id: number) => {
    console.log("Share group:", id);
    // Handle share group action
  };

  return (
    <div className="flex-1 p-8 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="font-heading">My Inquiries & Groups</h1>
          <p className="text-subtle">
            Track your housing applications and group planning
          </p>
        </div>

        <div className="space-y-12">
          {/* Sent Inquiries Section */}
          <section>
            <h2 className="mb-6">Sent Inquiries</h2>
            <div className="space-y-4">
              {sentInquiries.length > 0 ? (
                sentInquiries.map((inquiry) => (
                  <div
                    key={inquiry.id}
                    className="glass rounded-xl p-6 border border-white/20"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <img
                          src={inquiry.image}
                          alt="Property"
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {inquiry.address}
                          </h3>
                          <p className="text-subtle">
                            Contacted {inquiry.contactedDate}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          ${inquiry.price}/month
                        </p>
                        <button
                          onClick={() => handleViewListing(inquiry.id)}
                          className="text-primary hover:text-primary/80 text-sm"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="glass rounded-xl p-12 text-center border border-white/20">
                  <h3 className="mb-4">No Inquiries Yet</h3>
                  <p className="text-subtle">
                    Your sent inquiries will appear here
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* Potential Groups Section */}
          <section>
            <h2 className="mb-6">Potential Groups</h2>
            <div className="space-y-4">
              {potentialGroups.length > 0 ? (
                potentialGroups.map((group) => (
                  <div
                    key={group.id}
                    className="glass rounded-xl p-6 border border-white/20"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <img
                          src={group.image}
                          alt="Property"
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {group.address}
                          </h3>
                          <p className="text-subtle">Potential group housing</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          ${group.price}/month
                        </p>
                        <button
                          onClick={() => handleShareGroup(group.id)}
                          className="gradient-primary hover:opacity-90 text-white rounded-xl px-4 py-2 text-sm shadow-lg"
                        >
                          Share Group
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="glass rounded-xl p-12 text-center border border-white/20">
                  <h3 className="mb-4">No Groups Yet</h3>
                  <p className="text-subtle mb-6">
                    Start connecting with other students to form a group
                  </p>
                  <button className="gradient-primary hover:opacity-90 text-white rounded-xl px-6 py-3 shadow-lg">
                    Browse Listings
                  </button>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
