xml.div(class: 'container-fluid') do
  xml.div(class: 'row') do
    xml.div(class: 'col-xs-12') do
      xml.table(id: 'players-table') do
        xml.thead do
          xml.tr do
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