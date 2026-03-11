// const Client = require('../models/Client');

// // @desc    Get all clients
// // @route   GET /api/clients
// const getClients = async (req, res) => {
//   try {
//     const clients = await Client.find({ createdBy: req.user.id })
//       .sort({ createdAt: -1 });
//     res.json({
//       success: true,
//       count: clients.length,
//       data: clients
//     });
//   } catch (error) {
//     res.status(500).json({ 
//       success: false,
//       message: error.message 
//     });
//   }
// };

// // @desc    Get single client
// // @route   GET /api/clients/:id
// const getClient = async (req, res) => {
//   try {
//     const client = await Client.findById(req.params.id);
    
//     if (!client) {
//       return res.status(404).json({ 
//         success: false,
//         message: 'Client not found' 
//       });
//     }
    
//     if (client.createdBy.toString() !== req.user.id) {
//       return res.status(403).json({ 
//         success: false,
//         message: 'Not authorized to access this client' 
//       });
//     }
    
//     res.json({
//       success: true,
//       data: client
//     });
//   } catch (error) {
//     res.status(500).json({ 
//       success: false,
//       message: error.message 
//     });
//   }
// };

// // @desc    Create client
// // @route   POST /api/clients
// const createClient = async (req, res) => {
//   try {
//     const { name, email, phone, company, address } = req.body;
    
//     const client = await Client.create({
//       name,
//       email,
//       phone,
//       company,
//       address,
//       createdBy: req.user.id
//     });
    
//     res.status(201).json({
//       success: true,
//       data: client
//     });
//   } catch (error) {
//     if (error.name === 'ValidationError') {
//       const messages = Object.values(error.errors).map(val => val.message);
//       return res.status(400).json({
//         success: false,
//         message: messages.join(', ')
//       });
//     }
//     res.status(500).json({ 
//       success: false,
//       message: error.message 
//     });
//   }
// };

// // @desc    Update client
// // @route   PUT /api/clients/:id
// const updateClient = async (req, res) => {
//   try {
//     let client = await Client.findById(req.params.id);
    
//     if (!client) {
//       return res.status(404).json({ 
//         success: false,
//         message: 'Client not found' 
//       });
//     }
    
//     if (client.createdBy.toString() !== req.user.id) {
//       return res.status(403).json({ 
//         success: false,
//         message: 'Not authorized to update this client' 
//       });
//     }
    
//     client = await Client.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { new: true, runValidators: true }
//     );
    
//     res.json({
//       success: true,
//       data: client
//     });
//   } catch (error) {
//     if (error.name === 'ValidationError') {
//       const messages = Object.values(error.errors).map(val => val.message);
//       return res.status(400).json({
//         success: false,
//         message: messages.join(', ')
//       });
//     }
//     res.status(500).json({ 
//       success: false,
//       message: error.message 
//     });
//   }
// };

// // @desc    Delete client
// // @route   DELETE /api/clients/:id
// const deleteClient = async (req, res) => {
//   try {
//     const client = await Client.findById(req.params.id);
    
//     if (!client) {
//       return res.status(404).json({ 
//         success: false,
//         message: 'Client not found' 
//       });
//     }
    
//     if (client.createdBy.toString() !== req.user.id) {
//       return res.status(403).json({ 
//         success: false,
//         message: 'Not authorized to delete this client' 
//       });
//     }
    
//     await client.deleteOne();
    
//     res.json({
//       success: true,
//       message: 'Client removed successfully'
//     });
//   } catch (error) {
//     res.status(500).json({ 
//       success: false,
//       message: error.message 
//     });
//   }
// };

// module.exports = {
//   getClients,
//   getClient,
//   createClient,
//   updateClient,
//   deleteClient
// };
import Client from "../models/Client.js"

export const createClient = async(req,res)=>{

try{

const client = new Client(req.body)

await client.save()

res.status(201).json(client)

}catch(error){

res.status(500).json(error)

}

}

export const getClients = async(req,res)=>{

try{

const clients = await Client.find()

res.json(clients)

}catch(error){

res.status(500).json(error)

}

}