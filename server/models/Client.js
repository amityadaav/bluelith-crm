// const mongoose = require('mongoose');

// const clientSchema = new mongoose.Schema({
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
//     unique: true,
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
//   address: {
//     type: String,
//     trim: true,
//     maxlength: [200, 'Address cannot exceed 200 characters']
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
// clientSchema.index({ email: 1, createdBy: 1 });
// clientSchema.index({ company: 1 });
// clientSchema.index({ createdAt: -1 });

// module.exports = mongoose.model('Client', clientSchema);

// import mongoose from "mongoose"

// const ClientSchema = new mongoose.Schema({

// name:String,
// email:String,
// phone:String,
// company:String,

// createdAt:{
// type:Date,
// default:Date.now
// }

// })

// export default mongoose.model("Client",ClientSchema)



import mongoose from "mongoose"

const ClientSchema = new mongoose.Schema({

  name:{
    type:String,
    required:true
  },

  email:{
    type:String,
    required:true
  },

  phone:{
    type:String
  },

  company:{
    type:String
  },

  service:{
    type:String
  },

  status:{
    type:String,
    enum:["active","inactive","pending"],
    default:"active"
  },

  notes:{
    type:String
  },

  connectedAt:{
    type:Date,
    default:Date.now
  }

},{
  timestamps:true
})

export default mongoose.model("Client",ClientSchema)