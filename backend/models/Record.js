import mongoose from "mongoose";

const recordSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    type: {
      type: String,
      enum: ["income", "expense"],
      required: true,
    },

    category: {
      type: String,
      required: true,
    },

    note: {
      type: String,
      default: "",
    },

    date: {
      type: Date,
      default: Date.now,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isDeleted: {
  type: Boolean,
  default: false,
},
deletedAt: {
  type: Date,
  default: null,
},
createdBy: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  required: true,
}
  },
  { timestamps: true }
);

export default mongoose.model("Record", recordSchema);