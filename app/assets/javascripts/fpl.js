ActionJS.Fpl = {

    _getTable: function(watchlist) {
        console.log("Action: index")
        // TODO: Column hide / show        

        if (!jQuery('#players-table').hasClass('dataTable')) {
            jQuery('#players-table').DataTable({
                ajax: {
                    url: Routes.fpl_players_path({watchlist: watchlist}),
                    dataSrc: ''
                },
                rowId: 'id',
                processing: true,
                // stateSave: true,
                order: [[6, 'desc'], [7, 'desc']],
                columns: [
                    {
                        data: 'id',
                        orderable: false,
                        render: function (data, type, row) {
                            if (type == 'display') {
                                return jQuery('#modal-btn-template').html().replace(/__id__/g, data);
                            }

                            return null;
                        }
                    },
                    {
                        data: 'web_name',
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
                    { data: 'total_points' },
                    { data: 'points_per_game' },
                    { data: 'ppgm' },
                    { data: 'event_points' },
                    { data: 'selected_by_percent' },
                    { data: 'matches' },
                    { data: 'minutes' },
                    { data: 'goals_scored' },
                    { data: 'assists' },
                    { data: 'clean_sheets' },
                    { data: 'goals_conceded' },
                    { data: 'own_goals' },
                    { data: 'penalties_saved' },
                    { data: 'penalties_missed' },
                    { data: 'yellow_cards' },
                    { data: 'red_cards' },
                    { data: 'saves' },
                    { data: 'bonus' },
                    { data: 'bps' },
                    { data: 'influence' },
                    { data: 'creativity' },
                    { data: 'threat' },
                    { data: 'ict_index' },
                    { data: 'form' },
                    { data: 'dreamteam_count' },
                    { data: 'value_form' },
                    { data: 'value_season' },
                ],
                columnDefs: [
                    {
                        targets: [9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31],
                        visible: false
                    }
                ],
                initComplete: function() {
                    TableHelper.addColumnFilters(this, JSON.parse(jQuery('#filters-json').html()));
                }
            });

            jQuery('#player-modal').on('show.bs.modal', function (event) {
                Indicator.set('#player-modal .modal-content', true);
                var url = jQuery(event.relatedTarget).data('url');     
                var modal = $(this);       

                jQuery.get({
                    url: url,
                    success: function(data) {
                        modal.find('.modal-title').text(data.first_name + ' ' + data.second_name);
                        modal.find('.modal-body').text(data.news);
                        modal.find('.modal-footer form #player_id').val(data.id);

                        if (data.watchlist) {
                            modal.find('.modal-footer .btn').val(I18n.t('remove_from_watchlist'));
                        } else {
                            modal.find('.modal-footer .btn').val(I18n.t('add_to_watchlist'));
                        }
                        
                        Indicator.remove('#player-modal .modal-content');

                        modal.find('.modal-footer form').off('submit').on('submit', function(e) {
                            var url = jQuery(this).attr('action').replace(/__player_id__/g, data.id);
                            jQuery(this).attr('action', url);
                            var table = jQuery('#players-table').DataTable();

                            if (modal.find('.modal-footer .btn').val() == I18n.t('add_to_watchlist')) {
                                modal.find('.modal-footer .btn').val(I18n.t('remove_from_watchlist'));
                                if (watchlist) table.row.add(data).draw();
                            } else {
                                modal.find('.modal-footer .btn').val(I18n.t('add_to_watchlist'));
                                if (watchlist) table.row('#' + data.id).remove().draw();
                            }
                        });
                    }
                });
            });
        }
    },

    index: function() {
        ActionJS.Fpl._getTable(false);
    },

    watchlist: function() {
        ActionJS.Fpl._getTable(true);
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
            history.pushState({ y: y, x: x, filters: filters }, window.title, Routes.chart_path({ y: y, x: x, filters: filters }));
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

            console.log("renderChart")
            
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
        console.log("Action: chart")
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

            jQuery('#filter-submit').on('click', function(e) {
                ActionJS.Fpl.PlayerChart.startLoading();
            });

            jQuery('#filter-reset').on('click', function (e) {
                this.resetFilters();
            }.bind(this));

            jQuery(window).on('resize', function() {
                this.adjustHeight();
            }.bind(this));

            this.setFilters();
        },

        showForm: function() {
            if (!jQuery('.filter-dialog-wrapper').hasClass('user-hidden')) {
                jQuery('#filter-btn').addClass('shown');
                this.adjustHeight();

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
            
            jQuery('.filter-form select').each(function(input) {
                var elem = jQuery(this);

                if (elem.val() != '') {
                    var filter = elem.prop('id').split('filters_')[1];
                    var value = elem.val();
                    filters[filter] = value;
                }
            });

            jQuery('.filter-form input[type="number"]').each(function (input) {
                var elem = jQuery(this);

                if (elem.val() != '') {
                    var filter = elem.prop('id').split('filters_')[1];
                    var value = elem.val();

                    if (filter.includes('_max')) {
                        filter = filter.split('_max')[0];
                        
                        if (!filters[filter]) {
                            filters[filter] = {};
                        }

                        filters[filter]['max'] = value;
                    } else {
                        filter = filter.split('_min')[0];

                        if (!filters[filter]) {
                            filters[filter] = {};
                        }

                        filters[filter]['min'] = value;
                    }
                }
            });

            return filters;
        },

        setFilters: function() {
            var filters = JSON.parse(jQuery('#filter-values').html());

            Object.keys(filters).forEach(function(key) {
                if (Object.prototype.toString.call(filters[key]).toLowerCase().includes('array')) {
                    var id = '#filters_' + key;
                    jQuery('.filter-form ' + id).val(filters[key]);
                    jQuery('.filter-form ' + id).trigger('change');
                } else {
                    Object.keys(filters[key]).forEach(function(k) {
                        var id = '#filters_' + key + '_' + k;
                        jQuery('.filter-form ' + id).val(filters[key][k]);
                        jQuery('.filter-form ' + id).trigger('change');
                    });
                }
            });
        },

        resetFilters: function() {
            jQuery('.filter-form select').each(function (input) {
                jQuery(this).val('');
                jQuery(this).trigger('change');
            });

            jQuery('.filter-form input[type="number"]').each(function (input) {
                jQuery(this).val('');
                jQuery(this).trigger('change');
            });
        },

        adjustHeight: function() {
            var height = jQuery(window).height() - jQuery('.filter-dialog-wrapper').position().top;
            jQuery('.filter-dialog-wrapper').height(height);

            height = jQuery('.filter-dialog-wrapper').height() - jQuery('.filter-dialog-wrapper .filter-header').outerHeight() - jQuery('.filter-dialog-wrapper .filter-footer').outerHeight();
            jQuery('.filter-dialog-wrapper .filter-form').height(height);
        }
    }
}