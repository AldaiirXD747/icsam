
# Database Cleanup Instructions

## Background
This utility was created to address the issue of duplicate matches in the database. When match results were being updated, new records were being created instead of updating existing ones.

## How to Use

1. **Navigate to the Database Cleanup page**
   - Go to `/admin/database-cleanup` in your browser

2. **Run the Full Cleanup process**
   - Click on the "Executar Limpeza Completa" button
   - This will:
     - Identify and remove duplicate matches (keeping the oldest records)
     - Update the dates according to the correction rules
     - Recalculate the standings

3. **Verify the Results**
   - After the cleanup is complete, check the Results section at the bottom of the page
   - Confirm that duplicates were removed successfully
   - Check the Matches page to verify that only one instance of each match is displayed with correct dates and scores

## Individual Operations

If needed, you can also run the individual operations:

- **Remove Duplicate Matches** - Keeps the oldest record for each unique combination of home team, away team, category, and date
- **Update Match Dates** - Applies the date correction rules to all matches in the database

## Correction Rules for Dates
- 21/02/2025 → 22/02/2025
- 22/02/2025 → 23/02/2025
- 07/03/2025 → 08/03/2025
- 08/03/2025 → 09/03/2025

This utility ensures that we maintain data integrity by preserving the original match records while ensuring all information is up to date.
