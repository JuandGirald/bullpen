module Refinery
  module Cvs
    module Admin
      class ProjectInterestPointsController < ::Refinery::AdminController

        before_filter :find_all_projects, :only => [:show, :new, :edit]

        crudify :'refinery/cvs/project_interest_point',
                :title_attribute => 'content',
                :xhr_paging => true

        protected
          def find_all_projects
            @projects = Refinery::Cvs::Project.all
          end

          def project_interest_point_params
            params.require(:project_interest_point).permit(:content, :project_id, :position)
          end

      end
    end
  end
end
