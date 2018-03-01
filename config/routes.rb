Rails.application.routes.draw do
  get 'users/login'

  get 'users/logout'

  get 'users/register'

  get 'users/edit'

  get 'users/update'

  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
