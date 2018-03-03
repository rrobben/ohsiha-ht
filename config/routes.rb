Rails.application.routes.draw do
  root 'fpl#index'

  get '/login', to: 'sessions#new', as: 'login_form'
  post '/login', to: 'sessions#create', as: 'login'
  get '/logout', to: 'sessions#destroy', as: 'logout'

  get '/index', to: 'fpl#index', as: 'index'
  get '/fpl/team/:id', to: 'fpl#team', as: 'fpl_team'

  resources :users
  



  # get 'users/logout'

  # get 'users/new' 
  # get 'users/register'

  # get 'users/edit'

  # get 'users/update'

  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
