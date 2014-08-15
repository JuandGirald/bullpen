
FactoryGirl.define do
  factory :project, :class => Refinery::Cvs::Project do
    sequence(:name) { |n| "refinery#{n}" }
  end
end

