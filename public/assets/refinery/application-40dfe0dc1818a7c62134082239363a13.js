$(function() {
  $logo = $('#site_bar_content #site_bar_refinery_cms_logo');
  $logo.css('left', ($('#site_bar_content').width() / 2) - ($logo.width() / 2));

  $switch_anchor = $('#editor_switch a').not('.ie7 #editor_switch a, .ie6 #editor_switch a');

  $('#editor_switch a').appendTo($('<span></span>').prependTo('#editor_switch'));
});
var shiftHeld = false;
var initialLoad = true;

init_refinery_admin = function(){
  init_interface();
  init_sortable_menu();
  init_submit_continue();
  init_modal_dialogs();
  init_tooltips();
  init_ajaxy_pagination();
};

$(document).ready(init_refinery_admin);

if(typeof(window.onpopstate) == "object"){
  $(window).bind('popstate', function(e) {
    // this fires on initial page load too which we don't need.
    if(!initialLoad) {
      $(document).paginateTo((location.pathname + location.href.split(location.pathname)[1]));
    }
    initialLoad = false;
  });
}

$.fn.paginateTo = function(stateUrl) {
  // Grab the url, ensuring not to cache.
  $.ajax({
    url: stateUrl,
    cache: false,
    success: function(data) {
      $('.pagination_container').slideTo(data);

      // remove caching _ argument.
      $('.pagination_container .pagination a').each(function(i, a){
        $(this).attr('href', $(this).attr('href').replace(/\?\_\=[^&]+&/, '?'));
      })
    },
    error: function(data) {
      window.location = popstate_location;
    }
  });
}

$.fn.slideTo = function(response) {
  $(this).html(response);
  $(this).applyMinimumHeightFromChildren();
  $(this).find('.pagination_frame').removeClass('frame_right').addClass('frame_center');
  init_modal_dialogs();
  init_tooltips();
  return $(this);
}

$.fn.applyMinimumHeightFromChildren = function() {
  child_heights = 0;
  $(this).children().each(function(i, child){
    child_heights += $(child).height();
    $.each(['marginTop', 'marginBottom', 'paddingTop', 'paddingBottom'], function(i, attr) {
      child_heights += (parseInt($(child).css(attr)) || 0);
    });
  });
  $(this).css('min-height', child_heights);
  return $(this);
}

init_modal_dialogs = function(){
  $('a[href*="dialog=true"]').not('#dialog_container a').each(function(i, anchor) {
    $(anchor).data({
      'dialog-width': parseInt($($(anchor).attr('href').match("width=([0-9]*)")).last().get(0), 10)||928
      , 'dialog-height': parseInt($($(anchor).attr('href').match("height=([0-9]*)")).last().get(0), 10)||473
      , 'dialog-title': ($(anchor).attr('title') || $(anchor).attr('name') || $(anchor).html() || null)
    }).attr('href', $(anchor).attr('href').replace(/(&(amp;)?|\?)(dialog=true|(width|height)=\d+)/g, '')
                                          .replace(/(\/[^&\?]*)&(amp;)?/, '$1?'))
    .click(function(e){
      $anchor = $(this);
      iframe_src = (iframe_src = $anchor.attr('href'))
                   + (iframe_src.indexOf('?') > -1 ? '&' : '?')
                   + 'app_dialog=true&dialog=true';

      iframe = $("<iframe id='dialog_iframe' frameborder='0' marginheight='0' marginwidth='0' border='0'></iframe>");
      iframe.dialog({
        title: $anchor.data('dialog-title')
        , modal: true
        , resizable: false
        , autoOpen: true
        , width: $anchor.data('dialog-width')
        , height: $anchor.data('dialog-height')
        , open: onOpenDialog
        , close: onCloseDialog
      });

      iframe.attr('src', iframe_src);
      e.preventDefault();
    });
  });
};

onOpenDialog = function(dialog) {
  if ($('.ui-dialog').height() < $(window).height()) {
    if(iframed()) {
      $(parent.document.body).addClass('hide-overflow');
    } else {
      $(document.body).addClass('hide-overflow');
    }
  }
};

onCloseDialog = function(dialog) {
  if(iframed()) {
    $(parent.document.body).removeClass('hide-overflow');
  } else {
    $(document.body).removeClass('hide-overflow');
  }
};

refinery_dialog_success = function(e) {
  close_dialog();

  $.ajax({
    url: window.location.pathname + window.location.search,
    cache: false,
    success: function(data) {
      $('.pagination_container').html(data);

      $('#flash_container > #flash').remove();
      $('#flash_container').append($('.pagination_container').find('#flash'));

      $('#flash').css({'width': 'auto', 'visibility': ''}).fadeIn(550);
      init_refinery_admin();
    }
  });
}

