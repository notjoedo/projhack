import { useState } from "react";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { EssentialsStep } from "./profile-wizard/EssentialsStep";
import { DealBreakersStep } from "./profile-wizard/DealBreakersStep";
import { LifestyleVibeStep } from "./profile-wizard/LifestyleVibeStep";

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

interface OnboardingPageProps {
  onComplete: (profileData: ProfileData) => void;
}

export function OnboardingPage({ onComplete }: OnboardingPageProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [profileData, setProfileData] = useState<ProfileData>({
    name: '',
    university: '',
    graduationYear: '',
    budget: [600, 1200],
    roomType: '',
    moveInDate: '',
    petFriendly: null,
    smokingAllowed: null,
    genderPreference: null,
    partiesOk: null,
    guestsOk: null,
    cleanliness: 50,
    socialLevel: 50,
    noiseLevel: 50,
    studyEnvironment: 50,
  });

  const updateProfileData = (updates: Partial<ProfileData>) => {
    setProfileData(prev => ({ ...prev, ...updates }));
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(profileData);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getProgress = () => (currentStep / 3) * 100;

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-8">
      <div className="max-w-2xl w-full">
        {/* Onboarding Header */}
        <div className="mb-8 text-center">
          <h1 className="font-heading mb-4">Welcome to HouseAI!</h1>
          <div className="flex items-center justify-between mb-4">
            <p className="text-subtle">
              Let's set up your housing preferences
            </p>
            <div className="text-subtle">
              Step {currentStep} of 3
            </div>
          </div>
          <Progress value={getProgress()} className="h-2 mb-2" />
          <p className="text-subtle">
            {currentStep === 1 && "Let's start with the basics"}
            {currentStep === 2 && "What are your absolute deal-breakers?"}
            {currentStep === 3 && "Tell us about your lifestyle preferences"}
          </p>
        </div>

        {/* Wizard Steps */}
        <div className="min-h-[500px]">
          {currentStep === 1 && (
            <EssentialsStep 
              profileData={profileData}
              onUpdate={updateProfileData}
            />
          )}
          {currentStep === 2 && (
            <DealBreakersStep 
              profileData={profileData}
              onUpdate={updateProfileData}
            />
          )}
          {currentStep === 3 && (
            <LifestyleVibeStep 
              profileData={profileData}
              onUpdate={updateProfileData}
            />
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-8">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1}
            className="px-8"
          >
            Back
          </Button>
          <Button
            onClick={handleNext}
            className="gradient-primary hover:opacity-90 text-white rounded-xl px-8 shadow-lg"
          >
            {currentStep === 3 ? 'Complete Setup' : 'Next'}
          </Button>
        </div>
      </div>
    </div>
  );
}