
FactoryGirl.define do
  factory :cv, :class => Refinery::Cvs::Cv do
    sequence(:name) { |n| "refinery#{n}" }
  end
end

