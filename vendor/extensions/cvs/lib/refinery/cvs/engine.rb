module Refinery
  module Cvs
    class Engine < Rails::Engine
      extend Refinery::Engine
      isolate_namespace Refinery::Cvs

      engine_name :refinery_cvs

      before_inclusion do
        Refinery::Plugin.register do |plugin|
          plugin.name = "cvs"
          plugin.url = proc { Refinery::Core::Engine.routes.url_helpers.cvs_admin_cvs_path }
          plugin.pathname = root
          plugin.activity = {
            :class_name => :'refinery/cvs/cv',
            :title => 'name'
          }
          
        end
      end

      config.after_initialize do
        Refinery.register_extension(Refinery::Cvs)
      end
    end
  end
end
