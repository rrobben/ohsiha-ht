Rails.application.routes.draw do
  root 'fpl#index'

  # session handling
  get '/login', to: 'sessions#new', as: 'login_form'
  post '/login', to: 'sessions#create', as: 'login'
  get '/logout', to: 'sessions#destroy', as: 'logout'

  # fpl functionality
  get '/index', to: 'fpl#index', as: 'index'
  get '/chart/:type', to: 'fpl#chart', as: 'chart'
  
  # fpl api requests
  get '/fpl/team/:id', to: 'fpl_api#team', as: 'fpl_team'
  get '/fpl/team/:id/history', to: 'fpl_api#gameweek_history', as: 'fpl_team_history'
  get '/fpl/players', to: 'fpl_api#players', as: 'fpl_players'
  get '/fpl/charts/:type', to: 'fpl_api#chart', as: 'fpl_chart'

  resources :users

  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
