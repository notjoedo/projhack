import { useState } from "react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { ProfileData } from "../ProfilePage";
import { ChevronLeft, ChevronRight, Check, X, Minus } from "lucide-react";

interface DealBreakersStepProps {
  profileData: ProfileData;
  onUpdate: (updates: Partial<ProfileData>) => void;
}

interface Question {
  id: keyof ProfileData;
  question: string;
  description: string;
  options: Array<{ value: any; label: string; icon: any; variant?: string }>;
}

export function DealBreakersStep({ profileData, onUpdate }: DealBreakersStepProps) {
  const questions: Question[] = [
    {
      id: 'petFriendly',
      question: 'Do you need a pet-friendly place?',
      description: 'This will help us filter listings that allow pets',
      options: [
        { value: true, label: 'Yes, I have pets', icon: Check, variant: 'primary' },
        { value: false, label: 'No pets for me', icon: X, variant: 'secondary' },
        { value: null, label: 'No preference', icon: Minus, variant: 'outline' }
      ]
    },
    {
      id: 'smokingAllowed',
      question: 'How do you feel about smoking?',
      description: 'Including cigarettes, vaping, and other smoking',
      options: [
        { value: true, label: 'Smoking is fine', icon: Check, variant: 'primary' },
        { value: false, label: 'Absolutely no smoking', icon: X, variant: 'secondary' },
        { value: null, label: 'No strong preference', icon: Minus, variant: 'outline' }
      ]
    },
    {
      id: 'genderPreference',
      question: 'Do you have a roommate gender preference?',
      description: 'This helps us match you with compatible living situations',
      options: [
        { value: 'same', label: 'Same gender only', icon: Check, variant: 'primary' },
        { value: 'any', label: 'Any gender is fine', icon: Check, variant: 'secondary' },
        { value: null, label: 'No preference', icon: Minus, variant: 'outline' }
      ]
    },
    {
      id: 'partiesOk',
      question: 'Are you okay with parties and gatherings?',
      description: 'How do you feel about social events at your place?',
      options: [
        { value: true, label: 'Love hosting parties!', icon: Check, variant: 'primary' },
        { value: false, label: 'Prefer quiet space', icon: X, variant: 'secondary' },
        { value: null, label: 'Occasional is fine', icon: Minus, variant: 'outline' }
      ]
    },
    {
      id: 'guestsOk',
      question: 'How do you feel about overnight guests?',
      description: 'Friends, family, or significant others staying over',
      options: [
        { value: true, label: 'Guests welcome', icon: Check, variant: 'primary' },
        { value: false, label: 'No overnight guests', icon: X, variant: 'secondary' },
        { value: null, label: 'Discuss case by case', icon: Minus, variant: 'outline' }
      ]
    }
  ];

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswer = (value: any) => {
    onUpdate({ [currentQuestion.id]: value });
  };

  const goToNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const goToPrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const getButtonVariant = (optionVariant: string) => {
    switch (optionVariant) {
      case 'primary': return 'default';
      case 'secondary': return 'destructive';
      case 'outline': return 'outline';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-8">
      {/* Progress Indicator */}
      <div className="flex justify-center space-x-2 mb-8">
        {questions.map((_, index) => (
          <div
            key={index}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentQuestionIndex
                ? 'bg-primary scale-125'
                : index < currentQuestionIndex
                ? 'bg-primary'
                : 'bg-gray-200'
            }`}
          />
        ))}
      </div>

      {/* Question Card */}
      <div className="relative">
        <Card className="glass border border-white/20 p-8 text-center min-h-[400px] flex flex-col justify-center">
          <div className="mb-8">
            <h2 className="mb-4">{currentQuestion.question}</h2>
            <p className="text-subtle">{currentQuestion.description}</p>
          </div>

          <div className="space-y-4 max-w-sm mx-auto">
            {currentQuestion.options.map((option) => {
              const IconComponent = option.icon;
              const isSelected = profileData[currentQuestion.id] === option.value;
              
              return (
                <Button
                  key={option.label}
                  onClick={() => handleAnswer(option.value)}
                  variant={isSelected ? "default" : getButtonVariant(option.variant)}
                  className={`w-full justify-start space-x-3 py-4 ${
                    isSelected ? 'gradient-primary text-white shadow-lg' : ''
                  }`}
                >
                  <IconComponent className="w-5 h-5" />
                  <span>{option.label}</span>
                </Button>
              );
            })}
          </div>
        </Card>

        {/* Navigation Arrows */}
        <Button
          variant="ghost"
          size="icon"
          onClick={goToPrevious}
          disabled={currentQuestionIndex === 0}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 rounded-full glass border border-white/20"
        >
          <ChevronLeft className="w-6 h-6" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={goToNext}
          disabled={currentQuestionIndex === questions.length - 1}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 rounded-full glass border border-white/20"
        >
          <ChevronRight className="w-6 h-6" />
        </Button>
      </div>

      {/* Question Counter */}
      <div className="text-center text-subtle">
        Question {currentQuestionIndex + 1} of {questions.length}
      </div>
    </div>
  );
}