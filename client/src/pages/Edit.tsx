import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import type { Equipment, type_loadout, ItemCardProps } from "../types";

const ItemCard = ({
  item,
  isSelected,
  isDisabled = false,
  onSelect,
}: ItemCardProps) => {
  // Image path construction
  const imagePath = `/assets/${item.image}`;

  // Dynamically applies Tailwind CSS classes for styling
  const baseClasses =
    "border-2 rounded-lg p-4 bg-gray-800 transition-all duration-200 flex flex-col items-center space-y-3";
  const borderClasses = isSelected
    ? "border-cyan-500 shadow-cyan-500/30 shadow-lg"
    : "border-gray-700 hover:border-gray-500";
  const interactionClasses = isDisabled
    ? "opacity-40 cursor-not-allowed"
    : "cursor-pointer hover:scale-[1.02]";

  return (
    <div
      className={`${baseClasses} ${borderClasses} ${interactionClasses}`}
      onClick={() => !isDisabled && onSelect()}
    >
      <img
        src={imagePath}
        alt={item.name}
        className="h-20 w-full object-contain"
        // Fallback in case the image fails to load.
        onError={(e) => {
          e.currentTarget.src = `https://placehold.co/150x100/2d3748/ffffff?text=${item.name}`;
        }}
      />
      <p className="text-white font-semibold text-center text-sm">
        {item.name}
      </p>
    </div>
  );
};

/**
 * The main component for the /loadout/edit/:id page
 */
