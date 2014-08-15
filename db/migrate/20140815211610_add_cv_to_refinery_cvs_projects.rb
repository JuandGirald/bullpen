class AddCvToRefineryCvsProjects < ActiveRecord::Migration
  def change
    add_column :refinery_cvs_projects, :cv_id, :integer
  end
end
