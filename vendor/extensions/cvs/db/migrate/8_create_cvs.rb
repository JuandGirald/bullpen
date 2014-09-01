class CreateCvs < ActiveRecord::Migration

  def up
    create_table :refinery_cvs do |t|
      t.string :name
      t.text :profile
      t.string :title
      t.integer :stackoverflow_reputation
      t.string :blog

      t.timestamps
    end

    add_index :refinery_cvs, :id
  end

  def down
    if defined?(::Refinery::UserPlugin)
      ::Refinery::UserPlugin.destroy_all({:name => "cvs"})
    end

    if defined?(::Refinery::Page)
      ::Refinery::Page.delete_all({:link_url => "/cvs"})
    end

    drop_table :refinery_cvs
  end

end
