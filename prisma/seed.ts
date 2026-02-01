import { PrismaClient } from '@prisma/client';
import permissionsConfig from '../json/admin.permission.json';
import bcrypt from 'bcryptjs';
const prisma = new PrismaClient();

function setAllTrue(input: any): any {
  if (typeof input !== 'object' || input === null) {
    return true;
  }

  const result: any = {};

  for (const key in input) {
    result[key] = setAllTrue(input[key]);
  }

  return result;
}


async function main() {
  const roles = permissionsConfig.roles;

  // 🔹 Admin permission
  const adminPermission = await prisma.permission.upsert({
    where: { name: 'admin' },
    update: { rules: roles.admin },
    create: {
      name: 'admin',
      rules: roles.admin,
    },
  });

  // 🔹 User permission
  const userPermission = await prisma.permission.upsert({
    where: { name: 'user' },
    update: { rules: roles.user },
    create: {
      name: 'user',
      rules: roles.user,
    },
  });

  await prisma.admin.updateMany({
    where: { permission_id: null },
    data: { permission_id: adminPermission.id },
  });

  await prisma.user.updateMany({
    where: { permission_id: null },
    data: { permission_id: userPermission.id },
  });

  // super admin
  const superAdminEmail = 'gkstar434@gmail.com';
   const DefaultTenant = await prisma.tenant.upsert({
    where: { slug: 'flipkart' },
    update: {},
    create: {
      name: 'Flipkart',
      slug: 'flipkart',
    },
  });
  const superAdminRules = setAllTrue(roles.admin);

  const superAdminPermission = await prisma.permission.upsert({
    where: { name: 'super_Admin' },
    update: { rules: superAdminRules },
    create: {
      name: 'super_Admin',
      rules: superAdminRules,
    },
  });

  const existingSuperAdmin = await prisma.admin.findFirst({
    where: { is_supreme_admin: true },
  });

  if (!existingSuperAdmin) {
    const hashedPassword = await bcrypt.hash('ganeshsuthar', 10);

    await prisma.admin.create({
      data: {
        email: superAdminEmail,
        password: hashedPassword,
        name: 'Super Admin',
        is_supreme_admin: true,
        permission_id: superAdminPermission.id,
        tenant_id: DefaultTenant.id,
      },
    });

    console.log('✅ Default Super Admin created');
  } else {
    console.log('ℹ️ Super Admin already exists');
  }
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
