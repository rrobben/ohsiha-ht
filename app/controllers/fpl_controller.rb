class FplController < ApplicationController

    def index
    end

    def chart
      @type = params[:type] || 'ppg'
    end

end
