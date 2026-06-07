const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
prisma.users.findMany().then(r => console.log("USERS:", JSON.stringify(r))).catch(e => console.error("DB ERROR", e)).finally(() => prisma.$disconnect());
