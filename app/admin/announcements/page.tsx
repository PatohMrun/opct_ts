"use client";
import { useEffect, useState } from "react";

type Announcement = {
  id: number;
  title: string;
  content: string;
};

const AnnouncementList: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAnnouncement, setCurrentAnnouncement] = useState<
    Omit<Announcement, "id">
  >({ title: "", content: "" });
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  function fetchAnnouncements() {
    setLoading(true);
    fetch("/api/announcements")
      .then((response) => response.json())
      .then((data) => {
        setAnnouncements(data.announcements);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch announcements");
        setLoading(false);
      });
  }

  async function addAnnouncement() {
    setLoading(true);
    const url = `/api/announcements`;
    const payload = { ...currentAnnouncement };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      const newAnnouncement = await response.json();
      setAnnouncements((prev) => [...prev, newAnnouncement.announcement]);
      setCurrentAnnouncement({ title: "", content: "" });
      setIsModalOpen(false);
    } else {
      console.error("Failed to add announcement");
    }
    setLoading(false);
  }

  async function editAnnouncement() {
    if (editingIndex === null) return alert("No announcement to edit");
    setLoading(true);
    const url = `/api/announcements/${announcements[editingIndex].id}`;
    const payload = { ...currentAnnouncement };

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      const updatedAnnouncement = (await response.json()).announcement;
      const updatedAnnouncements = announcements.map((announcement, index) =>
        index === editingIndex ? updatedAnnouncement : announcement
      );
      setAnnouncements(updatedAnnouncements);
      setCurrentAnnouncement({ title: "", content: "" });
      setEditingIndex(null);
      setIsModalOpen(false);
    } else {
      console.error("Failed to edit announcement");
    }
    setLoading(false);
  }

  async function deleteAnnouncement(id: number) {
    setLoading(true);
    const url = `/api/announcements/${id}`;
    const response = await fetch(url, {
      method: "DELETE",
    });

    if (response.ok) {
      setAnnouncements((prev) =>
        prev.filter((announcement) => announcement.id !== id)
      );
    } else {
      console.error("Failed to delete announcement");
    }
    setLoading(false);
  }

  const handleAdd = async () => {
    await addAnnouncement();
  };

  const handleEdit = (index: number) => {
    setCurrentAnnouncement({
      title: announcements[index].title,
      content: announcements[index].content,
    });
    setEditingIndex(index);
    setIsModalOpen(true);
  };

  const handleUpdate = async () => {
    if (editingIndex === null) return;

    await editAnnouncement();
  };

  const handleDelete = async (index: number) => {
    const announcementToDelete = announcements[index];
    await deleteAnnouncement(announcementToDelete.id);
  };

  return (
    
    <div className="p-6 relative -z-50 ">
      <h1 className="text-2xl font-bold mb-4">Announcements</h1>
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50 z-50">
          <div className="loader border-t-4 border-b-4 border-blue-500 rounded-full w-12 h-12 animate-spin"></div>
        </div>
      )}
      {!loading && (
        <>
          {announcements.length === 0 ? (
            <p className="text-gray-500">
              No announcements available. Please add a new announcement.
            </p>
          ) : (
            <ul className="list-disc list-inside">
              {announcements.map((announcement, index) => (
                <li key={announcement.id} className="mb-2">
                  <h2 className="text-xl font-semibold">{announcement.title}</h2>
                  <p>{announcement.content}</p>
                  <div className="flex justify-end">
                    <button
                      onClick={() => handleEdit(index)}
                      className="text-blue-500 hover:underline mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(index)}
                      className="text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
          >
            Add Announcement
          </button>
        </>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-md w-96">
            <h2 className="text-xl mb-4">
              {editingIndex !== null ? "Edit Announcement" : "New Announcement"}
            </h2>
            <input
              type="text"
              value={currentAnnouncement.title}
              onChange={(e) =>
                setCurrentAnnouncement({
                  ...currentAnnouncement,
                  title: e.target.value,
                })
              }
              placeholder="Title"
              className="w-full p-2 border border-gray-300 rounded mb-4"
            />
            <textarea
              value={currentAnnouncement.content}
              onChange={(e) =>
                setCurrentAnnouncement({
                  ...currentAnnouncement,
                  content: e.target.value,
                })
              }
              placeholder="Content"
              className="w-full p-2 border border-gray-300 rounded mb-4"
              rows={4}
            />
            <div className="flex justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-500 text-white py-2 px-4 rounded mr-2"
              >
                Cancel
              </button>
              <button
                onClick={editingIndex !== null ? handleUpdate : handleAdd}
                className="bg-blue-500 text-white py-2 px-4 rounded"
              >
                {editingIndex !== null ? "Update" : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnnouncementList;
