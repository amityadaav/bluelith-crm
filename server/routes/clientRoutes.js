// import express from "express"
// import Client from "../models/Client.js"

// const router = express.Router()

// // GET clients
// router.get("/", async (req,res)=>{

//  const clients = await Client.find().sort({createdAt:-1})

//  res.json(clients)

// })

// // CREATE client
// router.post("/", async (req,res)=>{

//  const client = new Client(req.body)

//  await client.save()

//  res.json(client)

// })

// // DELETE client
// router.delete("/:id", async (req,res)=>{

//  await Client.findByIdAndDelete(req.params.id)

//  res.json({message:"Client deleted"})

// })

// export default router

import { Router }                                                              from "express";
import { getClients, createClient, getClientById, updateClient, deleteClient } from "../controllers/clientController.js";
import { protect, authorize }                                                  from "../middleware/authMiddleware.js";

const router = Router();
router.use(protect);

router.get("/",       getClients);
router.post("/",      authorize("admin", "sales"), createClient);
router.get("/:id",    getClientById);
router.put("/:id",    authorize("admin", "sales"), updateClient);
router.delete("/:id", authorize("admin"),          deleteClient);

export default router;