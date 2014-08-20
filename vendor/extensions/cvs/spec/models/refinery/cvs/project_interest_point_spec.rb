require 'spec_helper'

module Refinery
  module Cvs
    describe ProjectInterestPoint do
      describe "validations" do
        subject do
          FactoryGirl.create(:project_interest_point,
          :content => "Refinery CMS")
        end

        it { should be_valid }
        its(:errors) { should be_empty }
        its(:content) { should == "Refinery CMS" }
      end
    end
  end
end
