import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import type { type_loadout } from "../types";

// LoadoutItem component for displaying a single item
const LoadoutItem = ({ name, label }: { name: string; label: string }) => {
  // Construct the image path: /assets/item-name.webp (spaces removed)
  const imagePath = `/assets/${name.replace(" ", "")}.webp`;

  return (
    // Styles the individual item card
    <div className="bg-gray-700 p-4 rounded-lg flex flex-col items-center shadow-inner h-full">
      {/* Label (e.g., "Primary") */}
      <p className="text-sm text-gray-400 font-medium mb-2">{label}</p>

      {/* Image container */}
      <div className="flex-grow flex items-center justify-center w-full mb-2">
        <img
          src={imagePath}
          alt={name}
          className="h-20 w-full object-contain"
          // Fallback image in case the original image fails to load
          onError={(e) => {
            e.currentTarget.src = `https://placehold.co/150x100/2d3748/ffffff?text=${name}`;
          }}
        />
      </div>

      {/* Item name */}
      <p className="text-white font-semibold text-center text-sm mt-auto">
        {name}
      </p>
    </div>
  );
};

// The main component for the /loadout/:id page
function Loadout() {
  const { id } = useParams();
  const navigate = useNavigate();

  // --- State Management ---
  const [loadout, setLoadout] = useState<type_loadout | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- Data Fetching ---
  useEffect(() => {
    const fetchLoadout = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await axios.get(`http://localhost:3001/loadout/${id}`);
        setLoadout(response.data);
      } catch (err) {
        // Handle errors
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.message || err.message);
        } else {
          setError("An unexpected error occurred");
        }
      } finally {
        setIsLoading(false); // Stop loading
      }
    };

    fetchLoadout();
  }, [id]); // Re-run effect if 'id' changes

  // Handles the click event for the "Delete" button
  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this loadout?")) {
      try {
        await axios.delete(`http://localhost:3001/loadout/${id}`);

        alert("Loadout deleted successfully.");
        navigate("/loadouts"); // Redirect user
      } catch (err) {
        // Handle deletion errors
        let errorMessage = "Deletion failed.";
        if (axios.isAxiosError(err) && err.response?.data?.message) {
          errorMessage = err.response.data.message;
        }
        alert(errorMessage);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="text-center text-white p-10">
        <p className="text-xl">Loading loadout data...</p>
        <svg
          className="animate-spin h-5 w-5 text-cyan-500 mx-auto mt-4"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 p-10">Error: {error}</div>;
  }

  if (!loadout) {
    return (
      <div className="text-center text-white p-10">Loadout not found.</div>
    );
  }

  // Render the loadout details
  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-6 sm:p-8 transition-all duration-300 ease-in-out hover:shadow-cyan-500/20 hover:border-cyan-500">
        {/* Loadout Name */}
        <h2 className="text-3xl font-bold text-white mb-6 tracking-wide text-center sm:text-left">
          {loadout.name}'s Loadout
        </h2>

        {/* Grid for loadout items */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <LoadoutItem label="🪖 Primary" name={loadout.primaryweapon} />
          <LoadoutItem label="🔫 Sub" name={loadout.subweapon} />
          <LoadoutItem label="💣 Gadget 1" name={loadout.gadget1} />
          <LoadoutItem label="💥 Gadget 2" name={loadout.gadget2} />
        </div>

        {/* Button container */}
        <div className="flex flex-col sm:flex-row justify-end gap-4 mt-8">
          {/* Edit Button (Link to edit page) */}
          <Link
            to={`/edit/${loadout.id}`}
            className="text-center bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
          >
            Edit
          </Link>

          {/* Delete Button (triggers delete handler) */}
          <button
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default Loadout;
