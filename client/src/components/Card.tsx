import { Link } from "react-router-dom";
import type { type_loadout } from "../types";

const Card = ({
  loadout,
  totalPrice,
}: {
  loadout: type_loadout;
  totalPrice: number;
}) => {
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-6 transition-all duration-300 ease-in-out hover:shadow-cyan-500/20 hover:border-cyan-500 transform hover:-translate-y-1">
      <div className="flex flex-col sm:flex-row justify-between sm:items-baseline mb-4">
        <h2 className="text-2xl font-bold text-white mb-2 sm:mb-0 tracking-wide">
          {loadout.name}'s Loadout
        </h2>
        <div className="text-left sm:text-right">
          <span className="text-sm text-gray-400 block">Total Cost</span>
          <span className="text-2xl font-extrabold text-cyan-400 font-mono">
            ${totalPrice}
          </span>
        </div>
      </div>

      <div className="space-y-5">
        {/* Primary Weapon Section */}
        <div className="flex items-center space-x-4">
          <div>
            <p className="text-sm text-gray-400 font-medium">🪖 Primary</p>
            <p className="text-lg text-white font-semibold">
              {loadout.primaryweapon}
            </p>
          </div>
        </div>

        {/* Sub Weapon Section */}
        <div className="flex items-center space-x-4">
          <div>
            <p className="text-sm text-gray-400 font-medium">🔫 Sub</p>
            <p className="text-lg text-white font-semibold">
              {loadout.subweapon}
            </p>
          </div>
        </div>

        {/* Gadgets Section */}
        <div className="flex items-start space-x-4">
          <div>
            <p className="text-sm text-gray-400 font-medium mb-1">💣 Gadgets</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
              <p className="text-lg text-white font-semibold">
                {loadout.gadget1}
              </p>
              <p className="text-lg text-white font-semibold">
                {loadout.gadget2}
              </p>
            </div>
          </div>
        </div>
        <Link
          to={`/loadout/${loadout.id}`}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
        >
          Details
        </Link>
      </div>
    </div>
  );
};

export default Card;
