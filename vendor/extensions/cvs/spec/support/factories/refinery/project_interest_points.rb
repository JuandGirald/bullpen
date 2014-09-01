
FactoryGirl.define do
  factory :project_interest_point, :class => Refinery::Cvs::ProjectInterestPoint do
    sequence(:content) { |n| "refinery#{n}" }
  end
end

