ActionJS.Fpl = {
    index: function() {
        //console.log(Routes)
        var url = '/fpl/team/2340282'
        
        jQuery.get({
            url: url,
            success: function(data, status) {
                console.log(status);
                console.log(data)
                jQuery('#data-holder').html(String(data.id));
            }
        });
    }
}