module Refinery
  module Cvs
    module Admin
      class CvsController < ::Refinery::AdminController

        crudify :'refinery/cvs/cv',
                :title_attribute => 'name',
                :xhr_paging => true

      
        protected

          def cv_params
            params.require(:cv).permit(:name, :title, :profile, :stackoverflow_reputation, :blog, :photo_id, :position)
          end

      end
    end
  end
end
