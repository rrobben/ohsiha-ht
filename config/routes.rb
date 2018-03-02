Rails.application.routes.draw do
  resources :users
  
  get '/login', to: 'users#login', as: 'login'

  # get 'users/logout'

  # get 'users/new' 
  # get 'users/register'

  # get 'users/edit'

  # get 'users/update'

  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
