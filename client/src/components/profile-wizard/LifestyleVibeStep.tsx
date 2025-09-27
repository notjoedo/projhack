import { Slider } from "../ui/slider";
import { ProfileData } from "../ProfilePage";
import { Sparkles, Home, Volume2, VolumeX, BookOpen, Users, Zap, Bed } from "lucide-react";

interface LifestyleVibeStepProps {
  profileData: ProfileData;
  onUpdate: (updates: Partial<ProfileData>) => void;
}

interface VibeSlider {
  id: keyof ProfileData;
  question: string;
  description: string;
  leftLabel: string;
  rightLabel: string;
  leftIcon: any;
  rightIcon: any;
  value: number;
}

export function LifestyleVibeStep({ profileData, onUpdate }: LifestyleVibeStepProps) {
  const sliders: VibeSlider[] = [
    {
      id: 'cleanliness',
      question: "What's your cleaning style?",
      description: "Help us match you with similar cleanliness standards",
      leftLabel: "Relaxed & Lived-in",
      rightLabel: "Spotless & Organized",
      leftIcon: Home,
      rightIcon: Sparkles,
      value: profileData.cleanliness
    },
    {
      id: 'socialLevel',
      question: "How social are you at home?",
      description: "Do you prefer quiet time or hanging out with roommates?",
      leftLabel: "Quiet Homebody",
      rightLabel: "Very Social",
      leftIcon: Bed,
      rightIcon: Users,
      value: profileData.socialLevel
    },
    {
      id: 'noiseLevel',
      question: "What's your noise tolerance?",
      description: "Music, TV, conversations - how much is too much?",
      leftLabel: "Need Quiet",
      rightLabel: "Noise Doesn't Bother Me",
      leftIcon: VolumeX,
      rightIcon: Volume2,
      value: profileData.noiseLevel
    },
    {
      id: 'studyEnvironment',
      question: "What kind of study environment do you need?",
      description: "How does your living space affect your productivity?",
      leftLabel: "Calm & Peaceful",
      rightLabel: "Energy & Activity",
      leftIcon: BookOpen,
      rightIcon: Zap,
      value: profileData.studyEnvironment
    }
  ];

  const handleSliderChange = (sliderId: keyof ProfileData, value: number[]) => {
    onUpdate({ [sliderId]: value[0] });
  };

  return (
    <div className="glass rounded-xl border border-white/20 p-8">
      <div className="mb-8">
        <h2 className="mb-2">The Lifestyle Vibe</h2>
        <p className="text-subtle">
          Tell us about your living preferences so we can find compatible roommates
        </p>
      </div>

      <div className="space-y-12">
        {sliders.map((slider) => {
          const LeftIcon = slider.leftIcon;
          const RightIcon = slider.rightIcon;

          return (
            <div key={slider.id} className="space-y-6">
              <div className="text-center">
                <h3 className="mb-2">{slider.question}</h3>
                <p className="text-subtle text-sm">{slider.description}</p>
              </div>

              <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6 border border-gray-100">
                <div className="space-y-6">
                  {/* Slider */}
                  <div className="px-4">
                    <Slider
                      value={[slider.value]}
                      onValueChange={(value) => handleSliderChange(slider.id, value)}
                      max={100}
                      min={0}
                      step={5}
                      className="w-full"
                    />
                  </div>

                  {/* Labels with Icons */}
                  <div className="flex justify-between items-center px-2">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <LeftIcon className="w-5 h-5" />
                      <span className="text-sm font-medium">{slider.leftLabel}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <span className="text-sm font-medium">{slider.rightLabel}</span>
                      <RightIcon className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Value Indicator */}
                  <div className="text-center">
                    <div className="inline-flex items-center space-x-2 glass-subtle rounded-full px-4 py-2">
                      <div className="w-3 h-3 rounded-full bg-primary"></div>
                      <span className="text-sm font-medium text-gray-700">
                        {slider.value}% towards {slider.value > 50 ? slider.rightLabel.toLowerCase() : slider.leftLabel.toLowerCase()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-100">
        <p className="text-sm text-blue-800 text-center">
          💡 <strong>Pro tip:</strong> These preferences help us calculate compatibility scores with potential roommates and housing options!
        </p>
      </div>
    </div>
  );
}