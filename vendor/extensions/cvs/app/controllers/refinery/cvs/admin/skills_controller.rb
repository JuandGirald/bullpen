module Refinery
  module Cvs
    module Admin
      class SkillsController < ::Refinery::AdminController

        before_filter :find_all_cvs, :only => [:show, :new, :edit]

        crudify :'refinery/cvs/skill',
                :title_attribute => 'name',
                :xhr_paging => true

        protected
          def find_all_cvs
            @cvs = Refinery::Cvs::Cv.all
          end

          def skill_params
            params.require(:skill).permit(:name, :cv_id, :position)
          end

      end
    end
  end
end
