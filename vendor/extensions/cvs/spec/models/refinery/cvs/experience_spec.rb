require 'spec_helper'

module Refinery
  module Cvs
    describe Experience do
      describe "validations" do
        subject do
          FactoryGirl.create(:experience)
        end

        it { should be_valid }
        its(:errors) { should be_empty }
      end
    end
  end
end
