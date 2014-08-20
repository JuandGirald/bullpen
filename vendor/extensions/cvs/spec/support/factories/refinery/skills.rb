
FactoryGirl.define do
  factory :skill, :class => Refinery::Cvs::Skill do
    sequence(:name) { |n| "refinery#{n}" }
  end
end

