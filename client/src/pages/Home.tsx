import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

type Equipment = {
  name: string;
  image: string;
  item_type: "primaryWeapon" | "subWeapon" | "gadget";
  price: number;
};

type SelectedItem = {
  name: string;
  price: number;
};

type ItemCardProps = {
  item: Equipment;
  isSelected: boolean;
  isDisabled?: boolean;
  onSelect: (itemData: SelectedItem) => void;
};

const ItemCard = ({
  item,
  isSelected,
  isDisabled = false,
  onSelect,
}: ItemCardProps) => {
  const imagePath = `/assets/${item.image}`;

  const baseClasses =
    "border-2 rounded-lg p-4 bg-gray-800 transition-all duration-200 cursor-pointer flex flex-col items-center space-y-2";
  const borderClasses = isSelected
    ? "border-cyan-500 shadow-cyan-500/30 shadow-xl scale-[1.03]"
    : "border-gray-700 hover:border-gray-500";
  const disabledClasses = isDisabled
    ? "opacity-40 cursor-not-allowed grayscale"
    : "";

  return (
    <div
      className={`${baseClasses} ${borderClasses} ${disabledClasses}`}
      onClick={() =>
        !isDisabled && onSelect({ name: item.name, price: item.price })
      }
    >
      <img
        src={imagePath}
        alt={item.name}
        className="h-16 w-full object-contain"
        onError={(e) => {
          e.currentTarget.src = `https://placehold.co/150x100/2d3748/ffffff?text=${item.name}`;
        }}
      />
      <p className="text-white font-semibold text-center text-sm">
        {item.name}
      </p>
      <p className="text-cyan-400 text-xs font-mono font-bold">
        ${item.price.toFixed(2)}
      </p>
    </div>
  );
};

