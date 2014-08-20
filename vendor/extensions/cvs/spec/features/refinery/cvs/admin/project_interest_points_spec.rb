# encoding: utf-8
require "spec_helper"

describe Refinery do
  describe "Cvs" do
    describe "Admin" do
      describe "project_interest_points" do
        refinery_login_with :refinery_user

        describe "project_interest_points list" do
          before do
            FactoryGirl.create(:project_interest_point, :content => "UniqueTitleOne")
            FactoryGirl.create(:project_interest_point, :content => "UniqueTitleTwo")
          end

          it "shows two items" do
            visit refinery.cvs_admin_project_interest_points_path
            page.should have_content("UniqueTitleOne")
            page.should have_content("UniqueTitleTwo")
          end
        end

        describe "create" do
          before do
            visit refinery.cvs_admin_project_interest_points_path

            click_link "Add New Project Interest Point"
          end

          context "valid data" do
            it "should succeed" do
              fill_in "Content", :with => "This is a test of the first string field"
              click_button "Save"

              page.should have_content("'This is a test of the first string field' was successfully added.")
              Refinery::Cvs::ProjectInterestPoint.count.should == 1
            end
          end

          context "invalid data" do
            it "should fail" do
              click_button "Save"

              page.should have_content("Content can't be blank")
              Refinery::Cvs::ProjectInterestPoint.count.should == 0
            end
          end

          context "duplicate" do
            before { FactoryGirl.create(:project_interest_point, :content => "UniqueTitle") }

            it "should fail" do
              visit refinery.cvs_admin_project_interest_points_path

              click_link "Add New Project Interest Point"

              fill_in "Content", :with => "UniqueTitle"
              click_button "Save"

              page.should have_content("There were problems")
              Refinery::Cvs::ProjectInterestPoint.count.should == 1
            end
          end

        end

        describe "edit" do
          before { FactoryGirl.create(:project_interest_point, :content => "A content") }

          it "should succeed" do
            visit refinery.cvs_admin_project_interest_points_path

            within ".actions" do
              click_link "Edit this project interest point"
            end

            fill_in "Content", :with => "A different content"
            click_button "Save"

            page.should have_content("'A different content' was successfully updated.")
            page.should have_no_content("A content")
          end
        end

        describe "destroy" do
          before { FactoryGirl.create(:project_interest_point, :content => "UniqueTitleOne") }

          it "should succeed" do
            visit refinery.cvs_admin_project_interest_points_path

            click_link "Remove this project interest point forever"

            page.should have_content("'UniqueTitleOne' was successfully removed.")
            Refinery::Cvs::ProjectInterestPoint.count.should == 0
          end
        end

      end
    end
  end
end
