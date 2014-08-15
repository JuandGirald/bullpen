module Refinery
  module Cvs
    module Admin
      class ProjectsController < ::Refinery::AdminController

        crudify :'refinery/cvs/project',
                :title_attribute => 'name',
                :xhr_paging => true

      end
    end
  end
end
