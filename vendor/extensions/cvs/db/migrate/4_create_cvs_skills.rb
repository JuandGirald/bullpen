class CreateCvsSkills < ActiveRecord::Migration

  def up
    create_table :refinery_cvs_skills do |t|
      t.string :name
      t.integer :cv_id
      t.integer :position

      t.timestamps
    end

  end

  def down
    if defined?(::Refinery::UserPlugin)
      ::Refinery::UserPlugin.destroy_all({:name => "refinerycms-cvs"})
    end

    if defined?(::Refinery::Page)
      ::Refinery::Page.delete_all({:link_url => "/cvs/skills"})
    end

    drop_table :refinery_cvs_skills

  end

end
