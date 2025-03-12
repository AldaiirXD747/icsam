import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

/**
 * This utility script helps manage data between public and admin interfaces
 */

interface DataUpdateResponse {
  success: boolean;
  error: string;
  updates: any[];
}

// Generic function to update data in a table
const updateData = async (data: any): Promise<DataUpdateResponse> => {
  try {
    const { table, id, values } = data;

    if (!table || !id || !values) {
      console.error("Table, ID, and values are required.");
      return { success: false, error: "Table, ID, and values are required.", updates: [] };
    }

    const { data: updatedData, error } = await supabase
      .from(table)
      .update(values)
      .eq('id', id)
      .select();

    if (error) {
      console.error(`Error updating data in table ${table}:`, error);
      return { success: false, error: error.message, updates: [] };
    }

    console.log(`Data in table ${table} updated successfully!`);
    return {
      success: true,
      error: '',
      updates: [] // Add this property to match the interface
    };
  } catch (error) {
    console.error("Unexpected error during data update:", error);
    return { success: false, error: error instanceof Error ? error.message : 'Erro desconhecido', updates: [] };
  }
};

// Generic function to insert data into a table
const insertData = async (data: any): Promise<DataUpdateResponse> => {
  try {
    const { table, values } = data;

    if (!table || !values) {
      console.error("Table and values are required.");
      return { success: false, error: "Table and values are required.", updates: [] };
    }

    const { data: insertedData, error } = await supabase
      .from(table)
      .insert([values])
      .select();

    if (error) {
      console.error(`Error inserting data into table ${table}:`, error);
      return { success: false, error: error.message, updates: [] };
    }

    console.log(`Data inserted into table ${table} successfully!`);
    return { success: true, error: '', updates: [] };
  } catch (error) {
    console.error("Unexpected error during data insertion:", error);
    return { success: false, error: error instanceof Error ? error.message : 'Erro desconhecido', updates: [] };
  }
};

// Generic function to delete data from a table
const deleteData = async (data: any): Promise<DataUpdateResponse> => {
  try {
    const { table, id } = data;

    if (!table || !id) {
      console.error("Table and ID are required.");
      return { success: false, error: "Table and ID are required.", updates: [] };
    }

    const { error } = await supabase
      .from(table)
      .delete()
      .eq('id', id);

    if (error) {
      console.error(`Error deleting data from table ${table}:`, error);
      return { success: false, error: error.message, updates: [] };
    }

    console.log(`Data deleted from table ${table} successfully!`);
    return { success: true, error: '', updates: [] };
  } catch (error) {
    console.error("Unexpected error during data deletion:", error);
    return { success: false, error: error instanceof Error ? error.message : 'Erro desconhecido', updates: [] };
  }
};

export { updateData, insertData, deleteData };
