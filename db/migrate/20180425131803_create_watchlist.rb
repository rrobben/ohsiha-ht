class CreateWatchlist < ActiveRecord::Migration[5.1]
  def change
    create_table :followed_players do |t|
      t.integer :user_id, null: false
      t.integer :player_id, null: false
    end

    add_foreign_key :followed_players, :users, name: :watchlist_user_fk
  end
end
