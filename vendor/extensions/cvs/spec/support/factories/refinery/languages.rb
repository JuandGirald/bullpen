
FactoryGirl.define do
  factory :language, :class => Refinery::Cvs::Language do
    sequence(:name) { |n| "refinery#{n}" }
  end
end

