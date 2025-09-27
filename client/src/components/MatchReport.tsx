import { Check, X } from "lucide-react";

interface MatchCriterion {
  label: string;
  status: 'match' | 'no-match';
  detail: string;
}

interface MatchReportProps {
  criteria: MatchCriterion[];
}

export function MatchReport({ criteria }: MatchReportProps) {
  return (
    <div className="glass rounded-lg p-4 w-64">
      <div className="space-y-3">
        {criteria.map((criterion, index) => (
          <div key={index} className="flex items-start gap-3">
            <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
              criterion.status === 'match' 
                ? 'bg-green-100 text-green-600' 
                : 'bg-red-100 text-red-600'
            }`}>
              {criterion.status === 'match' ? (
                <Check className="w-3 h-3" />
              ) : (
                <X className="w-3 h-3" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-900">{criterion.label}:</p>
              <p className="text-sm text-gray-600">{criterion.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}