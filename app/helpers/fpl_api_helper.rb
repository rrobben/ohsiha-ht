module FplApiHelper

    FPL_URL = 'https://fantasy.premierleague.com/drf/'
    PLAYERS_PATH = 'elements/'
    PLAYER_PATH = 'element-summary/__id__/'
    TEAM_PATH = 'entry/__id__/'
    GW_HISTORY_PATH = 'history/'

    PLAYERS_URL = FPL_URL + PLAYERS_PATH
    PLAYER_URL = FPL_URL + PLAYER_PATH
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
        'a' => '100%',
        'd75' => '75%',
        'd50'=> '50%',
        'd25' => '25%'
    }

    CHART_TYPES = {
        ppg: 'points_per_game',
        total: 'total_points'
    }

    TEAM_COLORS = {
        1 => {bg: '#e03537', border: '#ffffff'},
        2 => {bg: '#e03537', border: '#373737'},
        3 => {bg: '#ffffff', border: '#004cc1'},
        4 => {bg: '#4ac6e8', border: '#a82424'},
        5 => {bg: '#2f58ba', border: '#2f58ba'},
        6 => {bg: '#2f58ba', border: '#e03537'},
        7 => {bg: '#253b71', border: '#2f58ba'},
        8 => {bg: '#ffffff', border: '#01b3ed'},
        9 => {bg: '#2f58ba', border: '#ffffff'},
        10 => {bg: '#b82f23', border: '#e03537'},
        11 => {bg: '#4ac6e8', border: '#ffffff'},
        12 => {bg: '#b82f23', border: '#ffffff'},
        13 => {bg: '#ffffff', border: '#373737'},
        14 => {bg: '#ffffff', border: '#b82f23'},
        15 => {bg: '#ffffff', border: '#e03537'},
        16 => {bg: '#ffffff', border: '#d8c47c'},
        17 => {bg: '#ffffff', border: '#cfcfd2'},
        18 => {bg: '#fcdf22', border: '#373737'},
        19 => {bg: '#ffffff', border: '#42588d'},
        20 => {bg: '#a82424', border: '#4ac6e8'}
    }

end