module SessionsHelper

    def log_in(user)
      remember(user)
      session[:logged_user_id] = user.id
    end


    def logged_user_id
      session[:logged_user_id]
    end


    def current_user
      User.find(logged_user_id)
    end


    def log_out
      forget(current_user)
      session.delete(:logged_user_id)
    end


    def remember(user)
      user.remember
      cookies.permanent.signed[:user_id] = user.id
      cookies.permanent[:remember_token] = user.remember_token
    end

    
    def forget(user)
      user.forget
      cookies.delete(:user_id)
      cookies.delete(:remember_token)
    end


    def redirect_back_or(default)
      redirect_to(session[:forwarding_url] || default)
      session.delete(:forwarding_url)
    end

    
    def store_location
      session[:forwarding_url] = request.original_url if request.get?
    end

  end
