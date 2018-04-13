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
            Indicator.set('#player-modal .modal-content', true);
            var url = jQuery(event.relatedTarget).data('url');     
            var modal = $(this);       

            jQuery.get({
                url: url,
                success: function(data) {
                    modal.find('.modal-title').text(data.name);
                    modal.find('.modal-body').text(data.points);
                    Indicator.remove('#player-modal .modal-content');
                }
            });
        });
    },

    PlayerChart: {
        chart: null,

        init: function() {
            Indicator.set('#chart-content', true);
            var x = jQuery("select#chart_x_axis").val();
            var y = jQuery("select#chart_y_axis").val();

            var filters = ActionJS.Fpl.FilterForm.parseFilters();
            this.getChart(x, y, filters);

            jQuery('.axis-form select').on('change', function (evt) {
                this.startLoading();
            }.bind(this));
        },

        startLoading: function() {
            Indicator.set('#chart-content', true);
            var x = jQuery("select#chart_x_axis").val();
            var y = jQuery("select#chart_y_axis").val();

            var filters = ActionJS.Fpl.FilterForm.parseFilters();
            history.pushState({ y: y, x: x }, window.title, Routes.chart_path({ y: y, x: x }));
            this.getChart(x, y, filters);
        },

        getChart: function (x, y, filters) {
            var playerChart = this;
            var url = Routes.fpl_chart_path({ y: y, x: x, filters: filters });
            var xUnit = '';
            var yUnit = '';
            var xPreUnit = '';
            var yPreUnit = '';
    
            if (x == 'now_cost') {
                xUnit = 'm';
                xPreUnit = '£';
            } else if (x == 'selected_by_percent') {
                xUnit = '%';
            }

            if (y == 'now_cost') {
                yUnit = 'm';
                yPreUnit = '£';
            } else if (y == 'selected_by_percent') {
                yUnit = '%';
            }

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
                                        return yPreUnit + String(value) + yUnit;
                                    }
                                },
                            }],
                            xAxes: [{
                                ticks: {
                                    callback: function (value, index, values) {
                                        return xPreUnit + String(value) + xUnit;
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
                                    return xPreUnit + tip.xLabel + xUnit + ' (' + yPreUnit + tip.yLabel + yUnit + ')'
                                }
                            }
                        }
                    };

                    playerChart.renderChart(jQuery('#player-chart'), data, 'bubble', options);
                    Indicator.remove('#chart-content');
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
        this.FilterForm.init();
        this.PlayerChart.init();
    },

    FilterForm: {
        init: function() {
            jQuery('#filter-btn').on('click', function() {
                if (jQuery('#filter-btn').hasClass('shown')) {
                    this.hideForm();
                } else {
                    jQuery('.filter-dialog-wrapper').removeClass('user-hidden');
                    this.showForm();
                }
            }.bind(this));

            jQuery('.filter-form select.select2').each(function(select) {
                jQuery(this).prop('multiple', true);
                jQuery(this).val('');

                jQuery(this).select2({
                    theme: 'bootstrap',
                    width: '100%'
                });
            });

            jQuery('.filter-form').on('submit', function(e) {
                ActionJS.Fpl.PlayerChart.startLoading();
                return false;
            });
        },

        showForm: function() {
            if (!jQuery('.filter-dialog-wrapper').hasClass('user-hidden')) {
                jQuery('#filter-btn').addClass('shown');

                var height = jQuery(window).height() - jQuery('.filter-dialog-wrapper').position().top
                jQuery('.filter-dialog-wrapper').height(height);

                jQuery('#filter-cancel').off().on('click', function (event) {
                    this.resetForm();
                    event.preventDefault();
                    return false;
                }.bind(this));

                jQuery('.filter-dialog-wrapper').addClass('is-visible');
            }
        },

        hideForm: function () {
            jQuery('.filter-dialog-wrapper').removeClass('is-visible');
            jQuery('#filter-btn').removeClass('shown');
            jQuery('.filter-dialog-wrapper').addClass('user-hidden');
        },

        resetForm: function () {
            jQuery('.filter-dialog-wrapper').removeClass('is-visible');
            jQuery('#filter-btn').removeClass('shown');
            jQuery('.filter-dialog-wrapper').removeClass('user-hidden');
        },

        parseFilters: function() {
            var filters = {};
            
            jQuery('.filter-form .form-control').each(function(input) {
                var elem = jQuery(this);

                if (elem.val() != '') {
                    var filter = '';
                    var value = '';

                    switch(elem.prop('nodeName').toLowerCase()) {
                        case 'select':
                            filter = elem.prop('id').split('filters_')[1];
                            value = elem.val();
                    }

                    filters[filter] = value;
                }
            });

            return filters;
        },
    },

    _addColumnFilters: function (table, columnFilters) {
        jQuery.each(columnFilters, function (colIndex, filterValues) {
            if (colIndex < 0 || colIndex == '') {
                return;
            }

            var column = table.api().column(colIndex);
            var filters = jQuery('<div class="filters"><a href="#" class="toggle"><i class="fa fa-filter"></i> Filter</a></div>').appendTo(jQuery(column.header()));

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

        if (state && state.columns) {
            for (var i = 0; i < state.columns.length; i++) {
                var filtersFound = false;

                if (state.columns[i].search && state.columns[i].search.search != '') {
                    var values = state.columns[i].search.search.split('|');
                    filtersFound = values.length > 0;

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