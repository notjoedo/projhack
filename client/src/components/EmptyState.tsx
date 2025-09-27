import { MessageSquare, Users } from "lucide-react";

interface EmptyStateProps {
  type: 'inquiries' | 'groups';
}

export function EmptyState({ type }: EmptyStateProps) {
  const config = {
    inquiries: {
      icon: MessageSquare,
      title: "No inquiries yet",
      message: "Your sent inquiries will appear here once you contact a listing."
    },
    groups: {
      icon: Users,
      title: "No groups started",
      message: "Save apartments here to start planning with friends."
    }
  };

  const { icon: Icon, title, message } = config[type];

  return (
    <div className="text-center py-12">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Icon className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 max-w-sm mx-auto">{message}</p>
    </div>
  );
}