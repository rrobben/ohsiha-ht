class FplApiController < ApplicationController

    def players
      json = parse_players_table_data(get_data(FplApiHelper::PLAYERS_URL))
      return render(json: json)
    end


    def player
      id = params[:id].to_s
      json = parse_player_data(get_data(FplApiHelper::PLAYERS_URL), id)
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
      y = params[:y] || FplApiHelper::PLAYER_ATTRIBUTES[:now_cost]
      x = params[:x] || FplApiHelper::PLAYER_ATTRIBUTES[:total_points]
      filters = params[:filters] || {}
      json =  parse_players_chart_data(get_data(FplApiHelper::PLAYERS_URL), x, y, filters)
      return render(json: json)
    end


    private


    def get_data(path)
      url = URI(path)
      JSON.parse(Net::HTTP.get(url))
    end


    def parse_player_data(response, id)
      response.each do |r|
        if id == r[FplApiHelper::PLAYER_ATTRIBUTES[:id]].to_s
          return parse_player_attributes(r)
        end
      end
    end


    def parse_players_chart_data(response, x, y, filters)
      players = []
      x_matches = (x == FplApiHelper::PLAYER_ATTRIBUTES[:matches] ? true : false)
      x_price = (x == FplApiHelper::PLAYER_ATTRIBUTES[:now_cost] ? true : false)
      y_matches = (y == FplApiHelper::PLAYER_ATTRIBUTES[:matches] ? true : false)
      y_price = (y == FplApiHelper::PLAYER_ATTRIBUTES[:now_cost] ? true : false)

      x = FplApiHelper::PLAYER_ATTRIBUTES[:points_per_game] if x == FplApiHelper::PLAYER_ATTRIBUTES[:matches]
      y = FplApiHelper::PLAYER_ATTRIBUTES[:points_per_game] if y == FplApiHelper::PLAYER_ATTRIBUTES[:matches]
      

      response.each do |r|
        if r[x].to_f > 0.0 && r[y].to_f > 0.0
          selected = true

          filters.each do |filter, value|
            unless value.include?(r[filter].to_s)
              selected = false
              break
            end
          end

          next unless selected

          x_value = r[x].to_f
          y_value = r[y].to_f

          if x_matches
            x_value = (r[FplApiHelper::PLAYER_ATTRIBUTES[:total_points]].to_f / r[x].to_f).round
          elsif x_price
            x_value /= 10
          end

          if y_matches
            y_value = (r[FplApiHelper::PLAYER_ATTRIBUTES[:total_points]].to_f / r[y].to_f).round
          elsif y_price
            y_value /= 10
          end

          p = {
            label: r[FplApiHelper::PLAYER_ATTRIBUTES[:web_name]],
            data: [{
              x: x_value,
              y: y_value,
              r: 5
            }],
            backgroundColor: FplApiHelper::TEAM_COLORS[r[FplApiHelper::PLAYER_ATTRIBUTES[:team]]][:bg],
            borderColor: FplApiHelper::TEAM_COLORS[r[FplApiHelper::PLAYER_ATTRIBUTES[:team]]][:border],
            hoverBackgroundColor: FplApiHelper::TEAM_COLORS[r[FplApiHelper::PLAYER_ATTRIBUTES[:team]]][:bg],
            hoverBorderColor: FplApiHelper::TEAM_COLORS[r[FplApiHelper::PLAYER_ATTRIBUTES[:team]]][:border],
            borderWidth: 2,
            hoverBorderWidth: 3
          }

          players << p
        end
      end
      
      players
    end


    def parse_players_table_data(response)
      players = []

      response.each do |r|
        players << parse_player_attributes(r)
      end
      
      players
    end


    def parse_player_attributes(r)
      status = (r[FplApiHelper::PLAYER_ATTRIBUTES[:status]] == 'd' ? "#{r[FplApiHelper::PLAYER_ATTRIBUTES[:chance_of_playing_next_round]]}%" :  FplApiHelper::STATUSES[r[FplApiHelper::PLAYER_ATTRIBUTES[:status]]])

      p = {
        id: r[FplApiHelper::PLAYER_ATTRIBUTES[:id]],
        name: r[FplApiHelper::PLAYER_ATTRIBUTES[:web_name]],
        team: FplApiHelper::TEAMS[r[FplApiHelper::PLAYER_ATTRIBUTES[:team]]],
        position: FplApiHelper::POSITIONS[r[FplApiHelper::PLAYER_ATTRIBUTES[:element_type]]],
        status: status,
        cost: (r[FplApiHelper::PLAYER_ATTRIBUTES[:now_cost]] / 10.0).to_s,
        points: r[FplApiHelper::PLAYER_ATTRIBUTES[:total_points]],
        value: r[FplApiHelper::PLAYER_ATTRIBUTES[:value_season]],
        ppg: r[FplApiHelper::PLAYER_ATTRIBUTES[:points_per_game]]
      }

      p[:ppgm] = ((p[:ppg].to_f / p[:cost].to_f).round(1)).to_s

      return p
    end


    def parse_team_data(response)
      response['entry']
    end

end
