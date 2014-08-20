class CreateCvsProjectInterestPoints < ActiveRecord::Migration

  def up
    create_table :refinery_cvs_project_interest_points do |t|
      t.string :content
      t.integer :project_id
      t.integer :position

      t.timestamps
    end

  end

  def down
    if defined?(::Refinery::UserPlugin)
      ::Refinery::UserPlugin.destroy_all({:name => "refinerycms-cvs"})
    end

    if defined?(::Refinery::Page)
      ::Refinery::Page.delete_all({:link_url => "/cvs/project_interest_points"})
    end

    drop_table :refinery_cvs_project_interest_points

  end

end
