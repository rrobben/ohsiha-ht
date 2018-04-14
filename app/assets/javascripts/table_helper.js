var TableHelper = {
    addColumnFilters: function (table, columnFilters) {
        jQuery.each(columnFilters, function (colIndex, filterValues) {
            var column = table.api().column(colIndex);
            var filters = jQuery('<div class="filters"><a href="#" class="toggle"><i class="fa fa-filter"></i> Filter</a></div>').appendTo(jQuery(column.header()));

            if (Object.prototype.toString.call(filterValues).toLowerCase().includes('array')) {
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
            } else {
                filterValues = ['min', 'max'];
                var selector = jQuery('<div class="selector" style="display:none;"><div class="values"></div></div>').appendTo(filters);
                var selectorValues = selector.find('.values');

                jQuery.each(filterValues, function (index, value) {
                    selectorValues.append('<label data-text="' + value + '">' + value + '<input type="number" data-key="' + value + '"/></label>');
                });

                jQuery('<a href="#" class="btn btn-xs btn-primary float-xs-right done">Update</a>').appendTo(selector);
                jQuery('<a href="#" class="btn btn-xs btn-secondary float-xs-right clear">Clear</a>').appendTo(selector);

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

                        if (s.is(':visible')) {
                            s.find('input.min').focus();
                        }
                        tether.position();
                        return false;
                    });
                selector.
                    on('click', 'a.done', function () {
                        var filters = jQuery(tether.target);
                        var container = jQuery(tether.element);
                        var vals = []
                        container.find('input[type="number"]').each(function () {
                            if (jQuery(this).val() != '') {
                                var value = {};
                                value[jQuery(this).data('key')] = jQuery(this).val();
                                vals.push(value);
                            }
                        });

                        filters.find('a.toggle').removeClass('active');

                        if (vals.length > 0) {
                            filters.find('a.toggle').addClass('active');
                        }

                        TableHelper.removeCustomFilters(colIndex);

                        var filtering;

                        switch(String(colIndex)) {
                            case "5":
                                filtering = function (settings, data, dataIndex) {
                                    //5
                                    var selected = true;
                                    jQuery.each(vals, function (i, values) {
                                        jQuery.each(values, function (key, value) {
                                            if ((key == 'min' && parseFloat(data[colIndex]) < parseFloat(value)) || (key == 'max' && parseFloat(data[colIndex]) > parseFloat(value))) {
                                                selected = false;
                                            }
                                        });
                                    });
                                    return selected;
                                };
                                break;
                            case "6":
                                filtering = function (settings, data, dataIndex) {
                                    //6
                                    var selected = true;
                                    jQuery.each(vals, function (i, values) {
                                        jQuery.each(values, function (key, value) {
                                            if ((key == 'min' && parseFloat(data[colIndex]) < parseFloat(value)) || (key == 'max' && parseFloat(data[colIndex]) > parseFloat(value))) {
                                                selected = false;
                                            }
                                        });
                                    });
                                    return selected;
                                };
                                break;
                            case "7":
                                filtering = function (settings, data, dataIndex) {
                                    //7
                                    var selected = true;
                                    jQuery.each(vals, function (i, values) {
                                        jQuery.each(values, function (key, value) {
                                            if ((key == 'min' && parseFloat(data[colIndex]) < parseFloat(value)) || (key == 'max' && parseFloat(data[colIndex]) > parseFloat(value))) {
                                                selected = false;
                                            }
                                        });
                                    });
                                    return selected;
                                };
                                break;
                            case "8":
                                filtering = function (settings, data, dataIndex) {
                                    //8
                                    var selected = true;
                                    jQuery.each(vals, function (i, values) {
                                        jQuery.each(values, function (key, value) {
                                            if ((key == 'min' && parseFloat(data[colIndex]) < parseFloat(value)) || (key == 'max' && parseFloat(data[colIndex]) > parseFloat(value))) {
                                                selected = false;
                                            }
                                        });
                                    });
                                    return selected;
                                };
                                break;
                            case "9":
                                filtering = function (settings, data, dataIndex) {
                                    //9
                                    var selected = true;
                                    jQuery.each(vals, function (i, values) {
                                        jQuery.each(values, function (key, value) {
                                            if ((key == 'min' && parseFloat(data[colIndex]) < parseFloat(value)) || (key == 'max' && parseFloat(data[colIndex]) > parseFloat(value))) {
                                                selected = false;
                                            }
                                        });
                                    });
                                    return selected;
                                };
                                break;
                        }

                        $.fn.dataTable.ext.search.push(filtering);
                        column.draw();
                    }).

                    on('click', 'a.clear', function () {
                        jQuery(this).closest('.selector').find('input[type="number"]').val('').trigger('keyup');
                        jQuery(tether.target).find('a.toggle').removeClass('active');
                        TableHelper.removeCustomFilters(colIndex);
                        
                        column.draw();
                        return false;
                    }).
                    on('click', function (e) {
                        e.stopPropagation();
                    });
            }
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

    removeCustomFilters: function(colIndex) {
        while (true) {
            var i = -1;

            jQuery.each($.fn.dataTable.ext.search, function (index, value) {
                if (value.toString().includes(String(colIndex))) {
                    i = index;
                }
            });

            if (i < 0) {
                break;
            }

            $.fn.dataTable.ext.search.splice(i, 1);
        }
    }
};