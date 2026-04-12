import mongoose from 'mongoose';

const roleSchema = new mongoose.Schema(
  {
    roleName: {
      type: String,
      required: [true, 'Please add a role name'],
      unique: true,
      trim: true,
    },
    permissions: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

const Role = mongoose.model('Role', roleSchema);
export default Role;
