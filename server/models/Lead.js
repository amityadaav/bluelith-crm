// const mongoose = require('mongoose');

// const leadSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: [true, 'Name is required'],
//     trim: true,
//     maxlength: [100, 'Name cannot exceed 100 characters']
//   },
//   email: {
//     type: String,
//     required: [true, 'Email is required'],
//     trim: true,
//     lowercase: true,
//     match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
//   },
//   phone: {
//     type: String,
//     trim: true,
//     maxlength: [20, 'Phone number cannot exceed 20 characters']
//   },
//   company: {
//     type: String,
//     trim: true,
//     maxlength: [100, 'Company name cannot exceed 100 characters']
//   },
//   status: {
//     type: String,
//     enum: {
//       values: ['new', 'contacted', 'qualified', 'lost'],
//       message: '{VALUE} is not a valid status'
//     },
//     default: 'new'
//   },
//   notes: {
//     type: String,
//     maxlength: [1000, 'Notes cannot exceed 1000 characters']
//   },
//   createdBy: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   }
// }, {
//   timestamps: true
// });

// // Index for better query performance
// leadSchema.index({ email: 1, createdBy: 1 });
// leadSchema.index({ status: 1 });
// leadSchema.index({ createdAt: -1 });

// module.exports = mongoose.model('Lead', leadSchema);
// import mongoose from "mongoose"

// const LeadSchema = new mongoose.Schema({

// name:{
// type:String,
// required:true
// },

// email:String,
// phone:String,
// service:String,

// status:{
// type:String,
// default:"New"
// },

// createdAt:{
// type:Date,
// default:Date.now
// }

// })

// export default mongoose.model("Lead",LeadSchema)

import mongoose from "mongoose"

const LeadSchema = new mongoose.Schema({

 name:String,
 email:String,
 phone:String,
 company:String,
 status:{
  type:String,
  default:"new"
 },
 notes:String,

 createdAt:{
  type:Date,
  default:Date.now
 }

})

export default mongoose.model("Lead",LeadSchema)