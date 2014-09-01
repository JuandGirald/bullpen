# encoding: utf-8
require "spec_helper"

describe Refinery do
  describe "Cvs" do
    describe "Admin" do
      describe "educations" do
        refinery_login_with :refinery_user

        describe "educations list" do
          before do
            FactoryGirl.create(:education, :title => "UniqueTitleOne")
            FactoryGirl.create(:education, :title => "UniqueTitleTwo")
          end

          it "shows two items" do
            visit refinery.cvs_admin_educations_path
            page.should have_content("UniqueTitleOne")
            page.should have_content("UniqueTitleTwo")
          end
        end

        describe "create" do
          before do
            visit refinery.cvs_admin_educations_path

            click_link "Add New Education"
          end

          context "valid data" do
            it "should succeed" do
              fill_in "Title", :with => "This is a test of the first string field"
              click_button "Save"

              page.should have_content("'This is a test of the first string field' was successfully added.")
              Refinery::Cvs::Education.count.should == 1
            end
          end

          context "invalid data" do
            it "should fail" do
              click_button "Save"

              page.should have_content("Title can't be blank")
              Refinery::Cvs::Education.count.should == 0
            end
          end

          context "duplicate" do
            before { FactoryGirl.create(:education, :title => "UniqueTitle") }

            it "should fail" do
              visit refinery.cvs_admin_educations_path

              click_link "Add New Education"

              fill_in "Title", :with => "UniqueTitle"
              click_button "Save"

              page.should have_content("There were problems")
              Refinery::Cvs::Education.count.should == 1
            end
          end

        end

        describe "edit" do
          before { FactoryGirl.create(:education, :title => "A title") }

          it "should succeed" do
            visit refinery.cvs_admin_educations_path

            within ".actions" do
              click_link "Edit this education"
            end

            fill_in "Title", :with => "A different title"
            click_button "Save"

            page.should have_content("'A different title' was successfully updated.")
            page.should have_no_content("A title")
          end
        end

        describe "destroy" do
          before { FactoryGirl.create(:education, :title => "UniqueTitleOne") }

          it "should succeed" do
            visit refinery.cvs_admin_educations_path

            click_link "Remove this education forever"

            page.should have_content("'UniqueTitleOne' was successfully removed.")
            Refinery::Cvs::Education.count.should == 0
          end
        end

      end
    end
  end
end
