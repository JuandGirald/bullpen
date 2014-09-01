module Refinery
  module Cvs
    class ProjectInterestPointsController < ::ApplicationController

      before_filter :find_all_project_interest_points
      before_filter :find_page

      def index
        # you can use meta fields from your model instead (e.g. browser_title)
        # by swapping @page for @project_interest_point in the line below:
        present(@page)
      end

      def show
        @project_interest_point = ProjectInterestPoint.find(params[:id])

        # you can use meta fields from your model instead (e.g. browser_title)
        # by swapping @page for @project_interest_point in the line below:
        present(@page)
      end

    protected

      def find_all_project_interest_points
        @project_interest_points = ProjectInterestPoint.order('position ASC')
      end

      def find_page
        @page = ::Refinery::Page.where(:link_url => "/project_interest_points").first
      end

    end
  end
end
