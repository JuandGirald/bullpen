module Refinery
  module Cvs
    module Admin
      class ExperiencesController < ::Refinery::AdminController

        before_filter :find_all_cvs, :only => [:show, :new, :edit]

        crudify :'refinery/cvs/experience',
                :title_attribute => 'name',
                :xhr_paging => true

        protected
          def find_all_cvs
            @cvs = Refinery::Cvs::Cv.all
          end

          def experience_params
            params.require(:experience).permit(:name, :years, :position)
          end
      end
    end
  end
end
