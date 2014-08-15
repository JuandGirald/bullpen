module Refinery
  module Cvs
    module Admin
      class CvsController < ::Refinery::AdminController

        crudify :'refinery/cvs/cv',
                :title_attribute => 'name',
                :xhr_paging => true

      end
    end
  end
end
