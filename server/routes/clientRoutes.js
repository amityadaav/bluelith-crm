
// import { Router }                                                              from "express";
// import { getClients, createClient, getClientById, updateClient, deleteClient } from "../controllers/clientController.js";
// import { protect, authorize }                                                  from "../middleware/authMiddleware.js";

// const router = Router();
// router.use(protect);

// router.get("/",       getClients);
// router.post("/",      authorize("admin", "sales"), createClient);
// router.get("/:id",    getClientById);
// router.put("/:id",    authorize("admin", "sales"), updateClient);
// router.delete("/:id", authorize("admin"),          deleteClient);

// export default router;
import { Router } from "express";
import { getClients, createClient, getClientById, updateClient, deleteClient } from "../controllers/clientController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = Router();
router.use(protect);

router.get("/",       getClients);
router.post("/",      authorize("admin", "sales"), createClient);
router.get("/:id",    getClientById);
router.put("/:id",    authorize("admin", "sales"), updateClient);
router.delete("/:id", authorize("admin"),          deleteClient);

export default router;
