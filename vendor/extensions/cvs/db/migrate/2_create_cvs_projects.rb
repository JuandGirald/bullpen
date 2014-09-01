class CreateCvsProjects < ActiveRecord::Migration

  def up
    create_table :refinery_cvs_projects do |t|
      t.string :name
      t.string :url
      t.text :description
      t.integer :position

      t.timestamps
    end

  end

  def down
    if defined?(::Refinery::UserPlugin)
      ::Refinery::UserPlugin.destroy_all({:name => "refinerycms-cvs"})
    end

    if defined?(::Refinery::Page)
      ::Refinery::Page.delete_all({:link_url => "/cvs/projects"})
    end

    drop_table :refinery_cvs_projects

  end

end
