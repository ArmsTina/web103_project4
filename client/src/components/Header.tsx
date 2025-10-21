import React from "react";
import { Link } from "react-router-dom";

function Header() {
  {
    return (
      <header className="bg-gray-800 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          {/* Application Title */}
          <h1 className="text-2xl font-bold tracking-wider">R6S Loadout</h1>

          {/* Navigation Links */}
          <nav className="flex items-center space-x-4">
            <Link
              to="/"
              className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
            >
              Make Loadout
            </Link>
            <Link
              to="/loadouts"
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
            >
              See Loadouts
            </Link>
          </nav>
        </div>
      </header>
    );
  }
}

export default Header;
