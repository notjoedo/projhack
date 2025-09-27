import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { ProfileData } from "../ProfilePage";
import { 
  User, 
  GraduationCap, 
  Calendar, 
  DollarSign, 
  Home, 
  Heart, 
  Ban, 
  Users, 
  Music, 
  Sparkles, 
  BookOpen,
  Edit3,
  Check,
  X,
  Minus
} from "lucide-react";

interface ProfileHubProps {
  profileData: ProfileData;
  onEditSection: (step: number) => void;
}

export function ProfileHub({ profileData, onEditSection }: ProfileHubProps) {
  const formatBudget = (budget: [number, number]) => {
    return `$${budget[0]} - $${budget[1]}/month`;
  };

  const formatPreference = (value: boolean | null | string) => {
    if (value === true) return { icon: Check, text: "Yes", color: "text-green-600" };
    if (value === false) return { icon: X, text: "No", color: "text-red-600" };
    if (value === null) return { icon: Minus, text: "No preference", color: "text-gray-500" };
    return { icon: Check, text: value, color: "text-gray-700" };
  };

  const getVibeDescription = (value: number, leftLabel: string, rightLabel: string) => {
    if (value < 25) return `Strongly ${leftLabel.toLowerCase()}`;
    if (value < 50) return `Moderately ${leftLabel.toLowerCase()}`;
    if (value > 75) return `Strongly ${rightLabel.toLowerCase()}`;
    if (value > 50) return `Moderately ${rightLabel.toLowerCase()}`;
    return "Balanced";
  };

  return (
    <div className="flex-1 p-8 bg-white">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-heading">Profile Settings</h1>
          <p className="text-subtle">
            Manage your housing preferences and profile information. These settings help us find the best matches for you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Your Vitals */}
          <Card className="glass border border-white/20 p-6">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 gradient-primary rounded-lg flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <h2 className="font-heading">Your Vitals</h2>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEditSection(1)}
                className="text-primary hover:text-primary/80"
              >
                <Edit3 className="w-4 h-4 mr-1" />
                Edit
              </Button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <User className="w-5 h-5 text-gray-500" />
                <span className="font-medium">{profileData.name || "Not specified"}</span>
              </div>
              <div className="flex items-center space-x-3">
                <GraduationCap className="w-5 h-5 text-gray-500" />
                <span>{profileData.university || "Not specified"}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-gray-500" />
                <span>Graduating {profileData.graduationYear || "Not specified"}</span>
              </div>
              <div className="flex items-center space-x-3">
                <DollarSign className="w-5 h-5 text-gray-500" />
                <span>{formatBudget(profileData.budget)}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Home className="w-5 h-5 text-gray-500" />
                <span>{profileData.roomType || "Not specified"}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-gray-500" />
                <span>Move in by {profileData.moveInDate || "Not specified"}</span>
              </div>
            </div>
          </Card>

          {/* Your Deal-Breakers */}
          <Card className="glass border border-white/20 p-6">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 gradient-primary rounded-lg flex items-center justify-center">
                  <Ban className="w-5 h-5 text-white" />
                </div>
                <h2 className="font-heading">Your Deal-Breakers</h2>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEditSection(2)}
                className="text-primary hover:text-primary/80"
              >
                <Edit3 className="w-4 h-4 mr-1" />
                Edit
              </Button>
            </div>

            <div className="space-y-4">
              {[
                { label: "Pet-friendly place", value: profileData.petFriendly },
                { label: "Smoking allowed", value: profileData.smokingAllowed },
                { label: "Gender preference", value: profileData.genderPreference },
                { label: "Parties & gatherings", value: profileData.partiesOk },
                { label: "Overnight guests", value: profileData.guestsOk }
              ].map((item, index) => {
                const pref = formatPreference(item.value);
                const IconComponent = pref.icon;
                
                return (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-gray-700">{item.label}</span>
                    <div className={`flex items-center space-x-2 ${pref.color}`}>
                      <IconComponent className="w-4 h-4" />
                      <span className="font-medium">{pref.text}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Your Vibe */}
          <Card className="glass border border-white/20 p-6 lg:col-span-2">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 gradient-primary rounded-lg flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <h2 className="font-heading">Your Vibe</h2>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEditSection(3)}
                className="text-primary hover:text-primary/80"
              >
                <Edit3 className="w-4 h-4 mr-1" />
                Edit
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Sparkles className="w-5 h-5 text-gray-500" />
                  <div>
                    <div className="font-medium">Cleanliness</div>
                    <div className="text-sm text-gray-600">
                      {getVibeDescription(profileData.cleanliness, "Relaxed", "Spotless")}
                    </div>
                  </div>
                  <div className="ml-auto">
                    <div className="w-16 h-2 bg-gray-200 rounded-full">
                      <div 
                        className="h-2 bg-primary rounded-full" 
                        style={{ width: `${profileData.cleanliness}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Users className="w-5 h-5 text-gray-500" />
                  <div>
                    <div className="font-medium">Social Level</div>
                    <div className="text-sm text-gray-600">
                      {getVibeDescription(profileData.socialLevel, "Quiet", "Very Social")}
                    </div>
                  </div>
                  <div className="ml-auto">
                    <div className="w-16 h-2 bg-gray-200 rounded-full">
                      <div 
                        className="h-2 bg-primary rounded-full" 
                        style={{ width: `${profileData.socialLevel}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Music className="w-5 h-5 text-gray-500" />
                  <div>
                    <div className="font-medium">Noise Tolerance</div>
                    <div className="text-sm text-gray-600">
                      {getVibeDescription(profileData.noiseLevel, "Need Quiet", "Noise OK")}
                    </div>
                  </div>
                  <div className="ml-auto">
                    <div className="w-16 h-2 bg-gray-200 rounded-full">
                      <div 
                        className="h-2 bg-primary rounded-full" 
                        style={{ width: `${profileData.noiseLevel}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <BookOpen className="w-5 h-5 text-gray-500" />
                  <div>
                    <div className="font-medium">Study Environment</div>
                    <div className="text-sm text-gray-600">
                      {getVibeDescription(profileData.studyEnvironment, "Calm", "Energetic")}
                    </div>
                  </div>
                  <div className="ml-auto">
                    <div className="w-16 h-2 bg-gray-200 rounded-full">
                      <div 
                        className="h-2 bg-primary rounded-full" 
                        style={{ width: `${profileData.studyEnvironment}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Profile Status */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="font-medium text-green-800">Profile Complete</div>
                <div className="text-sm text-green-600">
                  All sections filled out and active
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <Heart className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="font-medium text-blue-800">Matching Active</div>
                <div className="text-sm text-blue-600">
                  Finding compatible housing options
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}