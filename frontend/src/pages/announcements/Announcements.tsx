import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  PencilSquareIcon,
  TrashIcon,
  CheckBadgeIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
  CalendarIcon,
  UserGroupIcon,
  ArrowPathIcon,
  ClockIcon,
  DocumentTextIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";
import { announcementApi } from "../../api/announcement/announcementApi";
import { useAuth } from "../../context/AuthContext";

import type {
  Announcement,
  AnnouncementFilters,
  AnnouncementStats,
} from "../../types/announcement.types";

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

export const Announcements: React.FC = () => {
  const navigate = useNavigate();
  const {
    user,
    canEditAnnouncement,
    canDeleteAnnouncement,
    canPublishAnnouncement,
  } = useAuth();
  const [loading, setLoading] = useState(false);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [stats, setStats] = useState<AnnouncementStats>({
    total: 0,
    draft: 0,
    published: 0,
    archived: 0,
    pinned: 0,
    important: 0,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<AnnouncementFilters>({
    search: "",
    type: "",
    status: "", // ← Change from "published" to "" to show all
    priority: "",
    pinned: false,
    important: false,
    page: 1,
    per_page: 10,
  });
  const [pagination, setPagination] = useState({
    total: 0,
    last_page: 1,
    current_page: 1,
    per_page: 10,
    from: 0,
    to: 0,
  });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] =
    useState<Announcement | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const result = await announcementApi.getAnnouncements(filters);
      setAnnouncements(result.data);
      setPagination({
        total: result.total,
        last_page: result.last_page,
        current_page: result.current_page,
        per_page: result.per_page,
        from: result.from || 0,
        to: result.to || 0,
      });
    } catch (error) {
      console.error("Failed to fetch announcements:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const data = await announcementApi.getStats();
      setStats(data);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
    fetchStats();
  }, [filters]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters((prev) => ({ ...prev, search: searchTerm, page: 1 }));
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (key: keyof AnnouncementFilters, value: any) => {
    setFilters({ ...filters, [key]: value, page: 1 });
  };

  const handlePageChange = (page: number) => {
    setFilters({ ...filters, page });
  };

  const handleDelete = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedAnnouncement) return;
    try {
      await announcementApi.deleteAnnouncement(selectedAnnouncement.id);
      setShowDeleteModal(false);
      setSelectedAnnouncement(null);
      fetchAnnouncements();
      fetchStats();
    } catch (error) {
      console.error("Failed to delete announcement:", error);
    }
  };

  const handlePublish = async (id: number) => {
    try {
      await announcementApi.publishAnnouncement(id);
      fetchAnnouncements();
      fetchStats();
    } catch (error) {
      console.error("Failed to publish:", error);
    }
  };

  const handleArchive = async (id: number) => {
    try {
      await announcementApi.archiveAnnouncement(id);
      fetchAnnouncements();
      fetchStats();
    } catch (error) {
      console.error("Failed to archive:", error);
    }
  };

  const handlePin = async (id: number) => {
    try {
      await announcementApi.pinAnnouncement(id);
      fetchAnnouncements();
    } catch (error) {
      console.error("Failed to pin:", error);
    }
  };

  const handleImportant = async (id: number) => {
    try {
      await announcementApi.markImportant(id);
      fetchAnnouncements();
    } catch (error) {
      console.error("Failed to mark important:", error);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Announcements
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500">
            Manage company announcements and communications
          </p>
        </div>
        <button
          onClick={() => navigate("/announcements/create")}
          className="inline-flex items-center gap-2 px-4 py-2 text-white transition-colors rounded-lg shadow-sm bg-primary-600 hover:bg-primary-700"
        >
          <PlusIcon className="w-5 h-5" />
          Create Announcement
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-3 mb-6 sm:grid-cols-3 lg:grid-cols-6">
        <div className="p-3 text-center bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm rounded-xl">
          <p className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500">
            Total
          </p>
          <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
            {stats.total}
          </p>
        </div>
        <div className="p-3 text-center bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm rounded-xl">
          <p className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500">
            Draft
          </p>
          <p className="text-xl font-bold text-gray-600">{stats.draft}</p>
        </div>
        <div className="p-3 text-center bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm rounded-xl">
          <div className="flex items-center justify-center gap-1">
            <CheckBadgeIcon className="w-4 h-4 text-green-500" />
            <p className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500">
              Published
            </p>
          </div>
          <p className="text-xl font-bold text-green-600">{stats.published}</p>
        </div>
        <div className="p-3 text-center bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm rounded-xl">
          <p className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500">
            Archived
          </p>
          <p className="text-xl font-bold text-gray-600">{stats.archived}</p>
        </div>
        <div className="p-3 text-center bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm rounded-xl">
          <div className="flex items-center justify-center gap-1">
            <MapPinIcon className="w-4 h-4 text-primary-600" />
            <p className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500">
              Pinned
            </p>
          </div>
          <p className="text-xl font-bold text-primary-600">{stats.pinned}</p>
        </div>
        <div className="p-3 text-center bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm rounded-xl">
          <div className="flex items-center justify-center gap-1">
            <ExclamationTriangleIcon className="w-4 h-4 text-red-500" />
            <p className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500">
              Important
            </p>
          </div>
          <p className="text-xl font-bold text-red-600">{stats.important}</p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="p-4 mb-6 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm rounded-xl">
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="absolute w-5 h-5 text-gray-400 dark:text-gray-500 -translate-y-1/2 left-3 top-1/2" />
            <input
              type="text"
              placeholder="Search announcements..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full py-2 pl-10 pr-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center gap-2 px-4 py-2 transition-colors border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-700"
          >
            <FunnelIcon className="w-5 h-5 text-gray-500 dark:text-gray-400 dark:text-gray-500" />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Filters
            </span>
          </button>
          <button
            onClick={() => {
              setSearchTerm("");
              setFilters({
                search: "",
                type: "",
                status: "",
                priority: "",
                pinned: false,
                important: false,
                page: 1,
                per_page: 10,
              });
            }}
            className="inline-flex items-center gap-2 px-4 py-2 text-gray-500 dark:text-gray-400 dark:text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-300"
          >
            <ArrowPathIcon className="w-5 h-5" />
            <span className="text-sm">Reset</span>
          </button>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 gap-4 pt-4 mt-4 border-t border-gray-200 dark:border-gray-700 sm:grid-cols-4">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                Type
              </label>
              <select
                value={filters.type}
                onChange={(e) => handleFilterChange("type", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">All Types</option>
                <option value="general">General</option>
                <option value="hr">HR</option>
                <option value="payroll">Payroll</option>
                <option value="event">Event</option>
                <option value="policy">Policy</option>
                <option value="emergency">Emergency</option>
              </select>
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">All Status</option>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                Priority
              </label>
              <select
                value={filters.priority}
                onChange={(e) => handleFilterChange("priority", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">All Priorities</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
            <div className="flex items-center gap-4 pt-2">
              <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                <input
                  type="checkbox"
                  checked={filters.pinned}
                  onChange={(e) =>
                    handleFilterChange("pinned", e.target.checked)
                  }
                  className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-primary-600 focus:ring-primary-500"
                />
                Pinned Only
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                <input
                  type="checkbox"
                  checked={filters.important}
                  onChange={(e) =>
                    handleFilterChange("important", e.target.checked)
                  }
                  className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-primary-600 focus:ring-primary-500"
                />
                Important Only
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="overflow-hidden bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm rounded-xl">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-b-2 rounded-full animate-spin border-primary-600"></div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
                    <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase">
                      Title
                    </th>
                    <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase">
                      Type
                    </th>
                    <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase">
                      Priority
                    </th>
                    <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase">
                      Created
                    </th>
                    <th className="px-4 py-3 text-xs font-medium tracking-wider text-right text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {announcements.map((announcement) => (
                    <tr
                      key={announcement.id}
                      className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-700"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {announcement.is_pinned && (
                            <MapPinIcon className="w-4 h-4 text-primary-600 flex-shrink-0" />
                          )}
                          {announcement.is_important && (
                            <ExclamationTriangleIcon className="w-4 h-4 text-red-500 flex-shrink-0" />
                          )}
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              {announcement.title}
                            </p>
                            {announcement.summary && (
                              <p className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500 truncate max-w-xs">
                                {announcement.summary}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${typeColors[announcement.type]}`}
                        >
                          {announcement.type.charAt(0).toUpperCase() +
                            announcement.type.slice(1)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityColors[announcement.priority]}`}
                        >
                          {announcement.priority.charAt(0).toUpperCase() +
                            announcement.priority.slice(1)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[announcement.status]}`}
                        >
                          {announcement.status.charAt(0).toUpperCase() +
                            announcement.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500">
                          <CalendarIcon className="w-4 h-4" />
                          {formatDate(announcement.created_at)}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          {/* View - everyone can view */}
                          <button
                            onClick={() =>
                              navigate(`/announcements/${announcement.id}`)
                            }
                            className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-primary-600 rounded-lg hover:bg-primary-50 transition-colors"
                            title="View"
                          >
                            <EyeIcon className="w-4 h-4" />
                          </button>

                          {/* Edit - only if user created it or is super admin */}
                          {announcement.status !== "archived" &&
                            canEditAnnouncement(announcement.created_by) && (
                              <button
                                onClick={() =>
                                  navigate(
                                    `/announcements/${announcement.id}/edit`,
                                  )
                                }
                                className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                                title="Edit"
                              >
                                <PencilSquareIcon className="w-4 h-4" />
                              </button>
                            )}

                          {/* Publish - only super admin */}
                          {announcement.status === "draft" &&
                            canPublishAnnouncement() && (
                              <button
                                onClick={() => handlePublish(announcement.id)}
                                className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-green-600 rounded-lg hover:bg-green-50 transition-colors"
                                title="Publish"
                              >
                                <CheckBadgeIcon className="w-4 h-4" />
                              </button>
                            )}

                          {/* Archive - only super admin */}
                          {announcement.status === "published" &&
                            canPublishAnnouncement() && (
                              <button
                                onClick={() => handleArchive(announcement.id)}
                                className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
                                title="Archive"
                              >
                                <DocumentTextIcon className="w-4 h-4" />
                              </button>
                            )}

                          {/* Pin - only super admin */}
                          {user?.role === "super_admin" && (
                            <button
                              onClick={() => handlePin(announcement.id)}
                              className={`p-1.5 rounded-lg transition-colors ${
                                announcement.is_pinned
                                  ? "text-primary-600 hover:text-primary-700"
                                  : "text-gray-400 dark:text-gray-500 hover:text-primary-600"
                              }`}
                              title={announcement.is_pinned ? "Unpin" : "Pin"}
                            >
                              <MapPinIcon className="w-4 h-4" />
                            </button>
                          )}

                          {/* Important - only super admin */}
                          {user?.role === "super_admin" && (
                            <button
                              onClick={() => handleImportant(announcement.id)}
                              className={`p-1.5 rounded-lg transition-colors ${
                                announcement.is_important
                                  ? "text-red-600 hover:text-red-700"
                                  : "text-gray-400 dark:text-gray-500 hover:text-red-600"
                              }`}
                              title={
                                announcement.is_important
                                  ? "Remove Important"
                                  : "Mark Important"
                              }
                            >
                              <ExclamationTriangleIcon className="w-4 h-4" />
                            </button>
                          )}

                          {/* Delete - only super admin */}
                          {canDeleteAnnouncement() && (
                            <button
                              onClick={() => handleDelete(announcement)}
                              className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                              title="Delete"
                            >
                              <TrashIcon className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {announcements.length === 0 && (
              <div className="py-12 text-center">
                <DocumentTextIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  No announcements found
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500">
                  Try adjusting your search or create a new announcement
                </p>
              </div>
            )}

            {pagination.last_page > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500">
                  Showing {pagination.from} to {pagination.to} of{" "}
                  {pagination.total} announcements
                </p>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handlePageChange(filters.page - 1)}
                    disabled={filters.page === 1}
                    className="px-3 py-1 text-sm transition-colors border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-700"
                  >
                    Previous
                  </button>
                  {Array.from(
                    { length: pagination.last_page },
                    (_, i) => i + 1,
                  ).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                        page === filters.page
                          ? "bg-primary-600 text-white"
                          : "border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-700"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => handlePageChange(filters.page + 1)}
                    disabled={filters.page === pagination.last_page}
                    className="px-3 py-1 text-sm transition-colors border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-700"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Delete Modal */}
      {showDeleteModal && selectedAnnouncement && (
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
                Are you sure you want to delete{" "}
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {selectedAnnouncement.title}
                </span>
                ? This action cannot be undone.
              </p>
              <div className="flex items-center gap-3 mt-6">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 transition-colors border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
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

export default Announcements;
