Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html

  get '/', to: 'test#index', as: 'index'
  post '/', to: 'test#create', as: 'tests'

end
