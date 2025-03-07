
import { Team, User, Match, TopScorer, YellowCardLeader } from "@/types";
import { Database } from "@/integrations/supabase/types";

/**
 * Converts a database team record to the Team interface used in the application
 */
export const convertDbTeamToTeam = (
  dbTeam: Database["public"]["Tables"]["teams"]["Row"]
): Team => {
  return {
    id: dbTeam.id,
    name: dbTeam.name,
    description: undefined,
    logoUrl: dbTeam.logo || undefined,
    logo: dbTeam.logo || undefined,
    category: dbTeam.category,
    group_name: dbTeam.group_name,
    active: true,
    // These fields might be added to the database in the future
    websiteUrl: undefined,
    email: undefined,
    phone: undefined,
    address: undefined,
    city: undefined,
    state: undefined,
    country: undefined,
    foundationDate: undefined
  };
};

/**
 * Converts a database match record to the Match interface used in the application
 */
export const convertDbMatchToMatch = (
  dbMatch: Database["public"]["Tables"]["matches"]["Row"]
): Match => {
  return {
    id: dbMatch.id,
    date: dbMatch.date,
    time: dbMatch.time,
    location: dbMatch.location,
    home_team: dbMatch.home_team || "",
    away_team: dbMatch.away_team || "",
    home_score: dbMatch.home_score,
    away_score: dbMatch.away_score,
    status: dbMatch.status as Match["status"],
    category: dbMatch.category,
    round: dbMatch.round,
    championship_id: dbMatch.championship_id
  };
};

/**
 * Type-safe utility for handling null values
 */
export const nonNull = <T>(value: T | null | undefined, defaultValue: T): T => {
  return value !== null && value !== undefined ? value : defaultValue;
};
