
import { ChampionshipMatch } from '@/types/championship';

export const getAllMatches = async (): Promise<ChampionshipMatch[]> => {
  try {
    // In a real implementation, this would make an API call
    // For now, we'll return a mock response
    return [];
  } catch (error) {
    console.error("Error fetching matches:", error);
    throw error;
  }
};
