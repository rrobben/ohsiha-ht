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

        jQuery('#players-table').DataTable({
            ajax: {
                url: url,
                dataSrc: ''
            },
            columns: [
                { data: 'name' },
                { data: 'team' },
                { data: 'position' },
                { data: 'status' },
                { data: 'cost' },
                { data: 'points' },
                { data: 'ppg' }
            ]

        });
    }
}