module Refinery
  module Cvs
    class Engine < Rails::Engine
      extend Refinery::Engine
      isolate_namespace Refinery::Cvs

      engine_name :refinery_cvs

      before_inclusion do
        Refinery::Plugin.register do |plugin|
          plugin.name = "projects"
          plugin.url = proc { Refinery::Core::Engine.routes.url_helpers.cvs_admin_projects_path }
          plugin.pathname = root
          plugin.activity = {
            :class_name => :'refinery/cvs/project',
            :title => 'name'
          }
          plugin.menu_match = %r{refinery/cvs/projects(/.*)?$}
        end
      end

      config.after_initialize do
        Refinery.register_extension(Refinery::Projects)
      end
    end
  end
end
