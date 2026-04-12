import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/userModel.js";
import Role from "./models/roleModel.js";

dotenv.config();

const seedSuperAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB Connected");

    // find superadmin role
    const role = await Role.findOne({ roleName: "superadmin" });

    if (!role) {
      console.log("Superadmin role not found!");
      process.exit();
    }

    // check if user exists
    const exists = await User.findOne({ email: "superadmin@test.com" });

    if (exists) {
      console.log("Super Admin already exists");
      process.exit();
    }

    // create user
    const user = new User({
      name: "Super Admin",
      email: "superadmin@test.com",
      password: "1234",
      role: role._id,
      isAdmin: true,
    });

    await user.save();

    console.log("🔥 Super Admin USER created successfully");
    process.exit();
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};

seedSuperAdmin();