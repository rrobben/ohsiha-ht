module FplHelper

    PLAYER_TABLE_COLUMNS = [
        nil,
        'name',
        'team',
        'position',
        'status',
        'cost',
        'points',
        'value_season',
        'ppg',
        'ppgm'
    ]

    PLAYER_CHART_AXIS_OPTIONS = {
        total_points: 'total_score',
        event_points: 'round_score',
        now_cost: 'price',
        selected_by_percent: 'teams_selected_by',
        matches: 'matches_played',
        minutes: 'minutes_played',
        goals_scored: 'goals_scored',
        assists: 'assists',
        clean_sheets: 'clean_sheets',
        goals_conceded: 'goals_conceded',
        own_goals: 'own_goals',
        penalties_saved: 'penalties_saved',
        penalties_missed: 'penalties_missed',
        yellow_cards: 'yellow_cards',
        red_cards: 'red_cards',
        saves: 'saves',
        bonus: 'bonus',
        bps: 'bonus_points_system',
        influence: 'influence',
        creativity: 'creativity',
        threat: 'threat',
        ict_index: 'ict_index',
        form: 'form',
        dreamteam_count: 'times_in_dream_team',
        value_form: 'value_form',
        value_season: 'value_season',
        points_per_game: 'points_per_match'
    }

end
