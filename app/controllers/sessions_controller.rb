class SessionsController < ApplicationController
    
  def new
    if logged_user_id
      redirect_to edit_user_path(id: logged_user_id)
    else
      render
    end
  end


  def create
    user = User.find_by_name(params[:session][:username])

    if user && user.authenticate(params[:session][:password])
      log_in(user)
      redirect_back_or(root_path)
    else
      render 'new'
    end
  end


  def destroy
    log_out if logged_user_id
    return redirect_to root_path
  end

end
