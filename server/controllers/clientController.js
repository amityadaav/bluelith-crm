
// import Client from "../models/Client.js"

// export const createClient = async(req,res)=>{

// try{

// const client = new Client(req.body)

// await client.save()

// res.status(201).json(client)

// }catch(error){

// res.status(500).json(error)

// }

// }

// export const getClients = async(req,res)=>{

// try{

// const clients = await Client.find()

// res.json(clients)

// }catch(error){

// res.status(500).json(error)

// }

// }

import Client         from "../models/Client.js";
import { Activity }   from "../models/Notification.js";

export const getClients = async (req, res, next) => {
  try {
    const filter = {};
    if (req.user.role === "sales") filter.assignedTo = req.user._id;
    if (req.query.status) filter.status = req.query.status;
    const clients = await Client.find(filter).populate("assignedTo", "name email").sort({ createdAt: -1 });
    res.json(clients);
  } catch (error) { next(error); }
};

export const createClient = async (req, res, next) => {
  try {
    const client = await Client.create({ ...req.body, assignedTo: req.body.assignedTo || req.user._id });
    await Activity.create({ type: "client_created", description: `New client "${client.name}" was added`, user: req.user._id, userName: req.user.name, relatedTo: { model: "Client", id: client._id } });
    res.status(201).json({ success: true, client });
  } catch (error) { next(error); }
};

export const getClientById = async (req, res, next) => {
  try {
    const client = await Client.findById(req.params.id).populate("assignedTo", "name email phone");
    if (!client) return res.status(404).json({ message: "Client not found." });
    res.json(client);
  } catch (error) { next(error); }
};

export const updateClient = async (req, res, next) => {
  try {
    const client = await Client.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!client) return res.status(404).json({ message: "Client not found." });
    await Activity.create({ type: "client_updated", description: `Client "${client.name}" was updated`, user: req.user._id, userName: req.user.name, relatedTo: { model: "Client", id: client._id } });
    res.json({ success: true, client });
  } catch (error) { next(error); }
};

export const deleteClient = async (req, res, next) => {
  try {
    const client = await Client.findByIdAndDelete(req.params.id);
    if (!client) return res.status(404).json({ message: "Client not found." });
    res.json({ success: true, message: "Client deleted successfully." });
  } catch (error) { next(error); }
};