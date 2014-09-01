module Refinery
  module Cvs
    class Engine < Rails::Engine
      extend Refinery::Engine
      isolate_namespace Refinery::Cvs

      engine_name :refinery_cvs

      before_inclusion do
        Refinery::Plugin.register do |plugin|
          plugin.name = "project_interest_points"
          plugin.url = proc { Refinery::Core::Engine.routes.url_helpers.cvs_admin_project_interest_points_path }
          plugin.pathname = root
          plugin.activity = {
            :class_name => :'refinery/cvs/project_interest_point',
            :title => 'content'
          }
          plugin.menu_match = %r{refinery/cvs/project_interest_points(/.*)?$}
        end
      end

      config.after_initialize do
        Refinery.register_extension(Refinery::ProjectInterestPoints)
      end
    end
  end
end
