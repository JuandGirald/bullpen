module Refinery
  module Cvs
    class LanguagesController < ::ApplicationController

      before_filter :find_all_languages
      before_filter :find_page

      def index
        # you can use meta fields from your model instead (e.g. browser_title)
        # by swapping @page for @language in the line below:
        present(@page)
      end

      def show
        @language = Language.find(params[:id])

        # you can use meta fields from your model instead (e.g. browser_title)
        # by swapping @page for @language in the line below:
        present(@page)
      end

    protected

      def find_all_languages
        @languages = Language.order('position ASC')
      end

      def find_page
        @page = ::Refinery::Page.where(:link_url => "/languages").first
      end

    end
  end
end
