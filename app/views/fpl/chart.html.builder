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
    xml.div(class: 'col-xs-12') do
      xml.canvas(id: 'player-chart', :'data-type' => @type, width: '1200', height: '600')
    end
  end
end