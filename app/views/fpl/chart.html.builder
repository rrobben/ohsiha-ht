xml.div(class: 'container-fluid') do
  # TODO: Select axis
  # TODO: Filtering
  #xml.div(class: 'row') do
  #  xml.div(class: 'col-xs-12') do
  #    xml << form_for(:chart, url: fpl_chart_path(id: 1), method: 'get') do |f|
  #      f.options_for_select(FplHelper::options, :asd)
  #    end
  #  end
  #end

  xml.div(class: 'row') do
    xml << form_for(:chart) do |f|
      f.label(:y_axis) +
      f.select(:y_axis, FplHelper::PLAYER_CHART_AXIS_OPTIONS.map{ |k,v| [t(k.to_sym),k]}) +
      f.label(:x_axis) +
      f.select(:x_axis, FplHelper::PLAYER_CHART_AXIS_OPTIONS.map{ |k,v| [t(k.to_sym),k]})
    end
  end

  xml.div(class: 'row') do
    xml.div(class: 'col-xs-12', style: 'background-color: rgb(224, 224, 224);') do
      xml.canvas(id: 'player-chart', :'data-type' => @type, width: '1200', height: '600')
    end
  end
end