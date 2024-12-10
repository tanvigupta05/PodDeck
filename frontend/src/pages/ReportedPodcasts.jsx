import React, { useEffect, useState } from "react";
import axios from "axios";

const ReportedPodcasts = () => {
  const [reportedPodcasts, setReportedPodcasts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReportedPodcasts = async () => {
      try {
        const res = await axios.get(
          "http://localhost:3000/api/v1/admin/reported-podcasts",
          { withCredentials: true }
        );
        console.log("Reported Podcasts Data:", res.data.data);
        setReportedPodcasts(res.data.data);
      } catch (error) {
        console.error("Failed to fetch reported podcasts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReportedPodcasts();
  }, []);

  const handleDelete = async (podcastId) => {
    try {
      await axios.delete(
        `http://localhost:3000/api/v1/admin-delete-podcast/${podcastId}`,
        { withCredentials: true }
      );
      setReportedPodcasts(
        reportedPodcasts.filter((report) => report.podcastDetails[0]._id !== podcastId)
      );
      alert("Podcast deleted successfully.");
    } catch (error) {
      alert("Failed to delete podcast.");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-6 bg-zinc-900 text-white min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Reported Podcasts</h1>
      <div className="overflow-x-auto">
        <table className="table-auto w-full bg-zinc-800 text-left rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-zinc-700 text-gray-300">
              <th className="p-4">Podcast Title</th>
              <th className="p-4">Reports Count</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reportedPodcasts.map((report, index) => (
              <tr
                key={report.podcastDetails[0]._id}
                className={`border-t border-zinc-700 ${
                  index % 2 === 0 ? "bg-zinc-800" : "bg-zinc-700"
                }`}
              >
                <td className="p-4">{report.podcastDetails[0].title}</td>
                <td className="p-4">{report.count}</td>
                <td className="p-4">
                  <button
                    onClick={() => handleDelete(report.podcastDetails[0]._id)}
                    className="text-white bg-red-600 px-4 py-2 rounded-lg hover:bg-red-700 transition-all"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReportedPodcasts;
