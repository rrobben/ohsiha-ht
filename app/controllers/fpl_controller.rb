class FplController < ApplicationController

    def index
    end

    def chart
      @y = params[:y] || FplApiHelper::PLAYER_ATTRIBUTES[:now_cost]
      @x = params[:x] || FplApiHelper::PLAYER_ATTRIBUTES[:total_points]
      @filter_values = params[:filters] || {}
    end


    def watchlist
      render(action: 'index')
    end


    def toggle_watchlist
      player_id = params[:player][:id]
      result = {text: 'ok'}

      if FollowedPlayer.exists?(player_id: player_id, user_id: logged_user_id)
        FollowedPlayer.where(player_id: player_id, user_id: logged_user_id).destroy_all
      else
        FollowedPlayer.create({player_id: player_id, user_id: logged_user_id})
      end

      return render(json: result)
    end

end
