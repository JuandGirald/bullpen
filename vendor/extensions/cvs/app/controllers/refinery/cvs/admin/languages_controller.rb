module Refinery
  module Cvs
    module Admin
      class LanguagesController < ::Refinery::AdminController

        before_filter :find_all_cvs, :only => [:show, :new, :edit]

        crudify :'refinery/cvs/language',
                :title_attribute => 'name',
                :xhr_paging => true

        protected
          def find_all_cvs
            @cvs = Refinery::Cvs::Cv.all
          end

          def language_params
            params.require(:language).permit(:name, :level, :cv_id, :position)
          end

      end
    end
  end
end
