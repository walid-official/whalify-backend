
import bcrypt from "bcryptjs";
import { prisma } from "../../shared/prisma";
import { CreateUserInput } from "./user.validation";

export const UserService = {
  async createUser(data: CreateUserInput) {
    // Check if email already exists
    if (data.email) {
      const existingEmail = await prisma.user.findUnique({
        where: { email: data.email },
      });
      if (existingEmail) throw new Error("Email already exists");
    }

    // Check if phone exists
    if (data.phone) {
      const existingPhone = await prisma.user.findFirst({
        where: { phone: data.phone },
      });
      if (existingPhone) throw new Error("Phone already exists");
    }

    // Prepare data
    const preparedData: any = {
      name: data.name,
      email: data.email,
      phone: data.phone ?? null,
      image: data.image ?? null,
      role: data.role ?? "CUSTOMER",
      provider: data.provider ?? "LOCAL",
      providerId: data.providerId ?? null,
    };

    // Password hash
    if (data.password) {
      preparedData.password = await bcrypt.hash(data.password, 10);
    }

    // Create new user
    const user = await prisma.user.create({
      data: preparedData,
    });

    return user;
  },

  async getAllUsers() {
    return prisma.user.findMany({ orderBy: { createdAt: "desc" } });
  },

  async getUserById(id: string) {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) throw new Error("User not found");
    return user;
  },
};
