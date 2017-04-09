function get_selected_expand_datasets() {
    var return_indexes = [];
    var checkboxes_selected = $('.checkbox-dataset input[type=checkbox]:checked');
    for (var i = 0; i < checkboxes_selected.length; i++) {
        var index = $(checkboxes_selected[i]).val();
        if ($('.seed-dataset' + index).hasClass('in')) {
          return_indexes.push(index);
        }
    }
    return return_indexes;
}

function get_selected_collapse_datasets() {
    var return_indexes = [];
    var checkboxes_selected = $('.checkbox-dataset input[type=checkbox]:checked');
    for (var i = 0; i < checkboxes_selected.length; i++) {
        var index = $(checkboxes_selected[i]).val();
        if (!$('.seed-dataset' + index).hasClass('in')) {
          return_indexes.push(index);
        }
    }
    return return_indexes;
}

function change_expand_collapse_btns() {
    if ($('.all-datasets-checkbox').hasClass('datasets-not-checked')) {
        $('.seed-datasets-expand-checked').attr('disabled', true);
        $('.seed-datasets-collapse-checked').attr('disabled', true);
        return;
    }
    if (get_selected_expand_datasets().length == 0) {
        $('.seed-datasets-collapse-checked').attr('disabled', true);
    } else {
        $('.seed-datasets-collapse-checked').attr('disabled', false);
    }
    if (get_selected_collapse_datasets().length == 0) {
        $('.seed-datasets-expand-checked').attr('disabled', true);
    } else {
        $('.seed-datasets-expand-checked').attr('disabled', false);
    }
}

function toogle_all_datasets() {
    var datasets = $('.seed-dataset');
    var resources = $('.seed-dataset-resource');
    for (var i = 0; i<datasets.length; i++) {
        if ($(datasets[i]).hasClass('in')) {
            $(datasets[i]).removeClass('in');
            $(resources[i]).removeClass('in');
        } else if (action == 'expand') {
            if (!$(datasets[i]).hasClass('in')) {
                $(datasets[i]).addClass('in');
                $(resources[i]).addClass('in');
            }
        }
    }
}

function toogle_dataset(action, index, elem) {
    var dataset = $('.seed-dataset' + index);
    var resource = $('.seed-dataset-resource' + index);
    if (action == 'collapse') {
        $(dataset).collapse('hide');
        $(resource).collapse('hide');
        $(elem).addClass('a-collapse');
        $(elem).find('span').text('Expand');
    } else if (action == 'expand') {
        $(dataset).collapse('show');
        $(resource).collapse('show');
        $(elem).removeClass('a-collapse');
        $(elem).find('span').text('Collapse');
    }
    change_expand_collapse_btns();
}

jQuery(document).ready(function () {
    var all_checkbox = $('.all-datasets-checkbox');
    var expand_selected = $('.seed-datasets-expand-checked');
    var collapse_selected = $('.seed-datasets-collapse-checked');
    $(all_checkbox).on('click', function(event) {
        var checkboxes = $('.checkbox-dataset input[type=checkbox]');
        if ($(this).hasClass('datasets-not-checked')) {
            for (var i = 0; i < checkboxes.length; i++) {
                $(checkboxes[i]).prop('checked', true);
            }
            $(all_checkbox).removeClass('datasets-not-checked');
        } else {
            for (var i = 0; i < checkboxes.length; i++) {
                $(checkboxes[i]).prop('checked', false);
                $(all_checkbox).addClass('datasets-not-checked');
                $(expand_selected).attr('disabled', true);
                $('.seed-datasets-collapse-checked').attr('disabled', true);
            }
            if ($(all_checkbox).prop('checked')) {
                $(all_checkbox).prop('checked', false);
            }
            $(all_checkbox).removeClass('checked_minus');
        }
        change_expand_collapse_btns();
    });
    $('.checkbox-dataset input[type=checkbox]').on('click', function(event) {
        var state_checked = $(this).prop('checked');
        var datasets_checkbox_checked = $('.checkbox-dataset input[type=checkbox]:checked').length;
        var datasets_checkbox = $('.checkbox-dataset input[type=checkbox]').length;
        if (state_checked) {
            $(all_checkbox).removeClass('datasets-not-checked');
            if (datasets_checkbox_checked != datasets_checkbox) {
                $(all_checkbox).addClass('checked_minus');
                $(all_checkbox).prop('checked', true);
            } else if (datasets_checkbox_checked == datasets_checkbox) {
                $(all_checkbox).removeClass('checked_minus');
            }
        } else {
            if ($('.checkbox-dataset input[type=checkbox]:checked').length == 0) {
                $(all_checkbox).addClass('datasets-not-checked');
                if ($(all_checkbox).prop('checked')) {
                    $(all_checkbox).prop('checked', false);
                }
                $(all_checkbox).removeClass('checked_minus');
                $(expand_selected).attr('disabled', true);
                $('.seed-datasets-collapse-checked').attr('disabled', true);
            }
            if (datasets_checkbox_checked > 0 && datasets_checkbox_checked != datasets_checkbox) {
                $(all_checkbox).addClass('checked_minus');
            }
        }
        change_expand_collapse_btns();
    });
    $('.seed-dataset-accordion-btn a.a-expand').on('click', function(event) {
        var action = $(this).hasClass('a-collapse') ? 'expand' : 'collapse';
        var index = $(this).data('index');
        toogle_dataset(action, index, this);
        change_expand_collapse_btns();
    });
    $(expand_selected).on('click', function(event) {
      var indexes = get_selected_collapse_datasets();
        for (var i = 0; i < indexes.length; i++) {
          var elem = $('a.a-expand').filter("[data-index='" + indexes[i] + "']");
            toogle_dataset('expand', indexes[i], elem);
        }
    });
    $(collapse_selected).on('click', function(event) {
      var indexes = get_selected_expand_datasets();
        for (var i = 0; i < indexes.length; i++) {
          var elem = $('a.a-expand').filter("[data-index='" + indexes[i] + "']");
            toogle_dataset('collapse', indexes[i], elem);
        }
    });
});
