# encoding: utf-8
require "spec_helper"

describe Refinery do
  describe "Cvs" do
    describe "Admin" do
      describe "cvs" do
        refinery_login_with :refinery_user

        describe "cvs list" do
          before do
            FactoryGirl.create(:cv, :name => "UniqueTitleOne")
            FactoryGirl.create(:cv, :name => "UniqueTitleTwo")
          end

          it "shows two items" do
            visit refinery.cvs_admin_cvs_path
            page.should have_content("UniqueTitleOne")
            page.should have_content("UniqueTitleTwo")
          end
        end

        describe "create" do
          before do
            visit refinery.cvs_admin_cvs_path

            click_link "Add New Cv"
          end

          context "valid data" do
            it "should succeed" do
              fill_in "Name", :with => "This is a test of the first string field"
              click_button "Save"

              page.should have_content("'This is a test of the first string field' was successfully added.")
              Refinery::Cvs::Cv.count.should == 1
            end
          end

          context "invalid data" do
            it "should fail" do
              click_button "Save"

              page.should have_content("Name can't be blank")
              Refinery::Cvs::Cv.count.should == 0
            end
          end

          context "duplicate" do
            before { FactoryGirl.create(:cv, :name => "UniqueTitle") }

            it "should fail" do
              visit refinery.cvs_admin_cvs_path

              click_link "Add New Cv"

              fill_in "Name", :with => "UniqueTitle"
              click_button "Save"

              page.should have_content("There were problems")
              Refinery::Cvs::Cv.count.should == 1
            end
          end

        end

        describe "edit" do
          before { FactoryGirl.create(:cv, :name => "A name") }

          it "should succeed" do
            visit refinery.cvs_admin_cvs_path

            within ".actions" do
              click_link "Edit this cv"
            end

            fill_in "Name", :with => "A different name"
            click_button "Save"

            page.should have_content("'A different name' was successfully updated.")
            page.should have_no_content("A name")
          end
        end

        describe "destroy" do
          before { FactoryGirl.create(:cv, :name => "UniqueTitleOne") }

          it "should succeed" do
            visit refinery.cvs_admin_cvs_path

            click_link "Remove this cv forever"

            page.should have_content("'UniqueTitleOne' was successfully removed.")
            Refinery::Cvs::Cv.count.should == 0
          end
        end

      end
    end
  end
end
