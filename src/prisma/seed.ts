import prisma from ".";
import { type Prisma } from "@prisma/client";


async function main() {
  // Populate assets
  const assetsData: Prisma.AssetCreateInput[] = [
    {
      name: "Ethereum",
      symbol: "ETH",
      type: "CRYPTO",
    },
    {
      name: "Bitcoin",
      symbol: "BTC",
      type: "CRYPTO",
    },
    {
      name: "US Dollar",
      symbol: "USD",
      type: "FIAT",
    },
  ];

  const existingAssets = await prisma.asset.findMany({
    where: {
      symbol: {
        in: assetsData.map((asset) => asset.symbol),
      },
    },
    select: {
      symbol: true,
    },
  });

  const existingSymbols = existingAssets.map((asset) => asset.symbol);
  const newAssetsData = assetsData.filter(
    (asset) => !existingSymbols.includes(asset.symbol)
  );

  if (newAssetsData.length > 0) {
    await prisma.asset.createMany({
      data: newAssetsData
    });
  }

  // Just creating some dummy/test users - as i have not implemented any APIs for auth & authorization flows.
  const dummyUsers: Prisma.UserCreateInput[] = [
    {
      name: "Jim",
      email: "jim@test.com",
      apiKey: "test-jim-api-key",
      password: "password123",
    },
    {
      name: "Michael",
      email: "mic@test.com",
      apiKey: "test-mic-api-key",
      password: "password456",
    },
  ];

  const existingUsers = await prisma.user.findMany({
    where: {
      email: {
        in: dummyUsers.map((user) => user.email),
      },
    },
    select: {
      email: true,
    },
  });

  const existingEmails = existingUsers.map((user) => user.email);
  const newUsersData = dummyUsers.filter(
    (user) => !existingEmails.includes(user.email)
  );

  if (newUsersData.length > 0) {
    await prisma.user.createMany({
      data: newUsersData
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });