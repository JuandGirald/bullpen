module Refinery
  module Cvs
    class Project < Refinery::Core::BaseModel


      validates :name, :presence => true, :uniqueness => true

      belongs_to :cv

      # To enable admin searching, add acts_as_indexed on searchable fields, for example:
      #
      #   acts_as_indexed :fields => [:title]

    end
  end
end
