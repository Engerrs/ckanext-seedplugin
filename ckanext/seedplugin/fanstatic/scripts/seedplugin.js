jQuery(window).scroll(function(){
  var account = jQuery('.account-masthead').height();
  var banner = jQuery('.navbar-static-top').height();
  var sticky = jQuery('.sticky'),
      scroll = jQuery(window).scrollTop();

  if (scroll >= (account + banner)) sticky.addClass('sticky-scrolled');
  else sticky.removeClass('sticky-scrolled');
});

$( function() {
    $( "#ext_startdate" ).datepicker({
      dateFormat: "yy-mm-dd",
      showOtherMonths: true,
      selectOtherMonths: true
    });
    $('<label class="datepicker-button" for="ext_startdate"><i class="icon-th" style="position: relative;"></i></label>').insertAfter($("#ext_startdate"));
    if($('#ext_startdate_after').length > 0){
      remove_date = String(window.location.href);
      date = jQuery('#ext_startdate_after').text().trim();
      $('#ext_startdate_after a').attr('href', remove_date.replace(date, ''))
    };

    $( "#ext_enddate" ).datepicker({
      dateFormat: "yy-mm-dd",
      showOtherMonths: true,
      selectOtherMonths: true
    });
    $('<label class="datepicker-button" for="ext_enddate"><i class="icon-th" style="position: relative;"></i></label>').insertAfter($("#ext_enddate"));
    if($('#ext_enddate_after').length > 0){
      remove_date = String(window.location.href);
      date = jQuery('#ext_enddate_after').text().trim();
      $('#ext_enddate_after a').attr('href', remove_date.replace(date, ''))
    };

  var countChecked = function() {
    // sessionStorage functionality
    if (this === window && sessionStorage['all-checked'] == 'true') {
        $('#all-datasets-checkbox').prop('checked', true);
        $('#all-datasets-checkbox').removeClass('datasets-not-checked').addClass('dataset-plus');
        $('.view-map-checkbox').each(function(index, item) {
            $(item).prop('checked', true);
        });
    } else {
      var inStorage = false;

      if ($(this).hasClass('view-map-checkbox')) {
        if ($(this).prop('checked')) {
          sessionStorage.setItem(this.id, this.id);
        } else {
          sessionStorage.removeItem(this.id);
          if (sessionStorage['all-checked'] == 'true') {
            $('.view-map-checkbox').each(function(index, item) {
                $(item).prop('checked') && sessionStorage.setItem(item.id, item.id);
            });
          }
          sessionStorage['all-checked'] = false;
        }
      }

      if (this === window) {
        $('.view-map-checkbox').each(function(index, item) {
            if (sessionStorage[item.id]) {
              $(item).prop('checked', true);
              inStorage = true;
            }
        });
        inStorage && $('#all-datasets-checkbox').removeClass('datasets-not-checked').addClass('checked_minus');
      }
    }


    var inputs = $( ".view-map-checkbox:checked" );
    var map_datasets = $('.seed-view-on-map-datasets');
    var view_on_map = $('.seed-view-on-map-all');
    var expend_button =  $('.seed-datasets-expand-checked');
    var collapse_button =  $('.seed-datasets-collapse-checked');
    var n = inputs.length;
    var ctlg_layers_all = [];
    var srv_id_all = [];
    var names_all = [];
    var srv_id;
    var names;
    var srv_id_string;
    var names_string;
    var selected_datasets_number = 0;
    var selected_number = 0;

    $('.seed-view-on-map-count').text( n + ' datasets in selection').css('opacity', '0.6');
    var geocortex_base_url = $('.view-map-checkbox').map(function () {
      if($(this).data('geocortexbaseurl') != '') {
        return $(this).data('geocortexbaseurl');
      };
    }).get();
    geocortex_base_url = geocortex_base_url[0];
    var urlParams = new URLSearchParams(window.location.search);
    var page = 'page_' + String(urlParams.get('page'));
    if (n > 0) {
      $('.seed-view-on-map-count').css('opacity', '1');
      map_datasets.attr('href');
      map_datasets.attr('data-toggle', 'dropdown');
      map_datasets.removeClass('seed-disabled');
      map_datasets.attr('title', 'View selection list');
      // $('.seed-view-on-map-options').show();
      //if ($(window).width() < 979) {
          $('.seed-filter-title-mobile-desktop1199').addClass('seed-filter-title-mobile-320-979');
          $('.seed-selections-box').addClass('seed-selections-box-320-979');
    //   } else {
    //       $('.seed-filter-title-mobile-desktop1199').removeClass('seed-filter-title-mobile-320-979');
    //       $('.seed-selections-box').removeClass('seed-selections-box-320-979');
    //   }
      var obj = {};
      var list_selected_on_page = [];
      var v_m_count = 0;
      $.each($('.view-map-checkbox'), function(index, value) {
        var dataset = $(value);
        var ds_name = dataset.data('name')
        if ($(this)['0'].checked) {
          var ctlg_title = dataset.data('catalogname');
          var mapserv = dataset.data('mapservice');
          var list_name = dataset.data('listname');
          var title = dataset.data('title');
          var ds_id = dataset['0']['id'];
          var item_list = [];
            item_list.push(ctlg_title, mapserv, list_name, title, ds_name, ds_id);
            obj[ds_name] = item_list;
        }
        else {
          list_selected_on_page.push(ds_name);
        }
      });
      if (sessionStorage.all_selected_ds) {
        ds = JSON.parse(sessionStorage.getItem('all_selected_ds'));
        obj = jQuery.extend(obj, ds);
        $.each(list_selected_on_page, function(idx, value) {
          if (obj[value]){
            delete obj[value]
          };
        });
        sessionStorage.all_selected_ds = JSON.stringify(obj);
      }
      else {
        sessionStorage.setItem("all_selected_ds", JSON.stringify(obj));
      };

      d_n = Object.keys(obj).length;
      var m_s_i = [];
      var l_c_n = [];
      var l_l_n = [];
      $.each(obj, function(idx, value) {
        if (value[0] && value[1] && value[2]) {
          v_m_count += 1;
          l_c_n.push(value[0]);
          m_s_i.push(value[1]);
          l_l_n.push(value[2]);
        };
      });

      if (m_s_i.length > 0 && l_l_n.length > 0 && l_c_n.length > 0) {
        n_datasets_wom = m_s_i.filter(String).length
        var mservices = m_s_i.filter(function(elem, index, self) {
            return index == self.indexOf(elem);
        })
        mservices = mservices.join(',');
        var all_fields = [];
        for (var i = 0; i < n_datasets_wom; i++) {
          all_fields.push([l_c_n[i], m_s_i[i],l_l_n[i]])
        }
        var srv_ids = []
        var names_list = []
        var ctlg_layers_items = []
        $.each(all_fields, function(idx, value) {
          var ctlg_name = value[0];
          if (String(value[1]).indexOf("&") > -1) {
            srv_id = value[1].split('&');
            srv_id_string = srv_id.join(',');
          }
          else {
            srv_id = [value[1]];
            srv_id_string = srv_id.join(',');
          };
          if (String(value[2]).indexOf("&") > -1) {
            names = value[2].split('&');
            names_string = names.join(',');
          }
          else {
            names = [value[2]];
            names_string = names.join(',');
          };
          srv_ids.push(srv_id_string);
          names_list.push(names_string);
          $.each(names, function(index, values) {
            values = values.split(',');
            $.each(values, function(i, value) {
              ctlg_layers_items.push(ctlg_name + '.' + srv_id[index] + '.' + value)
              });
            });
        });
        data1 = [ctlg_layers_items];
      }
      else {
        if(!$('.seed-view-on-map-all').hasClass('seed-disabled')){
          view_on_map.removeAttr('href').addClass('seed-disabled').attr('title', 'Select an item with View on Map to make available');
          map_datasets.removeAttr('href').removeAttr('data-toggle').addClass('seed-disabled').attr('title', 'Select to make available');
        }
      }
      $('.seed-selected-datasets-list').empty();
      $.each(obj, function( index, value ) {
        $('.seed-selected-datasets-list').append("<li>" + value[3] + "<a class='seed-remove-selected-item' data-name="+ value[4] +" title='Remove dataset from selection'><span class='icon-remove-sign'></span></a></li>");
      });
      $('.seed-view-on-map-count').text(d_n + ' datasets in selection');
        main_link = geocortex_base_url + '&runWorkflow=AppendLayerCatalog&CatalogLayer=' + data1.join(','); //  + '&MapServiceID=' + srv_id_all.join(',') + '&LayerListName=' + names_all.join(',')
        view_on_map.removeClass('seed-disabled');
        view_on_map.attr('href', main_link);
        view_on_map.attr('title', 'Show selected Dataset on Map');
        map_datasets.attr('href');
        map_datasets.attr('data-toggle', 'dropdown');
        map_datasets.removeClass('seed-disabled');
        map_datasets.attr('title', 'View selection list');
        $('.seed-view-on-map-count').append('<span title="Number of datasets with View on Map url."> ('+ v_m_count +')</span>');
    }
    else {
        if (sessionStorage.all_selected_ds) {
          obj = JSON.parse(sessionStorage.getItem('all_selected_ds'));
          if (Object.keys(obj).length != 0) {
            $.each($('.view-map-checkbox'), function(index, value) {
              var dataset = $(value);
              var ds_name = dataset.data('name');
              if (obj[ds_name]){
                delete obj[ds_name]
              };
            });
            d_n = Object.keys(obj).length;
            var v_m_count = 0;
            var m_s_i = [];
            var l_c_n = [];
            var l_l_n = [];
            $.each(obj, function(idx, value) {
              if (value[0] && value[1] && value[2]) {
                v_m_count += 1;
                l_c_n.push(value[0]);
                m_s_i.push(value[1]);
                l_l_n.push(value[2]);
              };
            });
            if (m_s_i.length > 0 && l_l_n.length > 0 && l_c_n.length > 0) {
              n_datasets_wom = m_s_i.filter(String).length
              var mservices = m_s_i.filter(function(elem, index, self) {
                  return index == self.indexOf(elem);
              })
              mservices = mservices.join(',');
              var all_fields = [];
              for (var i = 0; i < n_datasets_wom; i++) {
                all_fields.push([l_c_n[i], m_s_i[i],l_l_n[i]])
              }
              var srv_ids = []
              var names_list = []
              var ctlg_layers_items = []
              $.each(all_fields, function(idx, value) {
                var ctlg_name = value[0];
                if (String(value[1]).indexOf("&") > -1) {
                  srv_id = value[1].split('&');
                  srv_id_string = srv_id.join(',');
                }
                else {
                  srv_id = [value[1]];
                  srv_id_string = srv_id.join(',');
                };
                if (String(value[2]).indexOf("&") > -1) {
                  names = value[2].split('&');
                  names_string = names.join(',');
                }
                else {
                  names = [value[2]];
                  names_string = names.join(',');
                };
                srv_ids.push(srv_id_string);
                names_list.push(names_string);
                $.each(names, function(index, values) {
                  values = values.split(',');
                  $.each(values, function(i, value) {
                    ctlg_layers_items.push(ctlg_name + '.' + srv_id[index] + '.' + value)
                    });
                  });
              });
              data1 = [ctlg_layers_items];
              $('.seed-selected-datasets-list').empty();
              $.each(obj, function( index, value ) {
                $('.seed-selected-datasets-list').append("<li>" + value[3] + "<a class='seed-remove-selected-item' data-name="+ value[4] +" title='Remove dataset from selection'><span class='icon-remove-sign'></span></a></li>");
              });
              $('.seed-view-on-map-count').text(d_n + ' datasets in selection');
              main_link = geocortex_base_url + '&runWorkflow=AppendLayerCatalog&CatalogLayer=' + data1.join(','); //  + '&MapServiceID=' + srv_id_all.join(',') + '&LayerListName=' + names_all.join(',')
              view_on_map.removeClass('seed-disabled');
              view_on_map.attr('href', main_link);
              view_on_map.attr('title', 'Show selected Dataset on Map');
              map_datasets.attr('href');
              map_datasets.attr('data-toggle', 'dropdown');
              map_datasets.removeClass('seed-disabled');
              map_datasets.attr('title', 'View selection list');
              $('.seed-view-on-map-count').append('<span title="Number of datasets with View on Map url."> ('+ v_m_count +')</span>');
            }
        } else {
          view_on_map.removeAttr('href').addClass('seed-disabled').attr('title', 'Select an item with View on Map to make available');
          map_datasets.removeAttr('href').removeAttr('data-toggle').addClass('seed-disabled').attr('title', 'Select to make available');
          $('.seed-filter-title-mobile-desktop1199').removeClass('seed-filter-title-mobile-320-979');
          $('.seed-selections-box').removeClass('seed-selections-box-320-979');
        }
      }
      else {
        view_on_map.removeAttr('href').addClass('seed-disabled').attr('title', 'Select an item with View on Map to make available');
        map_datasets.removeAttr('href').removeAttr('data-toggle').addClass('seed-disabled').attr('title', 'Select to make available');
        $('.seed-filter-title-mobile-desktop1199').removeClass('seed-filter-title-mobile-320-979');
        $('.seed-selections-box').removeClass('seed-selections-box-320-979');
      }
    };

    if(expend_button.hasClass('seed-disable')){
      expend_button.attr('title', 'Select a collapsed item to make available');
    }
    else {
      expend_button.attr('title', 'Expand selection');
    };
    if(collapse_button.hasClass('seed-disable')){
      collapse_button.attr('title', 'Selected an expanded item to make available');
    }
    else {
      collapse_button.attr('title', 'Collapse selection');
    };

  };
  countChecked();

  $( ".view-map-checkbox" ).on( "click", countChecked );

  $('.all-datasets-checkbox ').on('change', function(){
    if(!$('#all-datasets-checkbox').prop('checked')) {
      sessionStorage.setItem('all-checked', false);
      $( "input[type='checkbox'].view-map-checkbox" ).prop('checked', false);
      var inputs = $( ".view-map-checkbox:checked" );
      var n = inputs.length;
      $('.seed-view-on-map-count').text( n + ' datasets in selection').css('opacity', '0.6');
      // $('.seed-view-on-map-options').hide();
      //if ($(window).width() < 979) {
      $('.seed-filter-title-mobile-desktop1199').removeClass('seed-filter-title-mobile-320-979');
      $('.seed-selections-box').removeClass('seed-selections-box-320-979');
       countChecked.call(this);
     //}
    }
    else {
      // sessionStorage.clear();
      sessionStorage.setItem('all-checked', true);
      $( "input[type='checkbox'].view-map-checkbox" ).prop('checked', true);
      var inputs = $( ".view-map-checkbox:checked" );
      var n = inputs.length;
      $('.seed-view-on-map-count').text( n + ' datasets in selection').css('opacity', '0.6');
      countChecked.call(this);
    }
  });

  $("body").on("click", ".seed-remove-selected-item", function() {
    var name = $(this).data('name');
    obj = JSON.parse(sessionStorage.getItem('all_selected_ds'));
    if (obj[name]){
      if (sessionStorage[obj[name][5]]) {
        delete sessionStorage[obj[name][5]]
      };
      delete obj[name];
      sessionStorage.all_selected_ds = JSON.stringify(obj);
    }
    if ($("body").find("input[data-name='" + name + "']").length > 0) {
      if (Object.keys(obj).length == 0) {
        $("body").find(".seed-view-on-map-datasets").click();
      };
      $("body").find("input[data-name='" + $(this).data('name') + "']").click();
      $("body").find(".seed-view-on-map-datasets").click();
    }
    else {
      if (Object.keys(obj).length == 0) {
        $("body").find(".seed-view-on-map-datasets").click();
      };
      countChecked();

    }
  });

  $('body').on('click','.seed-selected-datasets-list', function(e){
    e.stopPropagation();
  });


  $('body').on('change','#select_lga', function(event){
    populateFormats($(event.target).val());
  });

  function populateFormats(lganame) {
    $.ajax({
        beforeSend: function (jqXHR,settings) {
          $('.seed-loading-message').show();
        },
        url: "https://maps.six.nsw.gov.au/arcgis/rest/services/public/NSW_Administrative_Boundaries/MapServer/1/query?where=lganame=%27"+lganame+"%27&geometryType=esriGeometryEnvelope&spatialRel=esriSpatialRelIntersects&outFields=lganame&returnGeometry=true&outSR=4326&returnDistinctValues=false&f=pjson",
        error: function (error) {
            console.log(error);
        },
        dataType: 'json',
        success: function (data) {

            var features = data.features;
            var queryStr_bbox = "";
            if (features[0]) {
                var polygonJson = features[0].geometry;

                xmax = polygonJson['rings'][0].reduce(function(max, arr) {
                    return max >= arr[0] ? max : arr[0];
                });
                ymax = polygonJson['rings'][0].reduce(function(max, arr) {
                    return max >= arr[1] ? max : arr[1];
                });
                xmin = polygonJson['rings'][0].reduce(function(min, arr) {
                    return min <= arr[0] ? min : arr[0];
                });
                ymin = polygonJson['rings'][0].reduce(function(min, arr) {
                    return min <= arr[1] ? min : arr[1];
                });
                var bbox_Str = xmin + "," + ymin + "," + xmax + "," + ymax;
                queryStr_bbox = bbox_Str;
            }
            $('#seed_ext_bbox').val(queryStr_bbox);
        },
        type: 'GET',
        complete: function (jqXHR, textStatus) {
          if (textStatus == 'success') {
            $('.seed-loading-message').hide();
          };
        }
    });
  }

});

