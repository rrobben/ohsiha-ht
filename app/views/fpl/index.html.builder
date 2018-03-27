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
        xml << t(:ppg)
      end
    end
  end
  xml.tbody do
  end
end