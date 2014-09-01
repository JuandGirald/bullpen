class CreateCvsCvs < ActiveRecord::Migration

  def up
    create_table :refinery_cvs do |t|
      t.string :name
      t.text :profile
      t.string :title
      t.integer :stackoverflow_reputation
      t.string :blog
      t.integer :photo_id
      t.integer :position

      t.timestamps
    end

  end

  def down
    if defined?(::Refinery::UserPlugin)
      ::Refinery::UserPlugin.destroy_all({:name => "refinerycms-cvs"})
    end

    if defined?(::Refinery::Page)
      ::Refinery::Page.delete_all({:link_url => "/cvs/cvs"})
    end

    drop_table :refinery_cvs

  end

end
