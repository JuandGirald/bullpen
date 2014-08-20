
FactoryGirl.define do
  factory :education, :class => Refinery::Cvs::Education do
    sequence(:title) { |n| "refinery#{n}" }
  end
end

