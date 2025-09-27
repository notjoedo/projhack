import { X } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";

export function Banner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-primary">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-primary text-lg">✨</span>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-gray-900">
                <span className="font-medium">Create a profile</span> to get your personalized AI matches!
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-primary hover:text-primary/80 hover:bg-primary/10"
            >
              Get Started
            </Button>
            <button
              onClick={() => setIsVisible(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}