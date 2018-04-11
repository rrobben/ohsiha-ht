xml.div(class: 'container-fluid') do
  xml.div(class: 'row') do
    xml.div(class: 'col-xs-12') do
      xml.table(id: 'players-table') do
        xml.thead do
          xml.tr do
            FplHelper::PLAYER_TABLE_COLUMNS.each_with_index do |c, i|
              xml.th(:'data-col' => i) do
                xml << t(c.to_sym) unless c.blank?
              end
            end
          end
        end
        xml.tbody do
        end
      end
    end
  end
end

xml.script(type: 'text/html', id: 'modal-btn-template') do
  xml.button(type: 'button', class: 'btn btn-primary', :'data-toggle' => 'modal', :'data-target' => '#player-modal', :'data-url' => fpl_player_path(id: '__id__')) do
    xml << t(:info).downcase
  end
end

filter_options = { 
  2 => FplApiHelper::TEAMS.values.uniq,
  3 => FplApiHelper::POSITIONS.values.uniq,
  4 => FplApiHelper::STATUSES.values.uniq
}

xml.script(:type => 'text/template', :id => 'filters-json') do
  xml << filter_options.to_json
end

xml.div(class: 'modal fade', id: 'player-modal', role: 'dialog') do
  xml.div(class: 'modal-dialog', role:'document') do
    xml.div(class: 'modal-content') do
      xml.div(class: 'modal-header') do
        xml.h5(class: 'modal-title') do
        end
        xml.button(type: 'button', class: 'close', :'data-dismiss' => 'modal', :'aria-label' => 'Close') do
          xml.span(:'aria-hidden' => true) do
            xml << "&times;"
          end
        end
      end
      xml.div(class: 'modal-body') do
      end
    end
  end
end