function Edit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // --- Available Items State (Fetched once) ---
  const [availablePrimary, setAvailablePrimary] = useState<Equipment[]>([]);
  const [availableSub, setAvailableSub] = useState<Equipment[]>([]);
  const [availableGadgets, setAvailableGadgets] = useState<Equipment[]>([]);

  // --- Form State (Pre-filled and Updated) ---
  const [loadoutName, setLoadoutName] = useState("");
  const [primary, setPrimary] = useState<string | null>(null);
  const [sub, setSub] = useState<string | null>(null);
  const [gadget1, setGadget1] = useState<string | null>(null);
  const [gadget2, setGadget2] = useState<string | null>(null);

  // --- UI/Loading State ---
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  // --- Combined Fetch Effect: Items & Current Loadout ---
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // 1. Fetch available equipment
        const itemsResponse = await axios.get(
          "http://localhost:3001/equipments"
        );
        const data: Equipment[] = itemsResponse.data;

        const primaryWeapons: Equipment[] = [];
        const subWeapons: Equipment[] = [];
        const gadgets: Equipment[] = [];

        data.forEach((item) => {
          if (item.item_type === "primaryWeapon") primaryWeapons.push(item);
          else if (item.item_type === "subWeapon") subWeapons.push(item);
          else if (item.item_type === "gadget") gadgets.push(item);
        });

        setAvailablePrimary(primaryWeapons);
        setAvailableSub(subWeapons);
        setAvailableGadgets(gadgets);

        // 2. Fetch current loadout details (only if ID is present)
        if (id) {
          const loadoutResponse = await axios.get(
            `http://localhost:3001/loadout/${id}`
          );
          const loadout: type_loadout = loadoutResponse.data;

          // Populate form state with existing loadout data
          setLoadoutName(loadout.name);
          setPrimary(loadout.primaryweapon);
          setSub(loadout.subweapon);
          setGadget1(loadout.gadget1);
          setGadget2(loadout.gadget2);
        }
      } catch (err) {
        let errorMessage = "Failed to load necessary data.";
        if (axios.isAxiosError(err) && err.response?.data?.error) {
          errorMessage = `Error: ${err.response.data.error}`;
        }
        setError(errorMessage);
        console.error("Fetch Error: ", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // --- Handle Form Submission (PATCH) ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    // Simple validation
    if (!loadoutName || !primary || !sub || !gadget1 || !gadget2) {
      setMessage(
        "Please ensure the loadout is named and all slots are selected."
      );
      return;
    }

    const updatedLoadout = {
      name: loadoutName,
      primaryWeapon: primary,
      subWeapon: sub,
      gadget1: gadget1,
      gadget2: gadget2,
    };

    try {
      // Send PATCH request to update the loadout
      await axios.patch(`http://localhost:3001/loadout/${id}`, updatedLoadout);

      setMessage("Loadout updated successfully!");
      // Redirect user back to the detail view after a short delay
      setTimeout(() => navigate(`/loadout/${id}`), 1000);
    } catch (err) {
      let errorMessage = "Something went wrong while updating your loadout.";

      if (axios.isAxiosError(err) && err.response?.data?.error) {
        errorMessage = `Update Failed: ${err.response.data.error}`;
      }

      setMessage(errorMessage);
      console.error("Patch error: ", err);
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
    return (
      <div className="text-center text-red-500 p-10 text-xl">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-4xl font-bold mb-2 tracking-wider text-cyan-400">
        Edit Loadout {loadoutName}
      </h1>
      <p className="text-gray-400 mb-8">
        Modify your selections and save the updated loadout configuration.
      </p>

      <form onSubmit={handleSubmit} className="space-y-10">
        {/* Loadout Name Input */}
        <div>
          <label
            htmlFor="loadoutName"
            className="block text-xl font-semibold mb-3 text-white"
          >
            Loadout Name
          </label>
          <input
            id="loadoutName"
            type="text"
            value={loadoutName}
            onChange={(e) => setLoadoutName(e.target.value)}
            placeholder="e.g., Aggressive Entry"
            className="w-full bg-gray-800 border-2 border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition"
          />
        </div>

        {/* Primary Weapon Selection */}
        <section>
          <h2 className="text-xl font-semibold mb-4 text-white">
            Primary Weapon
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {availablePrimary.map((weapon) => (
              <ItemCard
                key={weapon.name}
                item={weapon}
                isSelected={primary === weapon.name}
                onSelect={() => setPrimary(weapon.name)}
              />
            ))}
          </div>
        </section>

        {/* Sub Weapon Selection */}
        <section>
          <h2 className="text-xl font-semibold mb-4 text-white">Sub Weapon</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {availableSub.map((weapon) => (
              <ItemCard
                key={weapon.name}
                item={weapon}
                isSelected={sub === weapon.name}
                onSelect={() => setSub(weapon.name)}
              />
            ))}
          </div>
        </section>

        {/* Gadget 1 Selection */}
        <section>
          <h2 className="text-xl font-semibold mb-4 text-white">Gadget 1</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {availableGadgets.map((gadget) => (
              <ItemCard
                key={gadget.name}
                item={gadget}
                isSelected={gadget1 === gadget.name}
                // Disable if already selected as Gadget 2
                isDisabled={gadget2 === gadget.name}
                onSelect={() => {
                  setGadget1(gadget.name);
                }}
              />
            ))}
          </div>
        </section>

        {/* Gadget 2 Selection */}
        <section>
          <h2 className="text-xl font-semibold mb-4 text-white">Gadget 2</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {availableGadgets.map((gadget) => (
              <ItemCard
                key={gadget.name}
                item={gadget}
                isSelected={gadget2 === gadget.name}
                // Disable if already selected as Gadget 1
                isDisabled={gadget1 === gadget.name}
                onSelect={() => setGadget2(gadget.name)}
              />
            ))}
          </div>
        </section>

        {/* Message and Submit Button */}
        <div className="pt-4">
          {message && (
            <div
              className={`p-3 rounded-lg text-center font-medium ${
                message.includes("successfully")
                  ? "bg-green-700 text-white"
                  : "bg-red-700 text-white"
              } mb-4`}
            >
              {message}
            </div>
          )}
          <button
            type="submit"
            className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-4 px-6 rounded-lg text-lg transition-colors duration-300 transform hover:scale-[1.01]"
          >
            Update Loadout
          </button>
        </div>
      </form>
    </div>
  );
}

export default Edit;
