module Refinery
  module Cvs
    class Experience < Refinery::Core::BaseModel

      validates :name, :presence => true
      validates :cv_id, :presence => true

      belongs_to :cv

      # To enable admin searching, add acts_as_indexed on searchable fields, for example:
      #
      #   acts_as_indexed :fields => [:title]

    end
  end
end
