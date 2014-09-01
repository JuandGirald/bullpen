module Refinery
  module Cvs
    class Project < Refinery::Core::BaseModel

      validates :name,  :presence => true
      validates :cv_id, :presence => true

      belongs_to :cv
      has_many   :project_interest_points

      # To enable admin searching, add acts_as_indexed on searchable fields, for example:
      #
      #   acts_as_indexed :fields => [:title]

    end
  end
end
