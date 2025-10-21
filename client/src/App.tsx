import "./App.css";
import Header from "./components/Header";
import Home from "./pages/Home";
import { Routes, Route } from "react-router-dom";
import Loadouts from "./pages/Loadouts";
import Loadout from "./pages/Loadout";
import Edit from "./pages/Edit";

function App() {
  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <Header />
      <main>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/loadouts" element={<Loadouts />} />
            <Route path="/loadout/:id" element={<Loadout />} />
            <Route path="/edit/:id" element={<Edit></Edit>}></Route>
            <Route path="*" element={<Home></Home>}></Route>
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default App;