trigger_reordering = function(e, enable) {
  $menu = $("#menu");
  e.preventDefault();
  $('#menu_reorder, #menu_reorder_done').toggle();
  $('#site_bar, #content').fadeTo(500, enable ? 0.35 : 1);

  if(enable) {
    $menu.find('.tab a').click(function(ev){
      ev.preventDefault();
    });
  } else {
    $menu.find('.tab a').unbind('click');
  }

  $menu.sortable(enable ? 'enable' : 'disable');
};

trigger_reordering_content_section = function(e, enable) {
  $menu = $("#page-tabs").sortable();
  e.preventDefault();
  $('#reorder_page_part, #reorder_page_part_done').toggle();
  $('#site_bar, #menu, .field:not(:has(#page-tabs)), .page_part:visible, #more_options_field, .form-actions')
    .fadeTo(500, enable ? 0.35 : 1);

  $menu.sortable(enable ? 'enable' : 'disable').sortable({
    items: 'li',
    stop: function(event, ui) {
      $('#page-tabs li[data-index]').each(function(i, li){
        $('#page_parts_attributes_' + $(this).data('index') + '_position').val(i + 1);
      });
    }
  });
};

submit_and_continue = function(e, redirect_to) {
  visual_editor_update();

  $('#continue_editing').val(true);
  $('#flash').fadeOut(250);

  $('.fieldWithErrors').removeClass('fieldWithErrors').addClass('field');
  $('#flash_container .errorExplanation').remove();

  $.post(
    $('#continue_editing').get(0).form.action
    , $($('#continue_editing').get(0).form).serialize()
    , function(data) {
      if (($flash_container = $('#flash_container')).length > 0) {
        $flash_container.html(data);

        $('#flash').css({'width': 'auto', 'visibility': null}).fadeIn(550);

        $('.errorExplanation').not($('#flash_container .errorExplanation')).remove();

        if ((error_fields = $('#fieldsWithErrors').val()) != null) {
          $.each(error_fields.split(','), function() {
            $("#" + this).wrap("<div class='fieldWithErrors' />");
          });
        } else if (redirect_to) {
          window.location = redirect_to;
        }

        $('.fieldWithErrors:first :input:first').focus();

        $('#continue_editing').val(false);

        init_flash_messages();

        //updates the form action with new URL
        $('form').attr('action', $('#new_action').attr('value'));
      }
    }, 'html'
  );

  e.preventDefault();
};

init_tooltips = function(args){
  $($(args != null ? args : 'a[title], span[title], #image_grid img[title], *[tooltip]')).not('.no-tooltip').each(function(index, element)
  {
    // create tooltip on hover and destroy it on hoveroff.
    $(element).hover(function(e) {
      if (e.type == 'mouseenter' || e.type == 'mouseover') {
        $(this).oneTime(350, 'tooltip', $.proxy(function() {
          $('.tooltip').remove();
          tooltip = $("<div class='tooltip'><div><span></span></div></div>").appendTo('#tooltip_container');
          tooltip.find("span").html($(this).attr('tooltip'));

          tooltip_nib_image_src = $.browser.msie ? "/assets/refinery/tooltip-nib.gif" : "/assets/refinery/tooltip-nib.png";
          nib = $("<img src='" + tooltip_nib_image_src + "' class='tooltip-nib'/>").appendTo('#tooltip_container');

          tooltip.css({
            'opacity': 0
            , 'maxWidth': '300px'
          });
          required_left_offset = $(this).offset().left - (tooltip.outerWidth() / 2) + ($(this).outerWidth() / 2);
          tooltip.css('left', (required_left_offset > 0 ? required_left_offset : 0));

          var tooltip_offset = tooltip.offset();
          var tooltip_outer_width = tooltip.outerWidth();
          if (tooltip_offset && (tooltip_offset.left + tooltip_outer_width) > (window_width = $(window).width())) {
            tooltip.css('left', window_width - tooltip_outer_width);
          }

          tooltip.css({
            'top': $(this).offset().top - tooltip.outerHeight() - 10
          });

          nib.css({
            'opacity': 0
          });

          if (tooltip_offset = tooltip.offset()) {
            nib.css({
              'left': $(this).offset().left + ($(this).outerWidth() / 2) - 5
              , 'top': tooltip_offset.top + tooltip.height()
            });
          }

          try {
            tooltip.animate({
              top: tooltip_offset.top - 10
              , opacity: 1
            }, 200, 'swing');
            nib.animate({
              top: nib.offset().top - 10
              , opacity: 1
            }, 200);
          } catch(e) {
            tooltip.show();
            nib.show();
          }
        }, $(this)));
      } else if (e.type == 'mouseleave' || e.type == 'mouseout') {
        $(this).stopTime('tooltip');
        if ((tt_offset = (tooltip = $('.tooltip')).css('z-index', '-1').offset()) == null) {
          tt_offset = {'top':0,'left':0};
        }
        tooltip.animate({
          top: tt_offset.top - 20
          , opacity: 0
        }, 125, 'swing', function(){
          $(this).remove();
        });
        if ((nib_offset = (nib = $('.tooltip-nib')).offset()) == null) {
          nib_offset = {'top':0,'left':0};
        }
        nib.animate({
          top: nib_offset.top - 20
          , opacity: 0
        }, 125, 'swing', function(){
          $(this).remove();
        });
      }
    }).click(function(e) {
      $(this).stopTime('tooltip');
    });

    if ($(element).attr('tooltip') == null) {
      $(element).attr('tooltip', $(element).attr('title'));
    }
    // wipe clean the title on any children too.
    $elements = $(element).add($(element).children('img')).removeAttr('title');
    // if we're unlucky and in Internet Explorer then we have to say goodbye to 'alt', too.
    if ($.browser.msie){$elements.removeAttr('alt');}
  });
};

