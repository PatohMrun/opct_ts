"use client";

import React, { useState, useEffect } from "react";
import { Loader2, Bell, AlertCircle, Check } from "lucide-react";
import { getUser } from "@/utils/auth";

interface Notification {
  id: number;
  content: string;
  createdAt: string;
  isRead: boolean;
}

const NotificationsUI: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    setError(null);
    try {
      const userId = getUser()?.id;
      const response = await fetch("/api/notifications?id=" + userId);
      if (!response.ok) {
        throw new Error("Failed to fetch notifications");
      }
      const data = await response.json();
      setNotifications(data);
      markAllAsRead();
    } catch (err) {
      setError("Error fetching notifications. Please try again.");
      console.error("Error fetching notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  const markAllAsRead = async () => {
    try {
      const userId = getUser()?.id;
      const response = await fetch("/api/notifications?id=" + userId, {
        method: "PUT",
      });
      if (!response.ok) {
        throw new Error("Failed to mark notifications as read");
      }
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) => ({
          ...notification,
          isRead: true,
        }))
      );
    } catch (err) {
      console.error("Error marking notifications as read:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        <span className="ml-2 text-lg font-medium text-gray-700">
          Loading notifications...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
        role="alert"
      >
        <div className="flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="text-center py-8">
        <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-lg font-medium text-gray-700">
          No notifications yet
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 container mx-auto mt-4">
      <h2 className="text-2xl font-bold mb-4">Notifications</h2>
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`p-4 rounded-lg shadow ${
            notification.isRead
              ? "bg-gray-100"
              : "bg-white border-l-4 border-indigo-500"
          }`}
        >
          <div className="flex justify-between items-start">
            <p
              className={`text-sm ${
                notification.isRead ? "text-gray-600" : "text-gray-800"
              }`}
            >
              {notification.content}
            </p>
            {notification.isRead && (
              <Check className="h-5 w-5 text-green-500" />
            )}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {new Date(notification.createdAt).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
};

export default NotificationsUI;
