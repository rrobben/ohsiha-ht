class UsersController < ApplicationController
  before_action :logged_in_user, only: [:edit, :update, :destroy]

  def new
    @user = User.new
    return render
  end


  def create
    @user = User.new(user_params)
    if @user.valid?
      log_in(@user)
      redirect_to root_path
    else
      render 'new'
    end
  end


  def edit
    @user = current_user
    return render
  end


  def update
    @user = current_user
    if @user.update(user_params)
      return redirect_to edit_user_path(id: @user.id)
    else
      render 'edit'
    end
  end


  def destroy
    user = current_user
    log_out
    user.destroy
    redirect_to root_path
  end


  private


  def user_params
    params.require(:user).permit(:name, :email, :password, :password_confirmation)
  end


  def logged_in_user
    unless logged_user_id
      store_location
      redirect_to login_form_path
    end
  end
  

end