$(document).ready(function () {
  jQuery('.seed-filters-collapsing').children().each(function(index, el) {
    if(jQuery(this).find('li').hasClass('active')) {
      jQuery(this).find('h2').removeClass('collapsed');
      jQuery(this).find('ul').addClass('in')
    }
  });

  populateLGANames();
  function populateLGANames() {
    $.ajax({
        url: 'https://maps.six.nsw.gov.au/arcgis/rest/services/public/NSW_Administrative_Boundaries/MapServer/1/query?where=1%3D1&text=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=lganame&returnGeometry=false&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&returnDistinctValues=false&resultOffset=&resultRecordCount=&f=json',

        error: function (error) {

            console.log(error);
        },
        dataType: 'json',
        success: function (data) {
            var features = data.features;
            var lgaNames = [];

            for (index in features) {
                lgaNames.push(features[index].attributes.lganame);

            }
            lgaNames.sort(function (a, b) {
                return a.localeCompare(b, 'en', { 'sensitivity': 'base' });
            });
            var urlParams = new URLSearchParams(window.location.search);
            var lganame_param = urlParams.get('lga');
            for (index in lgaNames) {
                var lga_name = lgaNames[index].split(' ').join('+');
                if (lganame_param == lgaNames[index]) {
                  $('#select_lga').append('<option value="' + lgaNames[index] + '" aria-label="' + lgaNames[index] + '" selected="selected">' + lgaNames[index] + '</option>');
                  var bbox_param = urlParams.get('ext_bbox');
                  if (bbox_param != '' ) {
                    $('#seed_ext_bbox').val(bbox_param);
                  };
                }
                else {
                  $('#select_lga').append('<option value="' + lgaNames[index] + '" aria-label="' + lgaNames[index] + '" >' + lgaNames[index] + '</option>');
                };
            }
        },
        type: 'GET'
    });
  }

});
