
import { cleanMatchesOnly } from './dataMigration';

// This file is used to execute the data cleanup when the app loads
// It's a workaround to trigger the cleanup without user interaction
export const executeDataCleanup = async () => {
  console.log("Executing automatic data cleanup...");
  try {
    const result = await cleanMatchesOnly();
    console.log("Cleanup result:", result);
    return result;
  } catch (error) {
    console.error("Error during automatic cleanup:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
};

// Execute cleanup immediately
executeDataCleanup();
