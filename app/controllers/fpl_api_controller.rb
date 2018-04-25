class FplApiController < ApplicationController

    def players
      watchlist = params[:watchlist] == 'true' || false
      json = parse_players_table_data(get_data(FplApiHelper::PLAYERS_URL), watchlist)
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
      fp = FollowedPlayer.where(user_id: logged_user_id)

      response.each do |r|
        if id == r[FplApiHelper::PLAYER_ATTRIBUTES[:id]].to_s
          return parse_player_attributes(r, fp)
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
            if value.respond_to?('keys')
              player_value = (filter == FplApiHelper::PLAYER_ATTRIBUTES[:now_cost] ? r[filter].to_f / 10 : r[filter].to_f)

              value.each do |k,v|
                if k == 'min'
                  selected = false if player_value < v.to_f
                else
                  selected = false if player_value > v.to_f
                end
              end
            else
              player_value = r[filter].to_s

              if filter == FplApiHelper::PLAYER_ATTRIBUTES[:status]
                player_value = (r[FplApiHelper::PLAYER_ATTRIBUTES[:status]] == 'd' ? "d#{r[FplApiHelper::PLAYER_ATTRIBUTES[:chance_of_playing_next_round]]}" :  r[FplApiHelper::PLAYER_ATTRIBUTES[:status]])
              end

              unless value.include?(player_value)
                selected = false
                break
              end
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


    def parse_players_table_data(response, watchlist)
      players = []
      fp = FollowedPlayer.where(user_id: logged_user_id)

      response.each do |r|
        players << parse_player_attributes(r)
      end

      if watchlist
        players = players.select{ |p| fp.exists?(player_id: p[:id])}
      end
      
      players
    end


    def parse_player_attributes(r, watchlist = nil)
      status = (r[FplApiHelper::PLAYER_ATTRIBUTES[:status]] == 'd' ? "#{r[FplApiHelper::PLAYER_ATTRIBUTES[:chance_of_playing_next_round]]}%" :  FplApiHelper::STATUSES[r[FplApiHelper::PLAYER_ATTRIBUTES[:status]]])

      p = {
        team: FplApiHelper::TEAMS[r[FplApiHelper::PLAYER_ATTRIBUTES[:team]]],
        position: FplApiHelper::POSITIONS[r[FplApiHelper::PLAYER_ATTRIBUTES[:element_type]]],
        status: status,
        cost: (r[FplApiHelper::PLAYER_ATTRIBUTES[:now_cost]] / 10.0).to_s,
        watchlist: (watchlist ? watchlist.exists?(player_id: r[FplApiHelper::PLAYER_ATTRIBUTES[:id]]) : watchlist)
      }

      FplApiHelper::PLAYER_ATTRIBUTES.each do |k,v|
        next if [:status, :now_cost, :team, :element_type, :matches].include?(k)
        p[k] = r[v]
      end

      p[:ppgm] = ((p[:points_per_game].to_f / p[:cost].to_f).round(1)).to_s
      if p[:points_per_game].to_f == 0.0
        p[:matches] = 0
      else
        p[:matches] = (p[:total_points].to_f / p[:points_per_game].to_f).round
      end

      return p
    end


    def parse_team_data(response)
      response['entry']
    end

end
