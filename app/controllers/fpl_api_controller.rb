class FplApiController < ApplicationController

    def players
      json = parse_players_table_data(get_data(FplApiHelper::PLAYERS_URL))
      return render(json: json)
    end


    def team
      id = params[:id].to_s
      json = parse_team_data(get_data(FplApiHelper::TEAM_URL.gsub(/__id__/, id)))

      return render(json: json)
    end


    def gameweek_history
      id = params[:id].to_s
      json = parse_team_data(get_data(FplApiHelper::GW_HISTORY_URL.gsub(/__id__/, id)))

     return render(json: json)
    end


    def chart
      type = params[:type] || 'ppg'
      json =  parse_players_chart_data(get_data(FplApiHelper::PLAYERS_URL), FplApiHelper::CHART_TYPES[type.to_sym])

      return render(json: json)
    end


    private


    def get_data(path)
      url = URI(path)
      JSON.parse(Net::HTTP.get(url))
    end


    def parse_players_chart_data(response, variable)
      players = []

      response.each do |r|
        if r[variable].to_f > 0.0
          p = {
            label: r['web_name'],
            data: [{
              x: r[variable].to_f,
              y: (r['now_cost'] / 10.0).to_f,
              r: 5
            }]
          }

          players << p
        end
      end
      
      players
    end


    def parse_players_table_data(response)
      players = []

      response.each do |r|
        status = (r['status'] == 'd' ? "#{r['chance_of_playing_next_round']}%" :  FplApiHelper::STATUSES[r['status']])

        p = {
          name: r['web_name'],
          team: FplApiHelper::TEAMS[r['team']],
          position: FplApiHelper::POSITIONS[r['element_type']],
          status: status,
          cost: (r['now_cost'] / 10.0).to_s,
          points: r['total_points'],
          value: r['value_season'],
          ppg: r['points_per_game']
        }

        p[:ppgm] = ((p[:ppg].to_f / p[:cost].to_f).round(1)).to_s

        players << p
      end
      
      players
    end


    def parse_team_data(response)
      response['entry']
    end

end
