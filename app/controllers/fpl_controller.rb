class FplController < ApplicationController

    def index
    end

    def chart
      @y = params[:y] || FplApiHelper::PLAYER_ATTRIBUTES[:now_cost]
      @x = params[:x] || FplApiHelper::PLAYER_ATTRIBUTES[:total_points]
      @filter_values = params[:filters] || {}
    end

end
