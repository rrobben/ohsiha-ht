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
    xml << form_for(:filters, remote: true) do |f|
      f.label(:team) +
      f.select(FplApiHelper::PLAYER_ATTRIBUTES[:team], FplApiHelper::TEAMS.map{ |k,v| [v,k]}, {}, class: 'select2 form-control') +
      f.label(:position) +
      f.select(FplApiHelper::PLAYER_ATTRIBUTES[:element_type], FplApiHelper::POSITIONS.map{ |k,v| [v,k]}, {}, class: 'select2 form-control') +

      f.submit(t(:update), class: 'btn btn-primary m-1')
    end
  end
end

xml.script(type: 'text/template', id: 'filter-values') do
  xml << @filter_values.to_json
end

