# This migration comes from refinery_cvs (originally 3)
class CreateCvsExperiences < ActiveRecord::Migration

  def up
    create_table :refinery_cvs_experiences do |t|
      t.text :name
      t.integer :years
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
      ::Refinery::Page.delete_all({:link_url => "/cvs/experiences"})
    end

    drop_table :refinery_cvs_experiences

  end

end
