Refinery::Core::Engine.routes.draw do

  # Frontend routes
  namespace :cvs do
    resources :cvs, :path => '', :only => [:index, :show]
  end

  # Admin routes
  namespace :cvs, :path => '' do
    namespace :admin, :path => Refinery::Core.backend_route do
      resources :cvs, :except => :show do
        collection do
          post :update_positions
        end
      end
    end
  end

end
