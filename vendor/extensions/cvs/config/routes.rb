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


  # Frontend routes
  namespace :cvs do
    resources :projects, :only => [:index, :show]
  end

  # Admin routes
  namespace :cvs, :path => '' do
    namespace :admin, :path => "#{Refinery::Core.backend_route}/cvs" do
      resources :projects, :except => :show do
        collection do
          post :update_positions
        end
      end
    end
  end


  # Frontend routes
  namespace :cvs do
    resources :experiences, :only => [:index, :show]
  end

  # Admin routes
  namespace :cvs, :path => '' do
    namespace :admin, :path => "#{Refinery::Core.backend_route}/cvs" do
      resources :experiences, :except => :show do
        collection do
          post :update_positions
        end
      end
    end
  end


  # Frontend routes
  namespace :cvs do
    resources :skills, :only => [:index, :show]
  end

  # Admin routes
  namespace :cvs, :path => '' do
    namespace :admin, :path => "#{Refinery::Core.backend_route}/cvs" do
      resources :skills, :except => :show do
        collection do
          post :update_positions
        end
      end
    end
  end


  # Frontend routes
  namespace :cvs do
    resources :languages, :only => [:index, :show]
  end

  # Admin routes
  namespace :cvs, :path => '' do
    namespace :admin, :path => "#{Refinery::Core.backend_route}/cvs" do
      resources :languages, :except => :show do
        collection do
          post :update_positions
        end
      end
    end
  end


  # Frontend routes
  namespace :cvs do
    resources :educations, :only => [:index, :show]
  end

  # Admin routes
  namespace :cvs, :path => '' do
    namespace :admin, :path => "#{Refinery::Core.backend_route}/cvs" do
      resources :educations, :except => :show do
        collection do
          post :update_positions
        end
      end
    end
  end

end
