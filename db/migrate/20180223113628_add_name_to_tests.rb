class AddNameToTests < ActiveRecord::Migration[5.1]
  def change
    add_column :tests, :name, :string
  end
end
