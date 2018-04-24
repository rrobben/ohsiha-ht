ActionJS.Fpl = {
    index: function() {
        // ADA
        // TODO: Column filtering
        // TODO: Range Filtering with dialog etc.
        // TODO: Column hide / show
        jQuery('#players-table').DataTable({
            ajax: {
                //url: Routes.fpl_players_path(),
                url: 'https://ohsiha-ht.herokuapp.com/fpl/players/'
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

            jQuery('#filter-submit').on('click', function(e) {
                ActionJS.Fpl.PlayerChart.startLoading();
            });

            jQuery('#filter-reset').on('click', function (e) {
                this.resetFilters();
            }.bind(this));

            this.setFilters();
        },

        showForm: function() {
            if (!jQuery('.filter-dialog-wrapper').hasClass('user-hidden')) {
                jQuery('#filter-btn').addClass('shown');

                var height = jQuery(window).height() - jQuery('.filter-dialog-wrapper').position().top;
                jQuery('.filter-dialog-wrapper').height(height);

                height = jQuery('.filter-dialog-wrapper').height() - jQuery('.filter-dialog-wrapper .filter-header').outerHeight() - jQuery('.filter-dialog-wrapper .filter-footer').outerHeight();
                jQuery('.filter-dialog-wrapper .filter-form').height(height);

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
        }
    }
}