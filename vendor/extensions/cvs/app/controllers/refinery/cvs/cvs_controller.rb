module Refinery
  module Cvs
    class CvsController < ::ApplicationController

      before_filter :find_all_cvs
      before_filter :find_page

      def index
        # you can use meta fields from your model instead (e.g. browser_title)
        # by swapping @page for @cv in the line below:
        present(@page)
      end

      def show
        @cv = Cv.find(params[:id])
        @projects = Project.where(cv_id=@cv.id)
        @experiences = Experience.where(cv_id=@cv.id)

        # you can use meta fields from your model instead (e.g. browser_title)
        # by swapping @page for @cv in the line below:
        present(@page)
      end

    protected

      def find_all_cvs
        @cvs = Cv.order('position ASC')
      end

      def find_page
        @page = ::Refinery::Page.where(:link_url => "/cvs").first
      end

    end
  end
end
