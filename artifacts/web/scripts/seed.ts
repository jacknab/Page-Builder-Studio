import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { db, plansTable, usersTable } from "@workspace/db";

async function main() {
  const PLANS = [
    {
      slug: "free",
      name: "Free",
      description: "1 site on a launchsite subdomain.",
      priceCents: 0,
      allowsCustomDomain: false,
      allowsDomainPurchase: false,
      maxSites: 1,
      sortOrder: 0,
    },
    {
      slug: "domain-forward",
      name: "Domain Forward",
      description: "Point an existing domain at your launched site.",
      priceCents: 0,
      allowsCustomDomain: true,
      allowsDomainPurchase: false,
      maxSites: 1,
      sortOrder: 1,
    },
    {
      slug: "domain-purchase",
      name: "Domain Purchase",
      description: "We buy and configure your domain via Namecheap.",
      priceCents: 2500,
      allowsCustomDomain: true,
      allowsDomainPurchase: true,
      maxSites: 1,
      sortOrder: 2,
    },
  ];

  for (const plan of PLANS) {
    const [existing] = await db
      .select({ id: plansTable.id })
      .from(plansTable)
      .where(eq(plansTable.slug, plan.slug))
      .limit(1);
    if (existing) {
      await db.update(plansTable).set(plan).where(eq(plansTable.id, existing.id));
      console.log(`updated plan: ${plan.slug}`);
    } else {
      await db.insert(plansTable).values(plan);
      console.log(`inserted plan: ${plan.slug}`);
    }
  }

  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? "admin@launchsite.local";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? "launchsite-admin";
  const [adminExisting] = await db
    .select({ id: usersTable.id })
    .from(usersTable)
    .where(eq(usersTable.email, adminEmail))
    .limit(1);
  if (!adminExisting) {
    const passwordHash = await bcrypt.hash(adminPassword, 12);
    await db.insert(usersTable).values({ email: adminEmail, passwordHash, isAdmin: true });
    console.log(`created admin user: ${adminEmail} / ${adminPassword}`);
  } else {
    await db
      .update(usersTable)
      .set({ isAdmin: true })
      .where(eq(usersTable.id, adminExisting.id));
    console.log(`promoted existing user to admin: ${adminEmail}`);
  }

  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
