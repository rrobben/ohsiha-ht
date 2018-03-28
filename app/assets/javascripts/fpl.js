ActionJS.Fpl = {
    index: function() {
        var url = 'fpl/players'

        // ADA
        // TODO: Column filtering
        // TODO: Range Filtering with dialog etc.
        // TODO: Column hide / show
        jQuery('#players-table').DataTable({
            ajax: {
                url: url,
                dataSrc: ''
            },
            processing: true,
            stateSave: true,
            order: [[5, 'desc'], [6, 'desc']],
            columns: [
                {
                    data: 'name',
                    searchable: true
                },
                { data: 'team' },
                { data: 'position' },
                { 
                    data: 'status',
                    orderable: false },
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
            ]
        });
    },

    chart: function() {
        var url = '/fpl/charts/' + jQuery("#player-chart").data('type');
        
        jQuery.get({
            url: url,
            success: function(res, status, xhr) {
                var data = {
                    datasets: res
                }

                var options = {
                    legend: false,
                    scales: {
                        yAxes: [{
                            ticks: {
                                //min: 3.5
                            }
                        }],
                        xAxes: [{
                            ticks: {
                                //beginAtZero: true
                            }
                        }]
                    }
                };

                console.log(data)
                ActionJS.Fpl._renderChart(jQuery('#player-chart'), data, 'bubble', options);
            }
        });
    },

    _renderChart: function(ctx, data, type, options) {
        var chart = new Chart(ctx, {
            type: type,
            data: data,
            options: options
        });
    }
}