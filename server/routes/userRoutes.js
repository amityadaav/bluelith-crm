
// import { Router }                                                    from "express";
// import { getUsers, getUserById, createUser, updateUser, deleteUser } from "../controllers/userController.js";
// import { protect, authorize }                                        from "../middleware/authMiddleware.js";

// const router = Router();

// router.use(protect);

// router.get("/",       authorize("admin", "sales"), getUsers);
// router.post("/",      authorize("admin"),           createUser);  // ✅ ADDED
// router.get("/:id",    authorize("admin"),           getUserById);
// router.put("/:id",    authorize("admin"),           updateUser);
// router.delete("/:id", authorize("admin"),           deleteUser);

// export default router;

import { Router }   from "express";
import { getUsers, getUserById, createUser, updateUser, deleteUser } from "../controllers/userController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = Router();
router.use(protect);

router.get("/",       authorize("admin", "manager", "hr"), getUsers);
router.post("/",      authorize("admin"),                  createUser);
router.get("/:id",    authorize("admin", "manager", "hr"), getUserById);
router.put("/:id",    authorize("admin"),                  updateUser);
router.delete("/:id", authorize("admin"),                  deleteUser);

export default router;
