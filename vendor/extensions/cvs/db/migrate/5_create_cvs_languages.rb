class CreateCvsLanguages < ActiveRecord::Migration

  def up
    create_table :refinery_cvs_languages do |t|
      t.string :name
      t.integer :level
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
      ::Refinery::Page.delete_all({:link_url => "/cvs/languages"})
    end

    drop_table :refinery_cvs_languages

  end

end
