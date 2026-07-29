import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  ArrowLeftIcon,
  ExclamationTriangleIcon,
  CalendarIcon,
  UserIcon,
  EyeIcon,
  PaperClipIcon,
  PencilSquareIcon,
  TrashIcon,
  CheckBadgeIcon,
  XMarkIcon,
  DocumentTextIcon,
  UserGroupIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";
import { announcementApi } from "../../api/announcement/announcementApi";
import type { Announcement } from "../../types/announcement.types";
import { useAuth } from "../../context/AuthContext";

const priorityColors: Record<string, string> = {
  low: "bg-blue-100 text-blue-800",
  medium: "bg-yellow-100 text-yellow-800",
  high: "bg-orange-100 text-orange-800",
  urgent: "bg-red-100 text-red-800",
};

const statusColors: Record<string, string> = {
  draft: "bg-gray-100 text-gray-800",
  published: "bg-green-100 text-green-800",
  archived: "bg-gray-100 text-gray-800",
};

const typeColors: Record<string, string> = {
  general: "bg-blue-100 text-blue-800",
  hr: "bg-purple-100 text-purple-800",
  payroll: "bg-green-100 text-green-800",
  event: "bg-pink-100 text-pink-800",
  policy: "bg-indigo-100 text-indigo-800",
  emergency: "bg-red-100 text-red-800",
};

