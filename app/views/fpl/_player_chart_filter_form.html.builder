xml.div(class: 'filter-dialog-wrapper card') do
	xml.h2(class: 'filter-header card-header') do
    xml << t(:filters)
    xml.button(id:'filter-cancel', class: 'close') do
      xml.span(:'aria-hidden' => true) do
        xml << "&times;"
      end
    end
  end

  xml.div(:class => 'card-block filter-form') do
    xml << form_for(:filters) do |f|
      f.label(t(:team)) +
      f.select(FplApiHelper::PLAYER_ATTRIBUTES[:team], FplApiHelper::TEAMS.map{ |k,v| [v,k]}, {}, class: 'select2') +
      f.label(t(:position)) +
      f.select(FplApiHelper::PLAYER_ATTRIBUTES[:element_type], FplApiHelper::POSITIONS.map{ |k,v| [v,k]}, {}, class: 'select2') +
      f.label(t(:status)) +
      f.select(FplApiHelper::PLAYER_ATTRIBUTES[:status], FplApiHelper::STATUSES.reject{|k,v| k == 'n' }.map{ |k,v| [v,k] }, {}, class: 'select2') +
      f.label(t(:total_points)) +
      f.number_field("#{FplApiHelper::PLAYER_ATTRIBUTES[:total_points]}_min") +
      f.label('-') +
      f.number_field("#{FplApiHelper::PLAYER_ATTRIBUTES[:total_points]}_max") +
      f.label(t(:event_points)) +
      f.number_field("#{FplApiHelper::PLAYER_ATTRIBUTES[:event_points]}_min") +
      f.label('-') +
      f.number_field("#{FplApiHelper::PLAYER_ATTRIBUTES[:event_points]}_max") +
      f.label(t(:now_cost)) +
      f.number_field("#{FplApiHelper::PLAYER_ATTRIBUTES[:now_cost]}_min", min: 0) +
      f.label('-') +
      f.number_field("#{FplApiHelper::PLAYER_ATTRIBUTES[:now_cost]}_max", min: 0) +
      f.label(t(:selected_by_percent)) +
      f.number_field("#{FplApiHelper::PLAYER_ATTRIBUTES[:selected_by_percent]}_min", min: 0, max: 100) +
      f.label('-') +
      f.number_field("#{FplApiHelper::PLAYER_ATTRIBUTES[:selected_by_percent]}_max", min: 0, max: 100) +
      f.label(t(:matches)) +
      f.number_field("#{FplApiHelper::PLAYER_ATTRIBUTES[:matches]}_min", min: 0) +
      f.label('-') +
      f.number_field("#{FplApiHelper::PLAYER_ATTRIBUTES[:matches]}_max", min: 0) +
      f.label(t(:minutes)) +
      f.number_field("#{FplApiHelper::PLAYER_ATTRIBUTES[:minutes]}_min", min: 0) +
      f.label('-') +
      f.number_field("#{FplApiHelper::PLAYER_ATTRIBUTES[:minutes]}_max", min: 0) +
      f.label(t(:goals_scored)) +
      f.number_field("#{FplApiHelper::PLAYER_ATTRIBUTES[:goals_scored]}_min", min: 0) +
      f.label('-') +
      f.number_field("#{FplApiHelper::PLAYER_ATTRIBUTES[:goals_scored]}_max", min: 0) +
      f.label(t(:assists)) +
      f.number_field("#{FplApiHelper::PLAYER_ATTRIBUTES[:assists]}_min", min: 0) +
      f.label('-') +
      f.number_field("#{FplApiHelper::PLAYER_ATTRIBUTES[:assists]}_max", min: 0) +
      f.label(t(:clean_sheets)) +
      f.number_field("#{FplApiHelper::PLAYER_ATTRIBUTES[:clean_sheets]}_min", min: 0) +
      f.label('-') +
      f.number_field("#{FplApiHelper::PLAYER_ATTRIBUTES[:clean_sheets]}_max", min: 0) +
      f.label(t(:goals_conceded)) +
      f.number_field("#{FplApiHelper::PLAYER_ATTRIBUTES[:goals_conceded]}_min", min: 0) +
      f.label('-') +
      f.number_field("#{FplApiHelper::PLAYER_ATTRIBUTES[:goals_conceded]}_max", min: 0) +
      f.label(t(:own_goals)) +
      f.number_field("#{FplApiHelper::PLAYER_ATTRIBUTES[:own_goals]}_min", min: 0) +
      f.label('-') +
      f.number_field("#{FplApiHelper::PLAYER_ATTRIBUTES[:own_goals]}_max", min: 0) +
      f.label(t(:penalties_saved)) +
      f.number_field("#{FplApiHelper::PLAYER_ATTRIBUTES[:penalties_saved]}_min", min: 0) +
      f.label('-') +
      f.number_field("#{FplApiHelper::PLAYER_ATTRIBUTES[:penalties_saved]}_max", min: 0) +
      f.label(t(:penalties_missed)) +
      f.number_field("#{FplApiHelper::PLAYER_ATTRIBUTES[:penalties_missed]}_min", min: 0) +
      f.label('-') +
      f.number_field("#{FplApiHelper::PLAYER_ATTRIBUTES[:penalties_missed]}_max", min: 0) +
      f.label(t(:yellow_cards)) +
      f.number_field("#{FplApiHelper::PLAYER_ATTRIBUTES[:yellow_cards]}_min", min: 0) +
      f.label('-') +
      f.number_field("#{FplApiHelper::PLAYER_ATTRIBUTES[:yellow_cards]}_max", min: 0) +
      f.label(t(:red_cards)) +
      f.number_field("#{FplApiHelper::PLAYER_ATTRIBUTES[:red_cards]}_min", min: 0) +
      f.label('-') +
      f.number_field("#{FplApiHelper::PLAYER_ATTRIBUTES[:red_cards]}_max", min: 0) +
      f.label(t(:saves)) +
      f.number_field("#{FplApiHelper::PLAYER_ATTRIBUTES[:saves]}_min", min: 0) +
      f.label('-') +
      f.number_field("#{FplApiHelper::PLAYER_ATTRIBUTES[:saves]}_max", min: 0) +
      f.label(t(:bonus)) +
      f.number_field("#{FplApiHelper::PLAYER_ATTRIBUTES[:bonus]}_min", min: 0) +
      f.label('-') +
      f.number_field("#{FplApiHelper::PLAYER_ATTRIBUTES[:bonus]}_max", min: 0) +
      f.label(t(:bps)) +
      f.number_field("#{FplApiHelper::PLAYER_ATTRIBUTES[:bps]}_min", min: 0) +
      f.label('-') +
      f.number_field("#{FplApiHelper::PLAYER_ATTRIBUTES[:bps]}_max", min: 0) +
      f.label(t(:influence)) +
      f.number_field("#{FplApiHelper::PLAYER_ATTRIBUTES[:influence]}_min", min: 0) +
      f.label('-') +
      f.number_field("#{FplApiHelper::PLAYER_ATTRIBUTES[:influence]}_max", min: 0) +
      f.label(t(:creativity)) +
      f.number_field("#{FplApiHelper::PLAYER_ATTRIBUTES[:creativity]}_min", min: 0) +
      f.label('-') +
      f.number_field("#{FplApiHelper::PLAYER_ATTRIBUTES[:creativity]}_max", min: 0) +
      f.label(t(:threat)) +
      f.number_field("#{FplApiHelper::PLAYER_ATTRIBUTES[:threat]}_min", min: 0) +
      f.label('-') +
      f.number_field("#{FplApiHelper::PLAYER_ATTRIBUTES[:threat]}_max", min: 0) +
      f.label(t(:ict_index)) +
      f.number_field("#{FplApiHelper::PLAYER_ATTRIBUTES[:ict_index]}_min", min: 0) +
      f.label('-') +
      f.number_field("#{FplApiHelper::PLAYER_ATTRIBUTES[:ict_index]}_max", min: 0) +
      f.label(t(:form)) +
      f.number_field("#{FplApiHelper::PLAYER_ATTRIBUTES[:form]}_min") +
      f.label('-') +
      f.number_field("#{FplApiHelper::PLAYER_ATTRIBUTES[:form]}_max") +
      f.label(t(:dreamteam_count)) +
      f.number_field("#{FplApiHelper::PLAYER_ATTRIBUTES[:dreamteam_count]}_min", min: 0) +
      f.label('-') +
      f.number_field("#{FplApiHelper::PLAYER_ATTRIBUTES[:dreamteam_count]}_max", min: 0) +
      f.label(t(:value_form)) +
      f.number_field("#{FplApiHelper::PLAYER_ATTRIBUTES[:value_form]}_min") +
      f.label('-') +
      f.number_field("#{FplApiHelper::PLAYER_ATTRIBUTES[:value_form]}_max") +
      f.label(t(:value_season)) +
      f.number_field("#{FplApiHelper::PLAYER_ATTRIBUTES[:value_season]}_min") +
      f.label('-') +
      f.number_field("#{FplApiHelper::PLAYER_ATTRIBUTES[:value_season]}_max") +
      f.label(t(:points_per_game)) +
      f.number_field("#{FplApiHelper::PLAYER_ATTRIBUTES[:points_per_game]}_min") +
      f.label('-') +
      f.number_field("#{FplApiHelper::PLAYER_ATTRIBUTES[:points_per_game]}_max")
    end
  end

  xml.div(class: 'filter-footer card-footer') do
    xml.button(id: 'filter-submit', class: 'btn btn-primary') do
      xml << t(:update)
    end
    xml.button(id: 'filter-reset', class: 'ml-3 btn btn-danger') do
      xml << t(:reset)
    end
  end
end

xml.script(type: 'text/template', id: 'filter-values') do
  xml << @filter_values.to_json
end