const Home = () => {
  const [availablePrimary, setAvailablePrimary] = useState<Equipment[]>([]);
  const [availableSub, setAvailableSub] = useState<Equipment[]>([]);
  const [availableGadgets, setAvailableGadgets] = useState<Equipment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const [loadoutName, setLoadoutName] = useState("");
  const [primary, setPrimary] = useState<SelectedItem | null>(null);
  const [sub, setSub] = useState<SelectedItem | null>(null);
  const [gadget1, setGadget1] = useState<SelectedItem | null>(null);
  const [gadget2, setGadget2] = useState<SelectedItem | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const totalPrice = useMemo(() => {
    const items = [primary, sub, gadget1, gadget2];
    return items.reduce((sum, item) => sum + (item?.price || 0), 0);
  }, [primary, sub, gadget1, gadget2]);

  useEffect(() => {
    const get_items = async () => {
      try {
        const response = await axios("http://localhost:3001/equipments");
        const data: Equipment[] = response.data;

        const validatedData = data.map((item) => ({
          ...item,
          price: parseFloat(item.price as any) || 0,
        }));

        const primaryWeapons: Equipment[] = validatedData.filter(
          (item) => item.item_type === "primaryWeapon"
        );
        const subWeapons: Equipment[] = validatedData.filter(
          (item) => item.item_type === "subWeapon"
        );
        const gadgets: Equipment[] = validatedData.filter(
          (item) => item.item_type === "gadget"
        );

        setAvailablePrimary(primaryWeapons);
        setAvailableSub(subWeapons);
        setAvailableGadgets(gadgets);
      } catch (err) {
        setMessage(`Error occurred while loading equipments: ${err}`);
      } finally {
        setIsLoading(false);
      }
    };

    get_items();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!loadoutName || !primary || !sub || !gadget1 || !gadget2) {
      setMessage("Please name your loadout and select an item for each slot.");
      return;
    }

    const newLoadout = {
      name: loadoutName,
      primaryWeapon: primary.name,
      subWeapon: sub.name,
      gadget1: gadget1.name,
      gadget2: gadget2.name,
      price: totalPrice,
    };

    console.log("Submitting to server:", newLoadout);

    try {
      await axios.post("http://localhost:3001/loadouts", newLoadout);
      navigate("/loadouts");
    } catch (err) {
      let errorMessage =
        "Something went wrong while saving your loadout. Please try again.";

      if (axios.isAxiosError(err)) {
        if (err.response) {
          const serverMessage = err.response.data?.error;

          if (serverMessage) {
            errorMessage = `Error: ${serverMessage}`;
          } else {
            errorMessage = `Server Error (${err.response.status}): Could not save loadout.`;
          }
        } else if (err.request) {
          errorMessage = "Network Error: Could not connect to the server.";
        }
      }

      setMessage(errorMessage);
      console.error("Post error: ", err);
      return;
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

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 text-white bg-gray-900 min-h-screen">
      <h1 className="text-4xl font-extrabold mb-2 tracking-wider text-cyan-500">
        Build Your Tactical Loadout
      </h1>
      <p className="text-gray-400 mb-8">
        Select your weapons and gadgets to prepare for the mission.
      </p>

      <form onSubmit={handleSubmit} className="space-y-10">
        <div>
          <label
            htmlFor="loadoutName"
            className="block text-xl font-semibold mb-3 text-gray-200"
          >
            Loadout Name
          </label>
          <input
            id="loadoutName"
            type="text"
            value={loadoutName}
            onChange={(e) => setLoadoutName(e.target.value)}
            placeholder="e.g., Aggressive Entry, Recon Specialist"
            className="w-full bg-gray-800 border-2 border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition shadow-inner shadow-gray-700/50"
          />
        </div>

        <section>
          <h2 className="text-2xl font-bold mb-4 border-b border-gray-700 pb-2">
            Primary Weapon
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {availablePrimary.map((weapon) => (
              <ItemCard
                key={weapon.name}
                item={weapon}
                isSelected={primary?.name === weapon.name}
                onSelect={(selected) => setPrimary(selected)}
              />
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 border-b border-gray-700 pb-2">
            Secondary Weapon
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {availableSub.map((weapon) => (
              <ItemCard
                key={weapon.name}
                item={weapon}
                isSelected={sub?.name === weapon.name}
                onSelect={(selected) => setSub(selected)}
              />
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 border-b border-gray-700 pb-2">
            Gadget 1
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {availableGadgets.map((gadget) => (
              <ItemCard
                key={gadget.name}
                item={gadget}
                isSelected={gadget1?.name === gadget.name}
                isDisabled={gadget2?.name === gadget.name}
                onSelect={(selected) => {
                  if (gadget2?.name === selected.name) setGadget2(null);
                  setGadget1(selected);
                }}
              />
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 border-b border-gray-700 pb-2">
            Gadget 2
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {availableGadgets.map((gadget) => (
              <ItemCard
                key={gadget.name}
                item={gadget}
                isSelected={gadget2?.name === gadget.name}
                isDisabled={gadget1?.name === gadget.name}
                onSelect={(selected) => setGadget2(selected)}
              />
            ))}
          </div>
        </section>

        <div className="pt-8 space-y-4">
          <div className="flex justify-between items-center bg-gray-800 p-4 rounded-lg border-2 border-cyan-700 shadow-md shadow-cyan-900/50">
            <span className="text-xl font-bold tracking-wide text-gray-200">
              Total Loadout Cost:
            </span>
            <span className="text-3xl font-extrabold text-cyan-400 font-mono">
              ${totalPrice.toFixed(2)}
            </span>
          </div>

          {message && (
            <p className="text-red-400 mb-4 text-center p-3 bg-red-900/20 rounded-lg">
              {message}
            </p>
          )}
          <button
            type="submit"
            className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-4 px-6 rounded-lg text-lg transition-colors duration-300 shadow-xl shadow-cyan-600/40 transform hover:scale-[1.01]"
          >
            Save Loadout
          </button>
        </div>
      </form>
    </div>
  );
};

export default Home;
