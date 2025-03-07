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
      app_users: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string
          password_hash: string
          role: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          name: string
          password_hash: string
          role: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string
          password_hash?: string
          role?: string
        }
        Relationships: []
      }
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
      gallery_images: {
        Row: {
          championship_id: string | null
          created_at: string
          description: string | null
          featured: boolean | null
          id: string
          image_url: string
          title: string
        }
        Insert: {
          championship_id?: string | null
          created_at?: string
          description?: string | null
          featured?: boolean | null
          id?: string
          image_url: string
          title: string
        }
        Update: {
          championship_id?: string | null
          created_at?: string
          description?: string | null
          featured?: boolean | null
          id?: string
          image_url?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_championship"
            columns: ["championship_id"]
            isOneToOne: false
            referencedRelation: "championships"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gallery_images_championship_id_fkey"
            columns: ["championship_id"]
            isOneToOne: false
            referencedRelation: "championships"
            referencedColumns: ["id"]
          },
        ]
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
      match_statistics: {
        Row: {
          created_at: string
          half: string | null
          id: string
          match_id: string
          minute: number | null
          player_id: string
          quantity: number
          statistic_type: string
          team_id: string
        }
        Insert: {
          created_at?: string
          half?: string | null
          id?: string
          match_id: string
          minute?: number | null
          player_id: string
          quantity?: number
          statistic_type: string
          team_id: string
        }
        Update: {
          created_at?: string
          half?: string | null
          id?: string
          match_id?: string
          minute?: number | null
          player_id?: string
          quantity?: number
          statistic_type?: string
          team_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "match_statistics_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "match_statistics_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "match_statistics_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
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
          category: string | null
          created_at: string
          id: string
          name: string
          number: number | null
          photo: string | null
          position: string
          team_id: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          id?: string
          name: string
          number?: number | null
          photo?: string | null
          position: string
          team_id?: string | null
        }
        Update: {
          category?: string | null
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
      standings: {
        Row: {
          category: string
          created_at: string
          drawn: number
          goal_difference: number
          goals_against: number
          goals_for: number
          group_name: string
          id: string
          lost: number
          played: number
          points: number
          position: number
          team_id: string | null
          updated_at: string
          won: number
        }
        Insert: {
          category: string
          created_at?: string
          drawn?: number
          goal_difference?: number
          goals_against?: number
          goals_for?: number
          group_name: string
          id?: string
          lost?: number
          played?: number
          points?: number
          position?: number
          team_id?: string | null
          updated_at?: string
          won?: number
        }
        Update: {
          category?: string
          created_at?: string
          drawn?: number
          goal_difference?: number
          goals_against?: number
          goals_for?: number
          group_name?: string
          id?: string
          lost?: number
          played?: number
          points?: number
          position?: number
          team_id?: string | null
          updated_at?: string
          won?: number
        }
        Relationships: [
          {
            foreignKeyName: "standings_team_id_fkey"
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
      user_team_associations: {
        Row: {
          created_at: string
          id: string
          team_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          team_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          team_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_team_associations_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_team_associations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "app_users"
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
      add_category_to_players: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      create_standings_table: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      create_user: {
        Args: {
          p_name: string
          p_email: string
          p_password: string
          p_role: string
        }
        Returns: string
      }
      generate_password_hash: {
        Args: {
          password: string
        }
        Returns: string
      }
      get_matches_with_teams_and_players: {
        Args: {
          p_match_status?: string[]
        }
        Returns: {
          match_id: string
          match_date: string
          match_time: string
          match_location: string
          match_category: string
          match_status: string
          match_round: string
          home_team_id: string
          home_team_name: string
          away_team_id: string
          away_team_name: string
          home_players: Json
          away_players: Json
        }[]
      }
      get_standing: {
        Args: {
          p_team_id: string
          p_category: string
          p_group_name: string
        }
        Returns: {
          category: string
          created_at: string
          drawn: number
          goal_difference: number
          goals_against: number
          goals_for: number
          group_name: string
          id: string
          lost: number
          played: number
          points: number
          position: number
          team_id: string | null
          updated_at: string
          won: number
        }[]
      }
      get_standings: {
        Args: {
          p_category: string
          p_group_name: string
        }
        Returns: {
          category: string
          created_at: string
          drawn: number
          goal_difference: number
          goals_against: number
          goals_for: number
          group_name: string
          id: string
          lost: number
          played: number
          points: number
          position: number
          team_id: string | null
          updated_at: string
          won: number
        }[]
      }
      get_standings_table_exists: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      insert_standing: {
        Args: {
          p_team_id: string
          p_category: string
          p_group_name: string
          p_position: number
          p_points: number
          p_played: number
          p_won: number
          p_drawn: number
          p_lost: number
          p_goals_for: number
          p_goals_against: number
          p_goal_difference: number
        }
        Returns: string
      }
      recalculate_standings: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      update_standing: {
        Args: {
          p_team_id: string
          p_category: string
          p_group_name: string
          p_position: number
          p_points: number
          p_played: number
          p_won: number
          p_drawn: number
          p_lost: number
          p_goals_for: number
          p_goals_against: number
          p_goal_difference: number
        }
        Returns: undefined
      }
      verify_user_credentials: {
        Args: {
          p_email: string
          p_password: string
        }
        Returns: {
          id: string
          name: string
          email: string
          role: string
        }[]
      }
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
