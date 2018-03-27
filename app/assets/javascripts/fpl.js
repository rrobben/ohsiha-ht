ActionJS.Fpl = {
    index: function() {
        //console.log(Routes)
       /* var url = '/fpl/team/2340282'
        
        jQuery.get({
            url: url,
            success: function(data, status) {
                console.log(status);
                console.log(data)
                jQuery('#data-holder').html(String(data.id));
            }
        });*/

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
    }
}