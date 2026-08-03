import React from "react";
import { CheckBadgeIcon, XMarkIcon } from "@heroicons/react/24/outline";

interface NotificationItemProps {
  notification: Notification;
  onMarkRead: (id: number) => void;
  onDelete: (id: number) => void;
}

const colorMap: Record<string, string> = {
  red: "bg-red-100 text-red-600",
  green: "bg-green-100 text-green-600",
  blue: "bg-blue-100 text-blue-600",
  yellow: "bg-yellow-100 text-yellow-600",
  purple: "bg-purple-100 text-purple-600",
  default: "bg-gray-100 text-gray-600",
};

export const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onMarkRead,
  onDelete,
}) => {
  const colorClass = colorMap[notification.color] || colorMap.default;

  return (
    <div
      className={`px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
        !notification.is_read ? "bg-blue-50" : ""
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className={`p-2 rounded-full flex-shrink-0 ${colorClass}`}>
          <span className="text-base">{notification.icon || "📌"}</span>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-900">
              {notification.title}
            </p>
            <span className="text-xs text-gray-400 whitespace-nowrap ml-2">
              {notification.time_ago}
            </span>
          </div>
          <p className="text-sm text-gray-600 mt-0.5 line-clamp-2">
            {notification.message}
          </p>
          {notification.action_url && (
            <a
              href={notification.action_url}
              className="text-xs text-primary-600 hover:text-primary-700 mt-1 inline-block"
            >
              View Details →
            </a>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 flex-shrink-0">
          {!notification.is_read && (
            <button
              onClick={() => onMarkRead(notification.id)}
              className="p-1 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
              title="Mark as read"
            >
              <CheckBadgeIcon className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={() => onDelete(notification.id)}
            className="p-1 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete"
          >
            <XMarkIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
