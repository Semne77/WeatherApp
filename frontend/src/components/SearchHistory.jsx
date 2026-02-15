// src/components/SearchHistory.jsx
import React, { useEffect, useState } from "react";
const API_BASE = import.meta.env.VITE_BACKEND_URL;

function SearchHistory({ onReRun, refreshKey }) {
  const [history, setHistory] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const MAX_ENTRIES = 10;
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch paginated search history from backend
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/search-history?page=${page}&limit=10`);
        if (!res.ok) throw new Error("Server error");
        const result = await res.json();
        setHistory(result.data);
        setTotalPages(Math.ceil(result.total / 10));
        setError("");
      } catch (err) {
        console.warn("Error fetching history:", err.message);
        setTimeout(() => setError("Network error. Please reload."), 1000);
      }
    };
    fetchHistory();
  }, [refreshKey, page]);

  // Delete an entry by ID
  const handleDelete = async (id) => {
    try {
      await fetch(`${API_BASE}/api/weather-query/${id}`, {
        method: "DELETE",
      });
      setHistory((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      alert("Delete failed: " + err.message);
    }
  };

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Search History</h2>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-400">{error}</p>}

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm text-gray-100">
          <thead>
            <tr className="bg-gray-700 text-left text-xs uppercase tracking-wider">
              <th className="px-4 py-2 w-[200px]">Location</th>
              <th className="px-4 py-2 w-[250px]">Date Range</th>
              <th className="px-4 py-2 w-[220px]">Created</th>
              <th className="px-4 py-2 w-[140px] text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {history.map((entry) => (
              <tr key={entry.id} className="border-t border-gray-700 hover:bg-gray-800">
                <td className="px-4 py-2 truncate max-w-xs whitespace-nowrap overflow-hidden text-ellipsis">
                  {entry.location}
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  {entry.start_date} → {entry.end_date}
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  {new Date(entry.created_at).toLocaleString()}
                </td>
                <td className="px-4 py-2 text-center space-x-2">
                  <button onClick={() => onReRun(entry)} className="text-blue-400 hover:underline">
                    🔄 View
                  </button>
                  <button onClick={() => handleDelete(entry.id)} className="text-red-400 hover:underline">
                    🗑 Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination controls */}
      <div className="mt-4 flex items-center justify-center gap-6 text-sm">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
          className="px-3 py-1 rounded bg-gray-700 hover:bg-gray-600 disabled:opacity-50"
        >
          ◀ Previous
        </button>
        <span className="text-gray-300">
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          disabled={page === totalPages}
          className="px-3 py-1 rounded bg-gray-700 hover:bg-gray-600 disabled:opacity-50"
        >
          Next ▶
        </button>
      </div>
    </div>
  );
}

export default SearchHistory;


