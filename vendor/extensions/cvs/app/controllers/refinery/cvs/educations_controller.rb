module Refinery
  module Cvs
    class EducationsController < ::ApplicationController

      before_filter :find_all_educations
      before_filter :find_page

      def index
        # you can use meta fields from your model instead (e.g. browser_title)
        # by swapping @page for @education in the line below:
        present(@page)
      end

      def show
        @education = Education.find(params[:id])

        # you can use meta fields from your model instead (e.g. browser_title)
        # by swapping @page for @education in the line below:
        present(@page)
      end

    protected

      def find_all_educations
        @educations = Education.order('position ASC')
      end

      def find_page
        @page = ::Refinery::Page.where(:link_url => "/educations").first
      end

    end
  end
end
