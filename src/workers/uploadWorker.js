import { workerData, parentPort } from "worker_threads";
import xlsx from "xlsx";
import connectToDB from "../utils/db.js";
import fs from "fs";

async function uploadData(filePath) {
  try {
    const workbook = xlsx.readFile(filePath);
    const sheetNameList = workbook.SheetNames;

    const agentData = xlsx.utils.sheet_to_json(
      workbook.Sheets[sheetNameList[0]]
    );
    const userData = xlsx.utils.sheet_to_json(
      workbook.Sheets[sheetNameList[1]]
    );
    const accountData = xlsx.utils.sheet_to_json(
      workbook.Sheets[sheetNameList[2]]
    );
    const lobData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetNameList[3]]);
    const carrierData = xlsx.utils.sheet_to_json(
      workbook.Sheets[sheetNameList[4]]
    );
    const policyData = xlsx.utils.sheet_to_json(
      workbook.Sheets[sheetNameList[5]]
    );

    const db = await connectToDB();
    if (!db) {
      throw new Error("Database connection failed");
    }
    console.log("Database connection established");

    if (agentData.length > 0) {
      console.log("Inserting agent data:", agentData);
      await db.collection("agents").insertMany(agentData);
    }
    if (userData.length > 0) {
      console.log("Inserting user data:", userData);
      await db.collection("users").insertMany(userData);
    }
    if (accountData.length > 0) {
      console.log("Inserting user account data:", accountData);
      await db.collection("user_accounts").insertMany(accountData);
    }
    if (lobData.length > 0) {
      console.log("Inserting LOB data:", lobData);
      await db.collection("policy_categories").insertMany(lobData);
    }
    if (carrierData.length > 0) {
      console.log("Inserting carrier data:", carrierData);
      await db.collection("policy_carriers").insertMany(carrierData);
    }
    if (policyData.length > 0) {
      console.log("Inserting policy data:", policyData);
      await db.collection("policy_info").insertMany(policyData);
    }

    fs.unlinkSync(filePath); // Remove the file after processing

    parentPort.postMessage({ message: "Data uploaded successfully" });
  } catch (error) {
    console.log(error);
    parentPort.postMessage({ error: error.message });
  }
}

uploadData(workerData.filePath);
