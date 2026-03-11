// const mongoose = require('mongoose');

// const projectSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: [true, 'Project name is required'],
//     trim: true,
//     maxlength: [100, 'Project name cannot exceed 100 characters']
//   },
//   description: {
//     type: String,
//     maxlength: [1000, 'Description cannot exceed 1000 characters']
//   },
//   client: {
//     type: String,
//     required: [true, 'Client name is required'],
//     trim: true
//   },
//   startDate: {
//     type: Date
//   },
//   endDate: {
//     type: Date
//   },
//   status: {
//     type: String,
//     enum: {
//       values: ['active', 'pending', 'completed', 'cancelled'],
//       message: '{VALUE} is not a valid status'
//     },
//     default: 'active'
//   },
//   budget: {
//     type: Number,
//     min: [0, 'Budget cannot be negative']
//   },
//   createdBy: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   }
// }, {
//   timestamps: true
// });

// // Validate that end date is after start date
// projectSchema.pre('save', function(next) {
//   if (this.startDate && this.endDate && this.endDate < this.startDate) {
//     next(new Error('End date must be after start date'));
//   }
//   next();
// });

// // Index for better query performance
// projectSchema.index({ status: 1 });
// projectSchema.index({ client: 1 });
// projectSchema.index({ createdAt: -1 });

// module.exports = mongoose.model('Project', projectSchema);

// import mongoose from "mongoose"

// const ProjectSchema = new mongoose.Schema({

// projectName:String,

// client:{
// type:mongoose.Schema.Types.ObjectId,
// ref:"Client"
// },

// status:{
// type:String,
// default:"Pending"
// },

// deadline:Date

// })

// export default mongoose.model("Project",ProjectSchema)

import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  text: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const projectSchema = new mongoose.Schema({

  name:{
    type:String,
    required:true
  },

  client:{
    type:String,
    required:true
  },

  assignedDeveloper:{
    type:String
  },

  totalBudget:{
    type:Number,
    default:0
  },

  paid:{
    type:Number,
    default:0
  },

  remaining:{
    type:Number,
    default:0
  },

  deadline:{
    type:Date
  },

  status:{
    type:String,
    enum:["Pending","In Progress","Completed"],
    default:"Pending"
  },

  comments:[commentSchema],

  createdAt:{
    type:Date,
    default:Date.now
  }

});

export default mongoose.model("Project",projectSchema);