export const AnnouncementDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const {
    user,
    canEditAnnouncement,
    canDeleteAnnouncement,
    canPublishAnnouncement,
  } = useAuth();
  const [loading, setLoading] = useState(true);
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const fetchAnnouncement = async () => {
      if (!id) return;
      try {
        const data = await announcementApi.getAnnouncement(parseInt(id));
        setAnnouncement(data);
      } catch (error) {
        console.error("Failed to fetch announcement:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnnouncement();
  }, [id]);

  const handleDelete = async () => {
    if (!announcement) return;
    try {
      await announcementApi.deleteAnnouncement(announcement.id);
      navigate("/announcements");
    } catch (error) {
      console.error("Failed to delete:", error);
    }
  };

  const handlePublish = async () => {
    if (!announcement) return;
    try {
      await announcementApi.publishAnnouncement(announcement.id);
      const updated = await announcementApi.getAnnouncement(announcement.id);
      setAnnouncement(updated);
    } catch (error) {
      console.error("Failed to publish:", error);
    }
  };

  const handleArchive = async () => {
    if (!announcement) return;
    try {
      await announcementApi.archiveAnnouncement(announcement.id);
      const updated = await announcementApi.getAnnouncement(announcement.id);
      setAnnouncement(updated);
    } catch (error) {
      console.error("Failed to archive:", error);
    }
  };

  const handlePin = async () => {
    if (!announcement) return;
    try {
      await announcementApi.pinAnnouncement(announcement.id);
      const updated = await announcementApi.getAnnouncement(announcement.id);
      setAnnouncement(updated);
    } catch (error) {
      console.error("Failed to pin:", error);
    }
  };

  const handleImportant = async () => {
    if (!announcement) return;
    try {
      await announcementApi.markImportant(announcement.id);
      const updated = await announcementApi.getAnnouncement(announcement.id);
      setAnnouncement(updated);
    } catch (error) {
      console.error("Failed to mark important:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="w-8 h-8 border-b-2 rounded-full animate-spin border-primary-600"></div>
      </div>
    );
  }

  if (!announcement) {
    return (
      <div className="py-16 text-center">
        <DocumentTextIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
          Announcement not found
        </h3>
        <Link
          to="/announcements"
          className="mt-2 inline-block text-sm text-primary-600 hover:underline"
        >
          Back to Announcements
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl p-4 mx-auto sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link
            to="/announcements"
            className="p-2 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <ArrowLeftIcon className="w-5 h-5 text-gray-500 dark:text-gray-400 dark:text-gray-500" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {announcement.title}
            </h1>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span
                className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${typeColors[announcement.type]}`}
              >
                {announcement.type.charAt(0).toUpperCase() +
                  announcement.type.slice(1)}
              </span>
              <span
                className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityColors[announcement.priority]}`}
              >
                {announcement.priority.charAt(0).toUpperCase() +
                  announcement.priority.slice(1)}
              </span>
              <span
                className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[announcement.status]}`}
              >
                {announcement.status.charAt(0).toUpperCase() +
                  announcement.status.slice(1)}
              </span>
              {announcement.is_pinned && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                  <MapPinIcon className="w-3 h-3" />
                  Pinned
                </span>
              )}
              {announcement.is_important && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  <ExclamationTriangleIcon className="w-3 h-3" />
                  Important
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Edit - only if user created it or is super admin */}
          {announcement.status !== "archived" &&
            canEditAnnouncement(announcement.created_by) && (
              <button
                onClick={() =>
                  navigate(`/announcements/${announcement.id}/edit`)
                }
                className="p-2 text-gray-400 dark:text-gray-500 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
              >
                <PencilSquareIcon className="w-5 h-5" />
              </button>
            )}

          {/* Delete - only super admin */}
          {canDeleteAnnouncement() && (
            <button
              onClick={() => setShowDeleteModal(true)}
              className="p-2 text-gray-400 dark:text-gray-500 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
            >
              <TrashIcon className="w-5 h-5" />
            </button>
          )}

          {/* Publish - only super admin */}
          {announcement.status === "draft" && canPublishAnnouncement() && (
            <button
              onClick={handlePublish}
              className="flex items-center gap-2 px-3 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
            >
              <CheckBadgeIcon className="w-4 h-4" />
              Publish
            </button>
          )}

          {/* Archive - only super admin */}
          {announcement.status === "published" && canPublishAnnouncement() && (
            <button
              onClick={handleArchive}
              className="flex items-center gap-2 px-3 py-2 text-white bg-gray-600 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <DocumentTextIcon className="w-4 h-4" />
              Archive
            </button>
          )}

          {/* Pin & Important - only super admin */}
          {user?.role === "super_admin" && (
            <>
              <button
                onClick={handlePin}
                className={`p-2 rounded-lg transition-colors ${
                  announcement.is_pinned
                    ? "text-primary-600 hover:text-primary-700 bg-primary-50"
                    : "text-gray-400 dark:text-gray-500 hover:text-primary-600 hover:bg-primary-50"
                }`}
              >
                <MapPinIcon className="w-5 h-5" />
              </button>
              <button
                onClick={handleImportant}
                className={`p-2 rounded-lg transition-colors ${
                  announcement.is_important
                    ? "text-red-600 hover:text-red-700 bg-red-50"
                    : "text-gray-400 dark:text-gray-500 hover:text-red-600 hover:bg-red-50"
                }`}
              >
                <ExclamationTriangleIcon className="w-5 h-5" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-6 space-y-6">
          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1.5">
              <UserIcon className="w-4 h-4" />
              {announcement.creator?.name || "Unknown"}
            </span>
            <span className="flex items-center gap-1.5">
              <CalendarIcon className="w-4 h-4" />
              {new Date(announcement.created_at).toLocaleString()}
            </span>
            <span className="flex items-center gap-1.5">
              <EyeIcon className="w-4 h-4" />
              {announcement.view_count || 0} views
            </span>
            {announcement.target_type !== "all" && (
              <span className="flex items-center gap-1.5">
                <UserGroupIcon className="w-4 h-4" />
                Target:{" "}
                {announcement.target_type.charAt(0).toUpperCase() +
                  announcement.target_type.slice(1)}
              </span>
            )}
            {announcement.start_date && (
              <span className="flex items-center gap-1.5">
                <CalendarIcon className="w-4 h-4" />
                Starts: {new Date(announcement.start_date).toLocaleDateString()}
              </span>
            )}
            {announcement.end_date && (
              <span className="flex items-center gap-1.5">
                <CalendarIcon className="w-4 h-4" />
                Ends: {new Date(announcement.end_date).toLocaleDateString()}
              </span>
            )}
          </div>

          {/* Summary */}
          {announcement.summary && (
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-gray-700 dark:text-gray-300">
                {announcement.summary}
              </p>
            </div>
          )}

          {/* Content */}
          <div className="prose dark:prose-invert max-w-none">
            <div className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
              {announcement.content}
            </div>
          </div>

          {/* Attachments */}
          {announcement.attachments && announcement.attachments.length > 0 && (
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                <PaperClipIcon className="w-4 h-4" />
                Attachments ({announcement.attachments.length})
              </h4>
              <div className="space-y-2">
                {announcement.attachments.map((attachment) => (
                  <a
                    key={attachment.id}
                    href={attachment.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-2 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <PaperClipIcon className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {attachment.file_name}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      ({(attachment.file_size / 1024).toFixed(1)} KB)
                    </span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="w-full max-w-md bg-white dark:bg-gray-800 shadow-lg rounded-xl">
            <div className="p-6">
              <div className="flex items-center justify-center mb-4">
                <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full">
                  <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
                </div>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-center text-gray-900 dark:text-gray-100">
                Delete Announcement
              </h3>
              <p className="text-sm text-center text-gray-500 dark:text-gray-400 dark:text-gray-500">
                Are you sure you want to delete this announcement? This action
                cannot be undone.
              </p>
              <div className="flex items-center gap-3 mt-6">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 transition-colors border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 px-4 py-2 text-white transition-colors bg-red-600 rounded-lg hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnnouncementDetail;
