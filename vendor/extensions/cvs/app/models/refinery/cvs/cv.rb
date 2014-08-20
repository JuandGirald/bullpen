module Refinery
  module Cvs
    class Cv < Refinery::Core::BaseModel
      self.table_name = 'refinery_cvs'


      validates :name, :presence => true, :uniqueness => true

      belongs_to :photo, :class_name => '::Refinery::Image'

      has_many :projects
      has_many :educations
      has_many :skills
      has_many :languages
      has_many :experiences

      # To enable admin searching, add acts_as_indexed on searchable fields, for example:
      #
      #   acts_as_indexed :fields => [:title]

    end
  end
end
