import express from "express";
import "./config/dotenv.js";
import cors from "cors";
import EquipmentsController from "./controllers/equipments.js";
import LoadoutsController from "./controllers/loadouts.js";
import LoadoutController from "./controllers/loadout.js";

const app = express();
const PORT = process.env.PORT || 3001;
const router = express.Router();

app.use(express.json());
app.use(cors());
app.use("/", router);

app.get("/", (req, res) => {
  res.send(
    '<h1 style="text-align: center; margin-top: 50px;">Hello, Wolrd!</h1>'
  );
});

router.get("/equipments", EquipmentsController.getEquipments);
router.get("/loadouts", LoadoutsController.getLoadouts);
router.post("/loadouts", LoadoutsController.postLoadouts);
router.get("/loadout/:id", LoadoutController.getLoadoutById);
router.patch("/loadout/:id", LoadoutController.updateLoadout);
router.delete("/loadout/:id", LoadoutController.deleteLoadout);

app.listen(PORT, () => {
  console.log("Server is listening on port:", PORT);
});
