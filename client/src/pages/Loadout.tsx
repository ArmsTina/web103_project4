import { useEffect, useState, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
// Import the Equipment type
import type { type_loadout, Equipment } from "../types";

// LoadoutItem component
const LoadoutItem = ({ name, label }: { name: string; label: string }) => {
  const imagePath = `/assets/${name.replace(" ", "")}.webp`;

  return (
    <div className="bg-gray-700 p-4 rounded-lg flex flex-col items-center shadow-inner h-full">
      <p className="text-sm text-gray-400 font-medium mb-2">{label}</p>
      <div className="flex-grow flex items-center justify-center w-full mb-2">
        <img
          src={imagePath}
          alt={name}
          className="h-20 w-full object-contain"
          onError={(e) => {
            e.currentTarget.src = `https://placehold.co/150x100/2d3748/ffffff?text=${name}`;
          }}
        />
      </div>
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
  // ✨ State to store all equipment prices
  const [allEquipment, setAllEquipment] = useState<Equipment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- Data Fetching ---
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // ✨ Fetch both the loadout and all equipment prices in parallel
        const [loadoutRes, equipmentRes] = await Promise.all([
          axios.get(`http://localhost:3001/loadout/${id}`),
          axios.get("http://localhost:3001/equipments"),
        ]);

        // Set the loadout
        setLoadout(loadoutRes.data);

        // Set and validate all equipment prices (like in Home.tsx)
        const eqData: Equipment[] = equipmentRes.data;
        const validatedData = eqData.map((item) => ({
          ...item,
          price: parseFloat(item.price as any) || 0,
        }));
        setAllEquipment(validatedData);
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

    fetchData();
  }, [id]); // Re-run effect if 'id' changes

  // Calculate total price using useMemo
  const totalPrice = useMemo(() => {
    // Wait until both loadout and equipment data are loaded
    if (!loadout || allEquipment.length === 0) {
      return 0;
    }

    // Create a simple map for quick price lookups
    const priceMap = new Map<string, number>();
    allEquipment.forEach((item) => {
      priceMap.set(item.name, item.price);
    });

    // Get the names of the items in the current loadout
    const itemNames = [
      loadout.primaryweapon,
      loadout.subweapon,
      loadout.gadget1,
      loadout.gadget2,
    ];

    // Sum the prices
    return itemNames.reduce((sum, name) => {
      return sum + (priceMap.get(name) || 0);
    }, 0);
  }, [loadout, allEquipment]); // Recalculate only if these change

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

  // --- Render Logic ---

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
        {/* ✨ Updated Header with Total Price */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-baseline mb-6">
          {/* Loadout Name */}
          <h2 className="text-3xl font-bold text-white mb-2 sm:mb-0 tracking-wide text-center sm:text-left">
            {loadout.name}'s Loadout
          </h2>
          {/* Total Price */}
          <div className="text-center sm:text-right">
            <span className="text-lg text-gray-400 block">Total Cost</span>
            <span className="text-3xl font-extrabold text-cyan-400 font-mono">
              ${totalPrice.toFixed(2)}
            </span>
          </div>
        </div>

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
