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
    FplApiHelper::PLAYER_ATTRIBUTES.each do |k,v|
      next if v == 'id' || v.include?('name') || v == 'news' || v == 'chance_of_playing_next_round'
      xml.div(class: 'col-xs-12') do
        xml << label(:filters, t(k))

        if k == :team || k == :element_type || k == :status
          case k
            when :team
              xml << select(:filters, v, FplApiHelper::TEAMS.map{ |k,v| [v,k]}, {}, class: 'select2')
            when :element_type
              xml << select(:filters, v, FplApiHelper::POSITIONS.map{ |k,v| [v,k]}, {}, class: 'select2')
            when :status
              xml << select(:filters, v, FplApiHelper::STATUSES.reject{|k,v| k == 'n' }.map{ |k,v| [v,k] }, {}, class: 'select2')
          end
        else
          xml << number_field(:filters, "#{v}_max", class: 'pull-right')
          xml << label(:filters, '-', class: 'pull-right')
          xml << number_field(:filters, "#{v}_min", class: 'pull-right')
        end
      end
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

