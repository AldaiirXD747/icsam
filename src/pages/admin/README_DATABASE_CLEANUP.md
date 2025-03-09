
# Database Cleanup Instructions

## Background
This utility was created to address issues with matches in the database, including duplicate matches and matches with incorrect data.

## How to Use

1. **Navigate to the Database Cleanup page**
   - Go to `/admin/database-cleanup` in your browser

2. **Remove Specific Matches**
   - Click on the "Remover Partidas Específicas" button
   - This will remove all matches for the following dates:
     - 22/02/2025
     - 23/02/2025
     - 08/03/2025
   - All matches for the SUB-11 and SUB-13 categories on these dates will be removed

3. **Additional Operations**

If needed, you can also run these other maintenance operations:

- **Remove Duplicate Matches** - Keeps the oldest record for each unique combination of home team, away team, category, and date
- **Update Match Dates** - Applies the date correction rules to all matches in the database
- **Execute Full Cleanup** - Runs both duplicate removal and date correction in sequence

## Correction Rules for Dates
- 21/02/2025 → 22/02/2025
- 22/02/2025 → 23/02/2025
- 07/03/2025 → 08/03/2025
- 08/03/2025 → 09/03/2025

## After Cleanup
After removing the specified matches, you should:

1. Go to the Matches page to verify that the old matches were successfully removed
2. Re-add the matches with correct information if needed
3. Check that the standings have been recalculated correctly

This utility ensures that we maintain data integrity by removing incorrect match records while preserving all other data in the system.
