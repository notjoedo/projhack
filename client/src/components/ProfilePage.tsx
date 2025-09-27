import { useState } from "react";
import { ProfileHub } from "./profile-wizard/ProfileHub";
import { EssentialsStep } from "./profile-wizard/EssentialsStep";
import { DealBreakersStep } from "./profile-wizard/DealBreakersStep";
import { LifestyleVibeStep } from "./profile-wizard/LifestyleVibeStep";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";

export interface ProfileData {
  // Essentials
  name: string;
  university: string;
  graduationYear: string;
  budget: [number, number];
  roomType: string;
  moveInDate: string;
  
  // Deal-Breakers
  petFriendly: boolean | null;
  smokingAllowed: boolean | null;
  genderPreference: string | null;
  partiesOk: boolean | null;
  guestsOk: boolean | null;
  
  // Lifestyle Vibe
  cleanliness: number;
  socialLevel: number;
  noiseLevel: number;
  studyEnvironment: number;
}

export function ProfilePage() {
  const [view, setView] = useState<'hub' | 'edit'>('hub');
  const [editStep, setEditStep] = useState(1);
  
  // Mock profile data - in a real app this would come from user state/API
  const [profileData, setProfileData] = useState<ProfileData>({
    name: 'Sarah Johnson',
    university: 'University of California, Berkeley',
    graduationYear: '2026',
    budget: [800, 1400],
    roomType: 'private',
    moveInDate: '2024-08-15',
    petFriendly: false,
    smokingAllowed: false,
    genderPreference: 'same',
    partiesOk: null,
    guestsOk: true,
    cleanliness: 75,
    socialLevel: 60,
    noiseLevel: 30,
    studyEnvironment: 80,
  });

  const updateProfileData = (updates: Partial<ProfileData>) => {
    setProfileData(prev => ({ ...prev, ...updates }));
  };

  const handleEditSection = (step: number) => {
    setEditStep(step);
    setView('edit');
  };

  const handleSaveEdit = () => {
    setView('hub');
  };

  const handleCancelEdit = () => {
    setView('hub');
  };

  if (view === 'edit') {
    return (
      <div className="flex-1 p-8 bg-white">
        <div className="max-w-2xl mx-auto">
          {/* Edit Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h1 className="font-heading">Edit Profile</h1>
              <Button
                variant="outline"
                onClick={handleCancelEdit}
                className="px-6"
              >
                Cancel
              </Button>
            </div>
            <p className="text-subtle">
              {editStep === 1 && "Update your basic information"}
              {editStep === 2 && "Modify your deal-breakers"}
              {editStep === 3 && "Adjust your lifestyle preferences"}
            </p>
          </div>

          {/* Edit Steps */}
          <div className="min-h-[500px]">
            {editStep === 1 && (
              <EssentialsStep 
                profileData={profileData}
                onUpdate={updateProfileData}
              />
            )}
            {editStep === 2 && (
              <DealBreakersStep 
                profileData={profileData}
                onUpdate={updateProfileData}
              />
            )}
            {editStep === 3 && (
              <LifestyleVibeStep 
                profileData={profileData}
                onUpdate={updateProfileData}
              />
            )}
          </div>

          {/* Save Button */}
          <div className="flex justify-center pt-8">
            <Button
              onClick={handleSaveEdit}
              className="gradient-primary hover:opacity-90 text-white rounded-xl px-8 shadow-lg"
            >
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ProfileHub 
      profileData={profileData} 
      onEditSection={handleEditSection}
    />
  );
}