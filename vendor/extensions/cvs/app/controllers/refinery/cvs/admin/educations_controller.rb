module Refinery
  module Cvs
    module Admin
      class EducationsController < ::Refinery::AdminController

        before_filter :find_all_cvs, :only => [:show, :new, :edit]

        crudify :'refinery/cvs/education',
                :title_attribute => 'title',
                :xhr_paging => true

        protected
          def find_all_cvs
            @cvs = Refinery::Cvs::Cv.all
          end

          def education_params
            params.require(:education).permit(:title, :institution, :cv_id, :position)
          end

      end
    end
  end
end
