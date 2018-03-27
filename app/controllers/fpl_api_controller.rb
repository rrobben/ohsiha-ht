class FplApiController < ApplicationController
    
    def team
      id = params[:id].to_s
      url = URI("https://fantasy.premierleague.com/drf/entry/#{id}")
      response = JSON.parse(Net::HTTP.get(url))

      @result = parse_team_data(response)

      return render(json: @result)
    end


    def players
      url = URI('https://fantasy.premierleague.com/drf/elements/')
      response = JSON.parse(Net::HTTP.get(url))

      @result = parse_player_data(response)

      return render(json: @result)
    end


    def gameweek_history
      id = params[:id].to_s
      url = URI("https://fantasy.premierleague.com/drf/entry/#{id}/history")
      response = JSON.parse(Net::HTTP.get(url))

      @result = parse_team_data(response)

      return render(json: @result)
    end


    private


    def parse_team_data(response)
      puts response['entry'].keys
      response['entry']
    end

    def parse_player_data(response)
      puts response.first.keys
      players = []

      response.each do |r|
        p = {
          name: r['web_name'],
          team: FplApiHelper::TEAMS[r['team']],
          position: FplApiHelper::POSITIONS[r['element_type']],
          status: r['status'],
          cost: r['now_cost'] / 10.0,
          points: r['total_points'],
          ppg: r['points_per_game']
        }

        players << p
      end
      
      players.to_json
    end

end
