import user from "../../user/joedo.json";

// In a real app, this would be a proper User interface/type
// and likely live in the `types` directory.
export interface UserProfile {
  name: string;
  university: string;
  graduationYear: string;
  roomType: string;
  moveInDate: string;
  budget: [number, number];
  petFriendly: boolean | null;
  smokingAllowed: boolean | null;
  genderPreference: "same" | "any" | null;
  partiesOk: boolean | null;
  guestsOk: boolean | null;
  cleanliness: number;
  socialLevel: number;
  noiseLevel: number;
  studyEnvironment: number;
  profilePicture: string;
}

// In a real app, this would make an API call.
// For now, it just returns the local JSON file.
export const fetchUser = async (): Promise<UserProfile> => {
  // Simulate a network delay
  await new Promise((resolve) => setTimeout(resolve, 300));
  return user as UserProfile;
};

