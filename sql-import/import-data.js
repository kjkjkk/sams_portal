// Import script - Run this with: node import-data.js
// This imports your SQL database into Appwrite

require("dotenv").config();
const { Client, Databases, ID } = require("node-appwrite");
const mysql = require("mysql2/promise");

// Appwrite configuration from .env
const client = new Client()
  .setEndpoint(process.env.APPWRITE_ENDPOINT)
  .setProject(process.env.APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY);

const databases = new Databases(client);

// Your MySQL configuration from .env
const mysqlConfig = {
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT || 3306,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD || "",
  database: process.env.MYSQL_DATABASE,
};

// Function to import a single table
async function importTable(tableName, collectionId) {
  let connection;

  try {
    console.log(`\n📦 Connecting to MySQL...`);
    connection = await mysql.createConnection(mysqlConfig);
    console.log(`✅ Connected to MySQL`);

    console.log(`\n📦 Starting import of ${tableName}...`);

    // Get all data from MySQL table
    const [rows] = await connection.execute(`SELECT * FROM ${tableName}`);

    console.log(`Found ${rows.length} records to import`);

    let successCount = 0;
    let errorCount = 0;

    // Import each row to Appwrite
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];

      try {
        // Convert the row data
        const documentData = {};

        // Convert each field, handling special types
        for (const [key, value] of Object.entries(row)) {
          // Skip the MySQL 'id' field if it exists
          if (key === "id") continue;

          // Convert dates to ISO strings
          if (value instanceof Date) {
            documentData[key] = value.toISOString();
          } else {
            documentData[key] = value;
          }
        }

        // Create document in Appwrite
        await databases.createDocument(
          "notes-app-db",
          collectionId,
          ID.unique(), // Generate new ID
          documentData
        );

        successCount++;

        // Progress update every 10 records
        if ((i + 1) % 10 === 0) {
          console.log(
            `Progress: ${i + 1}/${
              rows.length
            } (${successCount} successful, ${errorCount} errors)`
          );
        }
      } catch (error) {
        errorCount++;
        console.error(`❌ Error importing row ${i + 1}:`, error.message);
      }
    }

    console.log(
      `\n✅ Completed ${tableName}: ${successCount} successful, ${errorCount} errors`
    );
  } catch (error) {
    console.error(`❌ Failed to import ${tableName}:`);
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);
    console.error("Error code:", error.code);
    if (error.response) {
      console.error("Response:", error.response);
    }
    throw error;
  } finally {
    if (connection) {
      await connection.end();
      console.log("MySQL connection closed");
    }
  }
}

// Main import function
async function importAllTables() {
  console.log("🚀 Starting database import...\n");

  // Validate configuration
  console.log("Checking configuration...");
  console.log("Appwrite Endpoint:", process.env.APPWRITE_ENDPOINT);
  console.log("Appwrite Project:", process.env.APPWRITE_PROJECT_ID);
  console.log("Database ID:", process.env.APPWRITE_DB_ID);
  console.log("API Key exists:", !!process.env.APPWRITE_API_KEY);
  console.log("API Key length:", process.env.APPWRITE_API_KEY?.length);
  console.log("MySQL Host:", process.env.MYSQL_HOST);
  console.log("MySQL User:", process.env.MYSQL_USER);
  console.log("MySQL Database:", process.env.MYSQL_DATABASE);
  console.log("");

  if (!process.env.APPWRITE_API_KEY) {
    console.error("❌ APPWRITE_API_KEY is missing from .env file!");
    return;
  }

  try {
    // Import each table - add your tables here
    // Format: await importTable('sql_table_name', 'appwrite_collection_id');

    await importTable("samps_pt", "samps_pt");

    // Add more tables as needed:
    // await importTable('courses', 'courses_collection_id');
    // await importTable('students', 'students_collection_id');
    // await importTable('grades', 'grades_collection_id');

    console.log("\n🎉 All imports completed!");
  } catch (error) {
    console.error("\n❌ Import failed!");
    console.error("Error type:", error.constructor.name);
    console.error("Error message:", error.message);
    if (error.stack) {
      console.error("Stack trace:", error.stack);
    }
  }
}

// Run the import
importAllTables();