var link_tester = {
  email_re : new RegExp(/^([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})$/i),
  url_re : new RegExp(/^(https?|ftp):\/\/(-\.)?([^\s/?\.#-]+\.?)+(\/[^\s]*)?$/i),
  page_re : new RegExp('^(https?:\/\/' + document.location.host + '|\/[a-z0-9]+)'),

  email: function(value, callback) {
    if (value != "") {
      callback(link_tester.email_re.test(value));
    }
  },

  url: function(value, callback) {
    if (value != "") {
      if (link_tester.page_re.test(value)) {
        link_tester.page(value, callback);
      } else {
        callback(link_tester.url_re.test(value));
      }
    }
  },

  page: function(value, callback) {
    var valid = false;
    $.ajax({
      url: value,
      timeout: 5000,
      success: function() {
        valid = true;
      },
      complete: function () {
        callback(valid);
      }
    });
  },

  validate_textbox: function(validation_method, textbox_id, callback) {
    var icon = '';
    var loader_img = $("<img id='" + textbox_id.replace('#','') + "_test_loader' src='/assets/refinery/ajax-loader.gif' alt='Testing...' style='display: none;'/>");
    var result_span = $("<span id='" + textbox_id.replace('#','') + "_test_result'></span>");

    loader_img.insertAfter($(textbox_id));
    result_span.insertAfter(loader_img);
    $(textbox_id).bind('paste blur',function(){
      $(textbox_id).stop(true); // Clear the current queue; if we weren't checking yet, cancel it.
      $(textbox_id + '_test_loader').hide();
      $(textbox_id + '_test_result').hide();
      $(textbox_id + '_test_result').removeClass('success_icon').removeClass('failure_icon');

      if (this.value != "") {
        // Wait 300ms before checking.
        $(textbox_id).delay(300).queue(function () {
          $(textbox_id + '_test_loader').show();
          $(textbox_id + '_test_result').hide();
          $(textbox_id + '_test_result').removeClass('success_icon').removeClass('failure_icon');

          validation_method(this.value, function (success) {
            if (success) {
              icon = 'success_icon';
            }else{
              icon = 'failure_icon';
            }
            $(textbox_id + '_test_result').addClass(icon).show();
            $(textbox_id + '_test_loader').hide();
          });

          if (callback) { callback($(textbox_id)); }

          $(this).dequeue();
        }); // queue
      }
    }); // bind
  },

  validate_url_textbox: function(textbox_id, callback) {
    link_tester.validate_textbox(link_tester.url, textbox_id, callback);
  },

  validate_email_textbox: function(textbox_id, callback) {
    link_tester.validate_textbox(link_tester.email, textbox_id, callback);
  }

};

var link_dialog = {
  initialised: false
  , init: function(){

    if (!this.initialised) {
      this.init_tabs();
      this.init_resources_submit();
      this.init_close();
      this.page_tab();
      this.web_tab();
      this.email_tab();
      this.initialised = true;
    }
  },

  init_tabs: function(){
    var radios = $('#dialog_menu_left input:radio');
    var selected = radios.parent().filter(".selected_radio").find('input:radio').first() || radios.first();

    radios.click(function(){
      link_dialog.switch_area($(this));
    });

    selected.attr('checked', 'true');
    link_dialog.switch_area(selected);
  },

  init_resources_submit: function(){
    
    $('#existing_resource_area .form-actions-dialog #submit_button').click(function(e){
      e.preventDefault();
      if((resource_selected = $('#existing_resource_area_content ul li.linked a')).length > 0) {
        resourceUrl = parseURL(resource_selected.attr('href'));
        relevant_href = resourceUrl.pathname;

        
        // Add any alternate resource stores that need a absolute URL in the regex below
        if(resourceUrl.hostname.match(/s3.amazonaws.com/)) {
          relevant_href = resourceUrl.protocol + '//' + resourceUrl.host + relevant_href;
        }
        

        if (typeof(resource_picker.callback) == "function") {
          resource_picker.callback({
            id: resource_selected.attr('id').replace("resource_", "")
            , href: relevant_href
            , html: resource_selected.html()
          });
        }
      }

      $('.form-actions-dialog #cancel_button').trigger('click');
    });
  },

  init_close: function(){
    $('.form-actions-dialog #cancel_button').not('.visual_editor_iframe_body .form-actions-dialog #cancel_button').click(close_dialog);

    if (parent
        && parent.document.location.href != document.location.href
        && parent.document.getElementById('visual_editor_dialog_submit') != null) {
      $('#dialog_container .form-actions input#submit_button').click(function(e) {
        e.preventDefault();
        $(parent.document.getElementById('visual_editor_dialog_submit')).click();
      });
      $('#dialog_container .form-actions a.close_dialog').click(close_dialog);
    }
  },

  switch_area: function(area){
    $('#dialog_menu_left .selected_radio').removeClass('selected_radio');
    $(area).parent().addClass('selected_radio');
    $('#dialog_main .dialog_area').hide();
    $('#' + $(area).val() + '_area').show();
  },

  //Same for resources tab
  page_tab: function(){
    $('.link_list li').click(function(e){
      e.preventDefault();

      $('.link_list li.linked').removeClass('linked');
      $(this).addClass('linked');

      var link = $(this).children('a.page_link').get(0);
      var port = (window.location.port.length > 0 ? (":" + window.location.port) : "");
      var url = link.href.replace(window.location.protocol + "//" + window.location.hostname + port, "");

      link_dialog.update_parent(url, link.rel.replace(/\ ?<em>.+?<\/em>/, ''));
    });
  },

  web_tab: function(){
    link_tester.validate_url_textbox("#web_address_text", function(){});

    $('#web_address_text, #web_address_target_blank').change(function(){
      link_dialog.update_parent( $('#web_address_text').val(),
                                 $('#web_address_text').val(),
                                 $('#web_address_target_blank').get(0).checked ? "_blank" : ""
      );
    });
  },

  email_tab: function() {
    link_tester.validate_email_textbox("#email_address_text", function(){});

    $('#email_address_text, #email_default_subject_text, #email_default_body_text').change(function(e){
      var default_subject = $('#email_default_subject_text').val(),
          default_body = $('#email_default_body_text').val(),
          recipient = $('#email_address_text').val();
          modifier = "?",
          additional = "";

      if(default_subject.length > 0){
        additional += modifier + "subject=" + default_subject;
        modifier = "&";
      }

      if(default_body.length > 0){
        additional += modifier + "body=" + default_body;
        modifier = "&";
      }

      var hex_recipient = '';
      for (var i = 0; i < recipient.length; i++) {
        hex_recipient += '%' + recipient.charCodeAt(i).toString(16);
      }
      link_dialog.update_parent("mailto:" + hex_recipient + additional, recipient);
    });
  },

  update_parent: function(url, title, target) {
    if (parent != null) {
      if ((visual_editor_href = parent.document.getElementById('visual_editor_href')) != null) {
        visual_editor_href.value = url;
      }
      if ((visual_editor_title = parent.document.getElementById('visual_editor_title')) != null) {
        visual_editor_title.value = title;
      }
      if ((visual_editor_target = parent.document.getElementById('visual_editor_target')) != null) {
        visual_editor_target.value = target || "";
      }
    }
  }
};

var page_options = {
  initialised: false
  , init: function(enable_parts, new_part_url, del_part_url){

    if (!this.initialised) {
      // set the page tabs up, but ensure that all tabs are shown so that when the visual editor loads it has a proper height.
      page_options.tabs = $('#page-tabs').tabs();

      part_shown = $('#page-tabs .page_part.field').not('.ui-tabs-hide');
      $('#page-tabs .page_part.field').removeClass('ui-tabs-hide');

      this.enable_parts = enable_parts;
      this.new_part_url = new_part_url;
      this.del_part_url = del_part_url;
      this.show_options();

      $(document).ready($.proxy(function(){
        // hide the tabs that are supposed to be hidden.
        $('#page-tabs .page_part.field').not(this).addClass('ui-tabs-hide');
      }, part_shown));

      if(this.enable_parts){
        this.page_part_dialog();
      }
      this.initialised = true;
    }
  },

  show_options: function(){
    $('#toggle_advanced_options').click(function(e){
      e.preventDefault();
      $('#more_options').animate({opacity: 'toggle', height: 'toggle'}, 250);

      $('html,body').animate({
        scrollTop: $('#toggle_advanced_options').parent().offset().top
      }, 250);
    });
  },

  page_part_dialog: function(){
    $('#new_page_part_dialog').dialog({
      title: 'Create Content Section',
      modal: true,
      resizable: false,
      autoOpen: false,
      width: 600,
      height: 200
    });

    $('#add_page_part').click(function(e){
      e.preventDefault();
      $('#new_page_part_dialog').dialog('open');
    });

    $('#new_page_part_save').click(function(e){
      e.preventDefault();

      var part_title = $('#new_page_part_title').val();

      if(part_title.length > 0){
        var tab_title = part_title.toLowerCase().replace(" ", "_");

        if ($('#page_part_' + tab_title).size() === 0) {
          $.get(page_options.new_part_url, {
              title: part_title
              , part_index: $('#new_page_part_index').val()
              , body: ''
            }, function(data, status){
              $('#submit_continue_button').remove();
              // Add a new tab for the new content section.
              $('#page_part_editors').append(data);

              page_options.tabs.find("ul").append("<li><a href='#page_part_new_"+$('#new_page_part_index').val()+"'>"+part_title+"</a></li>");
              page_options.tabs.tabs("refresh");

              // this is here because of https://github.com/refinery/refinerycms/issues/2060
              $("#page-tabs #page_parts li").last().attr("data-index", $('#new_page_part_index').val());

              page_options.tabs.tabs("option", "active", -1);

              visual_editor_init();

              // Wipe the title and increment the index counter by one.
              $('#new_page_part_index').val(parseInt($('#new_page_part_index').val(), 10) + 1);
              $('#new_page_part_title').val('');

              $('#new_page_part_dialog').dialog('close');
            }, 'html'
          );
        }else{
          alert("A content section with that title already exists, please choose another.");
        }
      }else{
        alert("You have not entered a title for the content section, please enter one.");
      }
    });

    $('#new_page_part_cancel').click(function(e){
      e.preventDefault();
      $('#new_page_part_dialog').dialog('close');
      $('#new_page_part_title').val('');
    });

    $('#delete_page_part').click(function(e){
      e.preventDefault();

      var tabName = page_options.tabs.find(".ui-tabs-active a").text();

      if(confirm("This will remove the content section '" + tabName + "' immediately even if you don't save this page, are you sure?")) {
        var tabId = page_options.tabs.find('.ui-tabs-active a').attr('id').match(/\d+/)[0] - 1;

        if($('#page_parts_attributes_' + tabId + '_id').length > 0) {
          $.ajax({
            url: page_options.del_part_url + '/' + $('#page_parts_attributes_' + tabId + '_id').val(),
            type: 'DELETE'
          });
        }

        page_options.tabs.find(".ui-tabs-active").remove();
        page_options.tabs.find("#page_part_" + tabName.toLowerCase()).remove();
        page_options.tabs.find("#page_part_new_" + tabId).remove();
        $("[id^=page_parts_attributes_" + tabId + "_]").remove();
        $('#submit_continue_button').remove();

        page_options.tabs.tabs('refresh');
      }

    });

    $('#reorder_page_part').click(function(e){
      trigger_reordering_content_section(e, true);
    });
    $('#reorder_page_part_done').click(function(e){
      trigger_reordering_content_section(e, false);
    });
  }

};

// TODO:  Need to rewrite the visual editors to accept multiple images.
//        As it stands, only
//        the callback is useful when inserting multiple -- helpful for
//        the page-images and portfolio engines.

// ImageDialog
//
//   The dialog that opens when choosing to 'Add image' in WYM.
//
//   Options:
//     callback (null):
//       a function to execute upon chosing 'submit'. Passed either an
//       an array or a single image, depending on whether `multiple` is
//       true.
//     multiple (false):
//       if true, enables selection of multiple images. Does not allow
//       insertion into WYM without manual callback manipulation.
function ImageDialog(options) {
  self = this;
  this.defaults = {callback: null, multiple: false};
  this.settings = $.extend({}, this.defaults, options);

  this.create = function() {

    this.callback = this.settings.callback;
    this.init_tabs();
    this.init_select();
    this.init_actions();
  };

  this.init_tabs = function() {
    var radios = $('#dialog_menu_left input:radio');
    var selected = radios.parent().filter(".selected_radio").find('input:radio').first() || radios.first();
    radios.click(function() {
      self.switch_area($(this));
    });

    selected.attr('checked', 'true');
    self.switch_area(selected);
  };

  this.switch_area = function(radio) {
    $('#dialog_menu_left .selected_radio').removeClass('selected_radio');
    radio.parent().addClass('selected_radio');
    $('#dialog_main .dialog_area').hide();
    $('#' + radio.val() + '_area').show();
  };

  this.init_select = function() {
    $('#existing_image_area_content ul li img').click(function() {
      self.toggle_image($(this));
    });

    // Select any currently selected, just uploaded...
    if ((selected_img = $('#existing_image_area_content ul li.selected img')).length > 0) {
      self.toggle_image(selected_img.first());
    }
  };

  this.toggle_image = function(img) {
    if (img.length > 0) {
      if (!self.settings.multiple) $('#existing_image_area_content ul li.selected').removeClass('selected');

      img.parent().toggleClass('selected');
      var imageId = img.attr('data-id');
      var geometry = $('#existing_image_size_area li.selected a').attr('data-geometry');
      var size = $('#existing_image_size_area li.selected a').attr('data-size');
      var resize = $("#wants_to_resize_image").is(':checked');

      image_url = resize ? img.attr('data-' + size) : img.attr('data-original');

      if (parent) {
        if ((visual_editor_src = parent.document.getElementById('visual_editor_src')) != null) {
          visual_editor_src.value = image_url;
        }
        if ((visual_editor_title = parent.document.getElementById('visual_editor_title')) != null) {
          visual_editor_title.value = img.attr('title');
        }
        if ((visual_editor_alt = parent.document.getElementById('visual_editor_alt')) != null) {
          visual_editor_alt.value = img.attr('alt');
        }
        if ((visual_editor_size = parent.document.getElementById('visual_editor_size')) != null
            && typeof(geometry) != 'undefined') {
          visual_editor_size.value = geometry.replace(/[<>=]/g, '');
        }
      }
    }
  };

  this.submit_image_choice = function(e) {
    e.preventDefault();
    selected_images = $('#existing_image_area_content ul li.selected img');
    selected_images = self.settings.multiple ? selected_images.get() : selected_images.get(0);

    if(selected_images && $.isFunction(self.callback))
    {
      self.callback(selected_images);
    }

    close_dialog(e);
  };

  this.init_actions = function() {
    // get submit buttons not inside a visual editor iframe
    $('#existing_image_area .form-actions-dialog #submit_button')
      .not('.visual_editor_iframe_body #existing_image_area .form-actions-dialog #submit_button')
      .click($.proxy(self.submit_image_choice, self));

    // get cancel buttons not inside a visual editor iframe
    $('.form-actions-dialog #cancel_button')
      .not('.visual_editor_iframe_body .form-actions-dialog #cancel_button')
      .click($.proxy(close_dialog, self));

    $('#existing_image_size_area ul li a').click(function(e) {
      $('#existing_image_size_area ul li').removeClass('selected');
      $(this).parent().addClass('selected');
      $('#existing_image_size_area #wants_to_resize_image').attr('checked', 'checked');
      self.toggle_image($('#existing_image_area_content ul li.selected img'));
      e.preventDefault();
    });

    $('#existing_image_size_area #wants_to_resize_image').change(function(){
      if($(this).is(":checked")) {
        $('#existing_image_size_area ul li:first a').click();
      } else {
        $('#existing_image_size_area ul li').removeClass('selected');
        self.toggle_image($('#existing_image_area_content ul li.selected img'));
      }
    });

    image_area = $('#existing_image_area').not('#visual_editor_iframe_body #existing_image_area');
    image_area.find('.form-actions input#submit_button').click($.proxy(function(e) {
      e.preventDefault();
      $(this.document.getElementById('visual_editor_dialog_submit')).click();
    }, parent));
    image_area.find('.form-actions a.close_dialog').click(close_dialog);
  };
}

var image_picker = {
  initialised: false
  , options: {
    selected: ''
    , thumbnail: 'medium'
    , field: '#image'
    , image_display: '.current_picked_image'
    , no_image_message: '.no_picked_image_selected'
    , image_container: '.current_image_container'
    , remove_image_button: '.remove_picked_image'
    , picker_container: '.image_picker_container'
    , image_link: '.current_image_link'
    , image_toggler: null
  }

  , init: function(new_options){

    if (!this.initialised) {
      this.options = $.extend(this.options, new_options);
      $(this.options.picker_container).find(this.options.remove_image_button)
        .click($.proxy(this.remove_image, {container: this.options.picker_container, picker: this}));
      $(this.options.picker_container).find(this.options.image_toggler)
        .click($.proxy(this.toggle_image, {container: this.options.picker_container, picker: this}));

      this.initialised = true;
    }

    return this;
  }

  , remove_image: function(e) {
    e.preventDefault();

    $(this.container).find(this.picker.options.image_display)
      .removeClass('brown_border')
      .attr({'src': '', 'width': '', 'height': ''})
      .css({'width': 'auto', 'height': 'auto'})
      .hide();
    $(this.container).find(this.picker.options.field).val('').trigger("change");
    $(this.container).find(this.picker.options.no_image_message).show();
    $(this.container).find(this.picker.options.remove_image_button).hide();
  }

  , toggle_image: function(e) {
    $(this.container).find(this.picker.options.image_toggler).html(
      ($(this.container).find(this.picker.options.image_toggler).html() == 'Show' ? 'Hide' : 'Show')
    );
    $(this.container).find(this.picker.options.image_container).toggle();
    e.preventDefault();
  }

  , changed: function(e) {
    $(this.container).find(this.picker.options.field).val(
      this.image.id.replace("image_", "")
    ).trigger("change");

    var size = this.picker.options.thumbnail || 'original';
    this.image.src = $(this.image).attr('data-' + size);
    current_image = $(this.container).find(this.picker.options.image_display);
    current_image.replaceWith(
      $("<img src='"+this.image.src+"?"+Math.floor(Math.random() * 100000)+"' id='"+current_image.attr('id')+"' class='"+this.picker.options.image_display.replace(/^./, '')+" brown_border' />")
    );

    $(this.container).find(this.picker.options.remove_image_button).show();
    $(this.container).find(this.picker.options.no_image_message).hide();
  }
};

var resource_picker = {
  initialised: false
  , callback: null

  , init: function(callback) {

    if (!this.initialised) {
      this.callback = callback;
      this.initialised = true;
    }
  }
};

close_dialog = function(e) {
  if (iframed())
  {
    the_body = $(parent.document.body);
    the_dialog = parent.$('.ui-dialog-content');
  } else {
    the_body = $(document.body).removeClass('hide-overflow');
    the_dialog = $('.ui-dialog-content');
    the_dialog.filter(':data(dialog)').dialog('close');
    the_dialog.remove();
  }

  // if there's a visual editor involved don't try to close the dialog as visual editor will.
  if (!$(document.body).hasClass('visual_editor_iframe_body')) {
    the_body.removeClass('hide-overflow');
    the_dialog.filter(':data(dialog)').dialog('close');
    the_dialog.remove();
    if (e && e.preventDefault) {
      e.preventDefault();
    }
  }
};

//parse a URL to form an object of properties
parseURL = function(url)
{
  //save the unmodified url to href property
  //so that the object we get back contains
  //all the same properties as the built-in location object
  var loc = { 'href' : url };

  //split the URL by single-slashes to get the component parts
  var parts = url.replace('//', '/').split('/');

  //store the protocol and host
  loc.protocol = parts[0];
  loc.host = parts[1];

  //extract any port number from the host
  //from which we derive the port and hostname
  parts[1] = parts[1].split(':');
  loc.hostname = parts[1][0];
  loc.port = parts[1].length > 1 ? parts[1][1] : '';

  //splice and join the remainder to get the pathname
  parts.splice(0, 2);
  // ensure we don't destroy absolute urls like /system/images/whatever.jpg
  loc.pathname = (loc.href[0] == '/' ? ("/" + loc.host) : '');
  loc.pathname += '/' + parts.join('/');

  //extract any hash and remove from the pathname
  loc.pathname = loc.pathname.split('#');
  loc.hash = loc.pathname.length > 1 ? '#' + loc.pathname[1] : '';
  loc.pathname = loc.pathname[0];

  //extract any search query and remove from the pathname
  loc.pathname = loc.pathname.split('?');
  loc.search = loc.pathname.length > 1 ? '?' + loc.pathname[1] : '';
  loc.pathname = loc.pathname[0];

  var options = url.split('?')[1];
  loc.options = options;

  //return the final object
  return loc;
};

iframed = function() {
  return (parent && parent.document && parent.document.location.href != document.location.href && $.isFunction(parent.$));
};
$(document).ready(function(){
  $('nav#actions.multilist > ul:not(.search_list) li a[href$="' + window.location.pathname + '"]').not('.not_a_link a').parent().addClass('selected');
  if($('nav#actions.multilist > ul:not(.search_list) li.selected').length === 0) {
    $('nav#actions.multilist > ul:not(.search_list) li a:nth(1)').parent().addClass('selected');
  }

  $('nav#actions.multilist > ul:not(.search_list) li > a').not('.not_a_link a').not('a.reorder_icon').each(function(i,a){
    if ($(this).data('dialog-title') == null) {
      $(this).bind('click', function(){
        $(this).css('background-image', "url('/assets/refinery/ajax-loader.gif') !important");
      });
    }
  });

  $('ul.collapsible_menu').each(function(i, ul) {
    (first_li = $(this).children('li:first')).after(div=$("<div></div>"));

    $("<span class='arrow'>&nbsp;</span>").appendTo(first_li);

    if (($(this).children('li.selected')).length === 0) {
      div.hide();
      first_li.addClass("closed");
    }
    $(this).children('li:not(:first)').appendTo(div);

    first_li.find('> a, > span.arrow').click(function(e){
      $(this).parent().toggleClass("closed");
      $(this).parent().toggleClass("open");

      $(this).parent().next('div').animate({
          opacity: 'toggle'
          , height: 'toggle'
        }, 250, $.proxy(function(){
          $(this).css('background-image', null);
        }, $(this))
      );
      e.preventDefault();
    });
  });

  $('.success_icon, .failure_icon').bind('click', function(e) {
    $.get($(this).attr('href'), $.proxy(function(data){
      $(this).css('background-image', '')
             .removeClass('failure_icon').removeClass('success_icon')
             .addClass(data.enabled ? 'success_icon' : 'failure_icon');
    }, $(this)));
    e.preventDefault();
  });
});
(function() {
  this.init_interface = function() {
    var $menu;
    if (parent && parent.document.location.href !== document.location.href) {
      $("body#dialog_container.dialog").addClass("iframed");
    }
    $("input:submit:not(.button)").addClass("button");
    if (typeof visual_editor_init_interface_hook !== 'undefined') {
      visual_editor_init_interface_hook();
    }
    if (($menu = $("#menu")).length > 0) {
      $menu.jcarousel({
        vertical: false,
        scroll: 1,
        buttonNextHTML: "<img src='/assets/refinery/carousel-right.png' alt='down' height='15' width='10' />",
        buttonPrevHTML: "<img src='/assets/refinery/carousel-left.png' alt='up' height='15' width='10' />",
        listTag: $menu.get(0).tagName.toLowerCase(),
        itemTag: $menu.children(":first").get(0).tagName.toLowerCase()
      });
    }
    $("#current_locale li a").click(function(e) {
      $("#current_locale li a span").each(function(span) {
        return $(this).css("display", ($(this).css("display") === "none" ? "" : "none"));
      });
      $("#other_locales").animate({
        opacity: "toggle",
        height: "toggle"
      }, 250);
      $("html,body").animate({
        scrollTop: $("#other_locales").parent().offset().top
      }, 250);
      return e.preventDefault();
    });
    $("#existing_image img").load(function() {
      var margin_top;
      margin_top = $("#existing_image").height() - $("form.edit_image").height() + 8;
      if (margin_top > 0) {
        return $("form.edit_image .form-actions").css({
          "margin-top": margin_top
        });
      }
    });
    $(".form-actions .form-actions-left input:submit#submit_button").click(function(e) {
      return $("<img src='/assets/refinery/ajax-loader.gif' width='16' height='16' class='save-loader' />").appendTo($(this).parent());
    });
    $(".form-actions.form-actions-dialog .form-actions-left a.close_dialog").click(function(e) {
      var titlebar_close_button;
      titlebar_close_button = $('.ui-dialog-titlebar-close');
      if (parent) {
        titlebar_close_button = parent.$('.ui-dialog-titlebar-close');
      }
      titlebar_close_button.trigger('click');
      return e.preventDefault();
    });
    return $("a.suppress").on("click", function(e) {
      return e.preventDefault();
    });
  };

}).call(this);
(function() {
  this.init_sortable_menu = function() {
    var $menu;
    $menu = $("#menu");
    if ($menu.length === 0) {
      return;
    }
    $menu.sortable({
      items: "> *:not(#menu_reorder, #menu_reorder_done)",
      axis: "x",
      cursor: "crosshair",
      connectWith: ".nested",
      update: function() {
        return $.post("/refinery/update_menu_positions", $menu.sortable("serialize", {
          key: "menu[]",
          expression: /plugin_([\w]*)$/
        }));
      }
    }).tabs();
    $menu.sortable("disable");
    $menu.find("#menu_reorder").click(function(e) {
      return trigger_reordering(e, true);
    });
    return $menu.find("#menu_reorder_done").click(function(e) {
      return trigger_reordering(e, false);
    });
  };

}).call(this);
(function() {
  this.init_submit_continue = function() {
    var continue_editing_button;
    $("#submit_continue_button").click(submit_and_continue);
    $("form").change(function(e) {
      return $(this).attr("data-changes-made", true);
    });
    if ((continue_editing_button = $("#continue_editing")).length > 0 && continue_editing_button.attr("rel") !== "no-prompt") {
      $("#editor_switch a").click(function(e) {
        if ($("form[data-changes-made]").length > 0) {
          if (!confirm("translation missing: en.js.admin.confirm_changes")) {
            return e.preventDefault();
          }
        }
      });
    }
    return $("input[id=page_custom_slug]").change(function() {
      return $("#submit_continue_button").remove();
    });
  };

}).call(this);
(function() {
  this.init_ajaxy_pagination = function() {
    var pagination_pages;
    if (typeof window.history.pushState === "function" && $(".pagination_container").length > 0) {
      pagination_pages = $(".pagination_container .pagination a");
      pagination_pages.on("click", function(e) {
        var current_state_location, navigate_to;
        navigate_to = this.href.replace(/(\&(amp\;)?)?from_page\=\d+/, "");
        navigate_to += "&from_page=" + $(".current").text();
        navigate_to = navigate_to.replace("?&", "?").replace(/\s+/, "");
        current_state_location = location.pathname + location.href.split(location.pathname)[1];
        window.history.pushState({
          path: current_state_location
        }, "", navigate_to);
        $(document).paginateTo(navigate_to);
        return e.preventDefault();
      });
    }
    $(".pagination_container").applyMinimumHeightFromChildren();
    if ($(".pagination_container").find(".pagination").length === 0) {
      return $(".pagination_frame").css("top", "0px");
    }
  };

}).call(this);
/*







*/

;
