/*
 * Indicator for async content
 */
var Indicator = {
    set: function(containerSelector, asOverlay) {
        var indicator = '<div class="indicator' + (asOverlay ? ' overlay' : '') + '"><i class="fa fa-circle-o-notch fa-spin"></i></div>';

        if (asOverlay) {
            jQuery(containerSelector).append(indicator);
        } else {
            jQuery(containerSelector).html(indicator);
        }
    },


    remove: function(containerSelector) {
        jQuery(containerSelector).find('.indicator').remove();
    }
};