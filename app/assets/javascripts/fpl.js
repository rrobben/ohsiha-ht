ActionJS.Fpl = {
    index: function() {
        // ADA
        // TODO: Column filtering
        // TODO: Range Filtering with dialog etc.
        // TODO: Column hide / show
        jQuery('#players-table').DataTable({
            ajax: {
                url: Routes.fpl_players_path(),
                dataSrc: ''
            },
            processing: true,
            stateSave: true,
            order: [[6, 'desc'], [7, 'desc']],
            columns: [
                {
                    data: 'id',
                    orderable: false,
                    render: function (data, type) {
                        if (type == 'display') {
                            return jQuery('#modal-btn-template').html().replace(/__id__/g, data);
                        }

                        return null;
                    }
                },
                {
                    data: 'name',
                    searchable: true
                },
                { 
                    data: 'team',
                    searchable: true
                },
                { 
                    data: 'position',
                    searchable: true
                },
                { 
                    data: 'status',
                    orderable: false,
                    searchable: true
                },
                { data: 'cost' },
                { data: 'points' },
                { data: 'value' },
                { data: 'ppg' },
                { data: 'ppgm' },
            ],
            columnDefs: [
                {
                    searchable: false,
                    targets: "_all"
                }
            ],
            initComplete: function() {
                ActionJS.Fpl._addColumnFilters(this, JSON.parse(jQuery('#filters-json').html()));
            }
        });

        jQuery('#player-modal').on('show.bs.modal', function (event) {
            var url = jQuery(event.relatedTarget).data('url');     
            var modal = $(this);       

            jQuery.get({
                url: url,
                success: function(data) {
                    modal.find('.modal-title').text(data.name);
                    modal.find('.modal-body').text(data.points);
                }
            });
        });
    },

    PlayerChart: {
        chart: null,

        init: function() {
            jQuery("select#chart_y_axis").val("now_cost");
            var x = jQuery("select#chart_x_axis").val();
            var y = jQuery("select#chart_y_axis").val();
            this.getChart(x, y);

            jQuery('select').on('change', function (evt) {
                x = jQuery("select#chart_x_axis").val();
                y = jQuery("select#chart_y_axis").val();
                this.getChart(x, y);
            }.bind(this));
        },

        getChart: function (x, y) {
            var playerChart = this;
            var url = Routes.fpl_chart_path({ y: y, x: x });
            /*
    
            var unit = ''
    
            switch (type) {
                case 'ppg':
                    unit = 'PPG';
                    break;
                default:
                    unit = 'Points';
            }*/

            jQuery.get({
                url: url,
                success: function (res, status, xhr) {
                    var data = {
                        datasets: res
                    }

                    var options = {
                        legend: false,
                        scales: {
                            yAxes: [{
                                ticks: {
                                    callback: function (value, index, values) {
                                        return '£' + String(value) + 'm';
                                    }
                                },
                            }],
                            xAxes: [{
                                ticks: {
                                    callback: function (value, index, values) {
                                        return String(value);
                                    }
                                }
                            }]
                        },
                        tooltips: {
                            displayColors: false,
                            callbacks: {
                                title: function (tips, data) {
                                    return data.datasets[tips[0].datasetIndex].label;
                                },
                                label: function (tip, data) {
                                    return tip.xLabel + ' (£' + tip.yLabel + 'm)'
                                }
                            }
                        }
                    };

                    playerChart.renderChart(jQuery('#player-chart'), data, 'bubble', options);
                }
            });
        },

        renderChart: function (ctx, data, type, options) {
            if (this.chart) {
                this.chart.destroy();
            }
            this.chart = new Chart(ctx, {
                type: type,
                data: data,
                options: options
            });
        },

    },

    chart: function() {
        this.PlayerChart.init();
    },

    _addColumnFilters: function (table, columnFilters) {
        jQuery.each(columnFilters, function (colIndex, filterValues) {
            if (colIndex < 0 || colIndex == '') {
                return;
            }

            var column = table.api().column(colIndex);
            var filters = jQuery('<div class="filters"><a href="#" class="toggle"><i class="icon icon-filter"></i>Filter</a></div>').appendTo(jQuery(column.header()));

            var selector = jQuery('<div class="selector" style="display:none;"><div class="values"></div></div>').appendTo(filters);
            var selectorValues = selector.find('.values');

            jQuery.each(filterValues, function (index, value) {
                selectorValues.append('<label data-text="' + value + '"><input type="checkbox" value="' + value + '" />' + value + '</label>');
            });

            jQuery('<input type="text" class="search form-control" placeholder="Search" style="display: none;" />').prependTo(selector);
            jQuery('<a href="#" class="btn btn-xs btn-primary float-xs-right done">Done</a>').appendTo(selector);
            jQuery('<a href="#" class="btn btn-xs btn-secondary float-xs-right clear">Clear</a>').appendTo(selector);

            // For large enough selection display the search box
            if (filterValues.length > 10) {
                selector.find('input.search').show();
            }

            var options = {
                element: selector,
                target: filters,
                attachment: 'top left',
                targetAttachment: 'bottom left',
                constraints: [{
                    to: 'scrollParent',
                    attachment: 'together',
                    pin: true
                }]
            };

            jQuery(selector).attr('data-col-link', jQuery(filters).closest('th').attr('data-col'));
            jQuery(selector).attr('data-table-link', jQuery(filters).closest('table').attr('id'));

            var tether = new Tether(options);


            filters.add(jQuery(tether.element)).
                on('click', 'a.toggle, a.done', function (e) {
                    e.stopPropagation();
                    var s = jQuery(tether.element).toggle();
                    jQuery('.selector').not(s).hide();

                    if (s.is(':visible') && s.find('input.search').is(':visible')) {
                        s.find('input.search').focus();
                    }
                    tether.position();
                    return false;
                });
            selector.
                on('click', '.values input', function () {
                    var filters = jQuery(tether.target);
                    var container = jQuery(tether.element);
                    var vals = []
                    container.find('input:checked').each(function () {
                        vals.push(jQuery(this).val());
                    });

                    filters.find('a.toggle').removeClass('active');

                    if (vals.length > 0) {
                        filters.find('a.toggle').addClass('active');
                    }
                    
                    column.search(vals.length > 0 ? vals.join('|') : '', true, false).draw();
                }).
                on('keyup', 'input.search', function (e) {
                    var regexp = new RegExp(this.value.split('').join('.*'), 'i');
                    jQuery(this).closest('.selector').find('.values label').each(function () {
                        jQuery(this).toggle(this.getAttribute('data-text').match(regexp) ? true : false);
                    });
                }).

                on('click', 'a.clear', function () {
                    jQuery(this).closest('.selector').find('.values input').prop('checked', false);
                    jQuery(this).closest('.selector').find('input.search').val('').trigger('keyup');
                    jQuery(tether.target).find('a.toggle').removeClass('active');
                    column.search('').draw();
                    return false;
                }).
                on('click', function (e) {
                    e.stopPropagation();
                });

        });

        // Hide column filters on click
        jQuery('body').not('.selector').on('click', function () {
            jQuery('.selector').each(function () {
                if (jQuery(this).is(':visible'))
                    jQuery(this).toggle();
            });
        });

        // Hide on table scroll
        table.closest('div').on('scroll', function () {
            jQuery('.selector').each(function () {
                if (jQuery(this).is(':visible'))
                    jQuery(this).toggle();
            });
        });

        // Initialize selected filters from table state
        var state = null;

        if (table.api().init().stateLoadCallback) {
            state = table.api().init().stateLoadCallback();
        } else {
            state = table.api().state();
        }

        console.log(state)

        if (state && state.columns) {
            for (var i = 0; i < state.columns.length; i++) {
                var filtersFound = false;

                if (state.columns[i].search && state.columns[i].search.search != '') {
                    var values = state.columns[i].search.search.split('|');
                    filtersFound = values.length > 0;

                    console.log(values)
                    console.log(filtersFound)

                    for (var j = 0; j < values.length; j++) {
                        jQuery('[data-col-link^="' + i + '"] input[value="' + values[j] + '"]').prop('checked', true);
                    }
                }
                if (filtersFound) {
                    jQuery('[data-col^="' + i + '"] .filters a.toggle').addClass('active');
                }
            }
        }
    },
}