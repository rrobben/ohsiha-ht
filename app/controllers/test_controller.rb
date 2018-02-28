class TestController < ApplicationController
    
    def index
        @test = Test.new()
        @tests = Test.all
        return render
    end

    def create
        puts params[:test]
        @test = Test.new(params[:test].permit(:role_ids))
        @test.save

        @test.name = params[:test]
        @test.save

        return redirect_to index_url
    end
end