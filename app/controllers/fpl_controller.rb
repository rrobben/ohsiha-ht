class FplController < ApplicationController

    def index
    end


    def team
      id = params[:id].to_s
      url = URI('https://fantasy.premierleague.com/drf/entry/' + id)
      response = JSON.parse(Net::HTTP.get(url))

      @result = parse_team_data(response)

      return render(json: @result)
    end


    private


    def parse_team_data(response)
      puts response['entry'].keys
      response['entry']
    end

end
