export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      championships: {
        Row: {
          banner_image: string | null
          categories: Json | null
          created_at: string
          description: string | null
          end_date: string
          id: string
          location: string
          name: string
          organizer: string | null
          sponsors: Json | null
          start_date: string
          status: string | null
          year: string
        }
        Insert: {
          banner_image?: string | null
          categories?: Json | null
          created_at?: string
          description?: string | null
          end_date: string
          id?: string
          location: string
          name: string
          organizer?: string | null
          sponsors?: Json | null
          start_date: string
          status?: string | null
          year: string
        }
        Update: {
          banner_image?: string | null
          categories?: Json | null
          created_at?: string
          description?: string | null
          end_date?: string
          id?: string
          location?: string
          name?: string
          organizer?: string | null
          sponsors?: Json | null
          start_date?: string
          status?: string | null
          year?: string
        }
        Relationships: []
      }
      goals: {
        Row: {
          created_at: string
          half: string | null
          id: string
          match_id: string | null
          minute: number | null
          player_id: string | null
          team_id: string | null
        }
        Insert: {
          created_at?: string
          half?: string | null
          id?: string
          match_id?: string | null
          minute?: number | null
          player_id?: string | null
          team_id?: string | null
        }
        Update: {
          created_at?: string
          half?: string | null
          id?: string
          match_id?: string | null
          minute?: number | null
          player_id?: string | null
          team_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "goals_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "goals_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "goals_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      match_events: {
        Row: {
          created_at: string
          details: Json | null
          event_type: string
          half: string | null
          id: string
          match_id: string | null
          minute: number | null
          player_id: string | null
        }
        Insert: {
          created_at?: string
          details?: Json | null
          event_type: string
          half?: string | null
          id?: string
          match_id?: string | null
          minute?: number | null
          player_id?: string | null
        }
        Update: {
          created_at?: string
          details?: Json | null
          event_type?: string
          half?: string | null
          id?: string
          match_id?: string | null
          minute?: number | null
          player_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "match_events_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "match_events_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
        ]
      }
      matches: {
        Row: {
          away_score: number | null
          away_team: string | null
          category: string
          championship_id: string | null
          created_at: string
          date: string
          home_score: number | null
          home_team: string | null
          id: string
          location: string
          round: string | null
          status: string
          time: string
        }
        Insert: {
          away_score?: number | null
          away_team?: string | null
          category: string
          championship_id?: string | null
          created_at?: string
          date: string
          home_score?: number | null
          home_team?: string | null
          id?: string
          location: string
          round?: string | null
          status?: string
          time: string
        }
        Update: {
          away_score?: number | null
          away_team?: string | null
          category?: string
          championship_id?: string | null
          created_at?: string
          date?: string
          home_score?: number | null
          home_team?: string | null
          id?: string
          location?: string
          round?: string | null
          status?: string
          time?: string
        }
        Relationships: [
          {
            foreignKeyName: "matches_away_team_fkey"
            columns: ["away_team"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_home_team_fkey"
            columns: ["home_team"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      players: {
        Row: {
          created_at: string
          id: string
          name: string
          number: number | null
          photo: string | null
          position: string
          team_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          number?: number | null
          photo?: string | null
          position: string
          team_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          number?: number | null
          photo?: string | null
          position?: string
          team_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "players_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      team_accounts: {
        Row: {
          created_at: string
          email: string
          id: string
          team_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          team_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          team_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "team_accounts_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      teams: {
        Row: {
          category: string
          created_at: string
          group_name: string
          id: string
          logo: string | null
          name: string
        }
        Insert: {
          category: string
          created_at?: string
          group_name: string
          id?: string
          logo?: string | null
          name: string
        }
        Update: {
          category?: string
          created_at?: string
          group_name?: string
          id?: string
          logo?: string | null
          name?: string
        }
        Relationships: []
      }
      top_scorers: {
        Row: {
          category: string
          championship_id: string | null
          created_at: string
          goals: number
          id: string
          player_id: string | null
          team_id: string | null
        }
        Insert: {
          category: string
          championship_id?: string | null
          created_at?: string
          goals?: number
          id?: string
          player_id?: string | null
          team_id?: string | null
        }
        Update: {
          category?: string
          championship_id?: string | null
          created_at?: string
          goals?: number
          id?: string
          player_id?: string | null
          team_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "top_scorers_championship_id_fkey"
            columns: ["championship_id"]
            isOneToOne: false
            referencedRelation: "championships"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "top_scorers_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "top_scorers_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      yellow_card_leaders: {
        Row: {
          category: string
          championship_id: string | null
          created_at: string
          id: string
          player_id: string | null
          team_id: string | null
          yellow_cards: number
        }
        Insert: {
          category: string
          championship_id?: string | null
          created_at?: string
          id?: string
          player_id?: string | null
          team_id?: string | null
          yellow_cards?: number
        }
        Update: {
          category?: string
          championship_id?: string | null
          created_at?: string
          id?: string
          player_id?: string | null
          team_id?: string | null
          yellow_cards?: number
        }
        Relationships: [
          {
            foreignKeyName: "yellow_card_leaders_championship_id_fkey"
            columns: ["championship_id"]
            isOneToOne: false
            referencedRelation: "championships"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "yellow_card_leaders_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "yellow_card_leaders_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
