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

end
