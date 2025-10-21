import { useState, useEffect } from "react";
import Card from "../components/Card";
import type { type_loadout } from "../types";
import axios from "axios";

function Loadouts() {
  const [loadouts, setLoadouts] = useState<type_loadout[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLoadouts = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await axios.get<type_loadout[]>(
          "http://localhost:3001/loadouts"
        );
        setLoadouts(response.data);
      } catch (err) {
        console.error("Failed to fetch loadouts:", err);
        setError("Failed to fetch loadouts. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLoadouts();
  }, []);

  if (error) {
    return (
      <div>
        <span>{error}</span>
      </div>
    );
  }

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

  return (
    <div>
      {loadouts.map((loadout: type_loadout) => (
        <Card loadout={loadout}></Card>
      ))}
    </div>
  );
}

export default Loadouts;
