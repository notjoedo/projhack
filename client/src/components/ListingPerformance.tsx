import { Eye, MessageSquare } from "lucide-react";

interface ListingPerformanceProps {
  views: number;
  inquiries: number;
}

export function ListingPerformance({ views, inquiries }: ListingPerformanceProps) {
  return (
    <div className="glass rounded-lg p-6">
      <h3 className="font-semibold text-gray-900 mb-4">Listing Performance</h3>
      
      <div className="grid grid-cols-2 gap-6">
        {/* Views */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
            <Eye className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-2xl font-semibold text-gray-900">{views}</p>
            <p className="text-sm text-gray-600">Views</p>
          </div>
        </div>
        
        {/* Inquiries */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="text-2xl font-semibold text-gray-900">{inquiries}</p>
            <p className="text-sm text-gray-600">Inquiries Received</p>
          </div>
        </div>
      </div>
    </div>
  );
}