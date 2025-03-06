
import { supabase } from "@/integrations/supabase/client";

export interface YellowCard {
  id: string;
  name: string;
  cartões: number;
  time: string;
}

// Fetch all yellow cards from the database
export const getAllYellowCards = async (): Promise<YellowCard[]> => {
  try {
    const { data, error } = await supabase
      .from('yellow_card_leaders')
      .select(`
        id,
        players(name),
        yellow_cards,
        teams(name)
      `)
      .order('yellow_cards', { ascending: false });
    
    if (error) throw error;
    
    // Transform the data to match the YellowCard interface
    return (data || []).map(leader => ({
      id: leader.id,
      name: leader.players?.name || 'Desconhecido',
      cartões: leader.yellow_cards,
      time: leader.teams?.name || 'Time desconhecido'
    }));
  } catch (error) {
    console.error('Error fetching yellow card leaders:', error);
    return [];
  }
};
