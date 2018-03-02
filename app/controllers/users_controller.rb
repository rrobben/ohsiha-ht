class UsersController < ApplicationController
  def login
  end

  def logout
  end

  def new
    @user = User.new
    return render
  end

  def create
    user = User.create(user_params)
    return redirect_to login_path
  end

  def edit
    @user = User.new
    return render
  end

  def update
  end


  private


  def user_params
    params.require(:user).permit(:name, :email, :password)
  end
end
