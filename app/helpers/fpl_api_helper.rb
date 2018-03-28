module FplApiHelper

    FPL_URL = 'https://fantasy.premierleague.com/drf/'
    PLAYERS_PATH = 'elements/'
    TEAM_PATH = 'entry/__id__/'
    GW_HISTORY_PATH = 'history/'

    PLAYERS_URL = FPL_URL + PLAYERS_PATH
    TEAM_URL = FPL_URL + TEAM_PATH
    GW_HISTORY_URL = TEAM_URL + GW_HISTORY_PATH


    POSITIONS = {
        1 => 'GK',
        2 => 'DEF',
        3 => 'MID',
        4 => 'FWD'
    }

    TEAMS = {
        1 => 'Arsenal',
        2 => 'Bournemouth',
        3 => 'Brighton',
        4 => 'Burnley',
        5 => 'Chelsea',
        6 => 'Crystal Palace',
        7 => 'Everton',
        8 => 'Huddersfield',
        9 => 'Leicester',
        10 => 'Liverpool',
        11 => 'Man City',
        12 => 'Man Utd',
        13 => 'Newcastle',
        14 => 'Southampton',
        15 => 'Stoke',
        16 => 'Swansea',
        17 => 'Spurs',
        18 => 'Watford',
        19 => 'West Brom',
        20 => 'West Ham'
    }

    STATUSES = {
        's' => '0% - Suspended',
        'u' => '0% - Unavailable',
        'i' => '0% - Injured',
        'n' => '0% - Unavailable',
        'a' => '100%'
    }

    CHART_TYPES = {
        ppg: 'points_per_game',
        total: 'total_points'
    }

end