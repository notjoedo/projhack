import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { BudgetSlider } from "../BudgetSlider";
import { ProfileData } from "../ProfilePage";

interface EssentialsStepProps {
  profileData: ProfileData;
  onUpdate: (updates: Partial<ProfileData>) => void;
}

export function EssentialsStep({ profileData, onUpdate }: EssentialsStepProps) {
  const currentYear = new Date().getFullYear();
  const graduationYears = Array.from({ length: 8 }, (_, i) => currentYear + i);

  return (
    <div className="glass rounded-xl border border-white/20 p-8">
      <div className="mb-8">
        <h2 className="mb-2">The Essentials</h2>
        <p className="text-subtle">
          Help us get to know you and find the perfect housing match
        </p>
      </div>

      <div className="space-y-8">
        {/* Mad-Libs Style Form */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
          <p className="leading-relaxed text-gray-800">
            Hi! My name is{" "}
            <Input
              value={profileData.name}
              onChange={(e) => onUpdate({ name: e.target.value })}
              placeholder="your name"
              className="inline-block w-32 mx-2 text-center border-b-2 border-primary border-t-0 border-l-0 border-r-0 rounded-none bg-transparent focus:bg-white/50"
            />
            and I'm a student at{" "}
            <Input
              value={profileData.university}
              onChange={(e) => onUpdate({ university: e.target.value })}
              placeholder="university name"
              className="inline-block w-48 mx-2 text-center border-b-2 border-primary border-t-0 border-l-0 border-r-0 rounded-none bg-transparent focus:bg-white/50"
            />
            . I'm graduating in{" "}
            <Select value={profileData.graduationYear} onValueChange={(value) => onUpdate({ graduationYear: value })}>
              <SelectTrigger className="inline-flex w-20 mx-2 border-b-2 border-primary border-t-0 border-l-0 border-r-0 rounded-none bg-transparent">
                <SelectValue placeholder="year" />
              </SelectTrigger>
              <SelectContent>
                {graduationYears.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            . I'm looking for a{" "}
            <Select value={profileData.roomType} onValueChange={(value) => onUpdate({ roomType: value })}>
              <SelectTrigger className="inline-flex w-32 mx-2 border-b-2 border-primary border-t-0 border-l-0 border-r-0 rounded-none bg-transparent">
                <SelectValue placeholder="room type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="private">private room</SelectItem>
                <SelectItem value="shared">shared room</SelectItem>
                <SelectItem value="studio">studio</SelectItem>
                <SelectItem value="1br">1 bedroom</SelectItem>
              </SelectContent>
            </Select>
            and I need to move in by{" "}
            <Input
              type="date"
              value={profileData.moveInDate}
              onChange={(e) => onUpdate({ moveInDate: e.target.value })}
              className="inline-block w-36 mx-2 text-center border-b-2 border-primary border-t-0 border-l-0 border-r-0 rounded-none bg-transparent focus:bg-white/50"
            />
            .
          </p>
        </div>

        {/* Budget Slider */}
        <div>
          <label className="block text-gray-900 mb-4">
            My budget range is flexible, but I'm most comfortable spending:
          </label>
          <div className="glass-subtle rounded-lg p-6">
            <BudgetSlider
              minValue={profileData.budget[0]}
              maxValue={profileData.budget[1]}
              onChange={(budget) => onUpdate({ budget })}
            />
          </div>
        </div>
      </div>
    </div>
  );
}