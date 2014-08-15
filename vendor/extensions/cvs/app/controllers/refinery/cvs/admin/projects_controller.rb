module Refinery
  module Cvs
    module Admin
      class ProjectsController < ::Refinery::AdminController

        before_filter :find_all_cvs, :only => [:show, :new]

        crudify :'refinery/cvs/project',
                :title_attribute => 'name',
                :xhr_paging => true

        protected
          def find_all_cvs
            @cvs = Refinery::Cvs::Cv.all
          end

          def project_params
            params.require(:project).permit(:name, :url, :description, :position)
          end

      end
    end
  end
end
