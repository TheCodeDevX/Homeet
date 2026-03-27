import mongoose from "mongoose";
import dotenv from "dotenv"
dotenv.config({path : "../../.env"})

const createSearchIndex = async () => {
  try {
    const MONGO_URI = process.env.MONGO_URI
    if(!MONGO_URI) {
      console.log('mongo uri not found')
      return;
    };
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    const db = mongoose.connection.db

    await db?.command({
      createSearchIndexes: "listings",
      indexes: [
        {
          name: "listings_search_index",
          definition: {
            mappings: {
              dynamic: false,
              fields: {
                price: {
                  type: "document",
                  fields: {
                    amount_local: { type: "number" },
                    amount_usd: { type: "number" },
                    currency: { type: "string" },
                  },
                },
                description: {
                  type: "string",
                  analyzer: "lucene.standard",
                },
                location: {
                  type: "string",
                  analyzer: "lucene.standard",
                },
                title: {
                  type: "string",
                  analyzer: "lucene.standard",
                },
                pricingType: {
                  type: "string",
                  analyzer: "lucene.keyword",
                },
                amenities: {
                  type: "string",
                  analyzer: "lucene.keyword",
                },
                status: {
                  type: "string",
                  analyzer: "lucene.keyword",
                },
              },
            },
          },
        },
      ],
    });

    console.log("✅ Search index created successfully");
    process.exit(0);
  } catch (error: any) {
    // Index already exists, not a real error
    if (error.codeName === "IndexAlreadyExists") {
      console.log("⚠️  Index already exists, skipping...");
      process.exit(0);
    }
    console.error("❌ Failed to create search index:", error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
};

createSearchIndex();