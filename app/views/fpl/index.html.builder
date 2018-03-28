xml.div(class: 'container-fluid') do
  xml.div(class: 'row') do
    xml.div(class: 'col-xs-12') do
      xml.table(id: 'players-table') do
        xml.thead do
          xml.tr do
            xml.th do
            end
            xml.th do
              xml << t(:name)
            end
            xml.th do
              xml << t(:team)
            end
            xml.th do
              xml << t(:position)
            end
            xml.th do
              xml << t(:status)
            end
            xml.th do
              xml << t(:cost)
            end
            xml.th do
              xml << t(:points)
            end
            xml.th do
              xml << t(:value_season)
            end
            xml.th do
              xml << t(:ppg)
            end
            xml.th do
              xml << t(:ppgm)
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