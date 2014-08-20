class CreateCvsEducations < ActiveRecord::Migration

  def up
    create_table :refinery_cvs_educations do |t|
      t.string :title
      t.string :institution
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
      ::Refinery::Page.delete_all({:link_url => "/cvs/educations"})
    end

    drop_table :refinery_cvs_educations

  end

end
