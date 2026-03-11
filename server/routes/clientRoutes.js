// const express = require('express');
// const router = express.Router();
// const {
//   getClients,
//   getClient,
//   createClient,
//   updateClient,
//   deleteClient
// } = require('../controllers/clientController');
// const { protect } = require('../middleware/authMiddleware');

// // All routes are protected
// router.use(protect);

// router.route('/')
//   .get(getClients)
//   .post(createClient);

// router.route('/:id')
//   .get(getClient)
//   .put(updateClient)
//   .delete(deleteClient);

// module.exports = router;
// import express from "express"
// import { createClient, getClients } from "../controllers/clientController.js"

// const router = express.Router()

// router.post("/add", createClient)
// router.get("/", getClients)

// export default router

import express from "express"
import Client from "../models/Client.js"

const router = express.Router()

// GET clients
router.get("/", async (req,res)=>{

 const clients = await Client.find().sort({createdAt:-1})

 res.json(clients)

})

// CREATE client
router.post("/", async (req,res)=>{

 const client = new Client(req.body)

 await client.save()

 res.json(client)

})

// DELETE client
router.delete("/:id", async (req,res)=>{

 await Client.findByIdAndDelete(req.params.id)

 res.json({message:"Client deleted"})

})

export default router