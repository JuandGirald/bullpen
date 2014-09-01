module Refinery
  module Cvs
    class ProjectInterestPoint < Refinery::Core::BaseModel


      validates :content,    :presence => true
      validates :project_id, :presence => true

      belongs_to :project

      # To enable admin searching, add acts_as_indexed on searchable fields, for example:
      #
      #   acts_as_indexed :fields => [:title]

    end
  end
end
