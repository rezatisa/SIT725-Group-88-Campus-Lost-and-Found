// Loads sample lost and found reports so the Browse page has data to show.
// Docker:  docker compose exec app node scripts/seed.js
// Local:   npm run seed
// Existing reports are kept; sample reports are only added when the database is empty.
// Sample photos are served from public/images/samples/.

require("dotenv").config();

const mongoose = require("mongoose");
const LostItem = require("../models/lostItem.model");
const FoundItem = require("../models/foundItem.model");

const sampleFoundItems = [
  {
    title: "Red Wallet",
    photos: ["/images/samples/red-wallet.svg"],
    category: "Student Cards, Wallets, IDs",
    description: "Red wallet with student ID",
    foundAt: "2026-09-08",
    campusLocation: "Melbourne Burwood - B Building, B312",
    contactMethod: "collection",
    collectionLocation: "Campus Security / Student Central",
  },
  {
    title: "Harry Potter",
    photos: ["/images/samples/hardcover-book.svg"],
    category: "Books & Stationery",
    description: "Harry Potter and the Philosopher's Stone, paperback",
    foundAt: "2026-09-08",
    campusLocation: "Waurn Ponds - B, 22",
    contactMethod: "collection",
    collectionLocation: "Campus Security / Student Central",
  },
  {
    title: "Hat",
    photos: ["/images/samples/black-cap.svg"],
    category: "Clothing",
    description: "Black baseball cap",
    foundAt: "2026-09-08",
    campusLocation: "Burwood - C, 22",
    contactMethod: "email",
  },
  {
    title: "Jacket",
    photos: ["/images/samples/grey-jacket.svg"],
    category: "Clothing",
    description: "Grey jacket with Puma logo",
    foundAt: "2026-09-08",
    campusLocation: "Waterfront - F, 12",
    contactMethod: "collection",
    collectionLocation: "Campus Security / Student Central",
  },
];

const sampleLostItems = [
  {
    title: "Laptop",
    photos: ["/images/samples/silver-laptop.svg"],
    category: "Electronics",
    description: "Silver laptop in a black sleeve",
    lostAt: "2026-09-08",
    campusLocation: "Warrnambool - C, C11",
  },
  {
    title: "Novel Book",
    photos: ["/images/samples/novel-book.svg"],
    category: "Books & Stationery",
    description: "The Love Novel Book",
    lostAt: "2026-09-07",
    campusLocation: "Waterfront - LA, 11",
  },
  {
    title: "Chanel Bag",
    photos: ["/images/samples/brown-handbag.svg"],
    category: "Bags & Backpacks",
    description: "Brown Chanel bag",
    lostAt: "2026-09-06",
    campusLocation: "Waurn Ponds - LC, 22",
  },
];

function withOwner(items) {
  return items.map((item) => ({
    ...item,
    ownerId: new mongoose.Types.ObjectId(),
  }));
}

async function seed() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("MONGODB_URI is not defined.");
  }

  await mongoose.connect(uri);
  console.log("✓ Connected to MongoDB");

  const existing =
    (await LostItem.countDocuments()) + (await FoundItem.countDocuments());

  if (existing > 0) {
    console.log(`ℹ Database already has ${existing} report(s). No sample data added.`);
    return;
  }

  await FoundItem.insertMany(withOwner(sampleFoundItems));
  await LostItem.insertMany(withOwner(sampleLostItems));

  console.log(
    `✓ Added ${sampleFoundItems.length} found and ${sampleLostItems.length} lost sample reports.`,
  );
}

if (require.main === module) {
  seed()
    .catch((error) => {
      console.error("✗ Seed failed:", error.message);
      process.exitCode = 1;
    })
    .finally(() => mongoose.disconnect());
}

module.exports = { sampleFoundItems, sampleLostItems, withOwner };
