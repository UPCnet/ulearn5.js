$(document).ready(function (event) {
    // Load the i18n Plone catalog for ulearn
    jarn.i18n.loadCatalog('ulearn');
    _ulearn_i18n = jarn.i18n.MessageFactory('ulearn');

    // Favorites on dexterity objects
    $('#object-favorite').on('click', '.favorite', function(event) {
      event.preventDefault();
      var dexterity_url = $(this).data()['dextobject'];
      $.post(dexterity_url + '/toggle-favorite');
      if ($('i', this).hasClass('fa-star')) {
        $('i', this).addClass('fa-star-o').removeClass('fa-star');
      } else {
        $('i', this).addClass('fa-star').removeClass('fa-star-o');
      }
    });


    $(function(){

        var $username = $("#box_perfil #user h2");
        var $letters = $username.text().length;

        if (($letters >= 1) && ($letters < 10)) {
            $username.css("font-size", "20px");
        }
        else if (($letters >= 10) && ($letters < 20)) {
            $username.css("font-size", "20px");
        }
        else if (($letters >= 20) && ($letters < 30)) {
            $username.css("font-size", "16px");
        }
        else if (($letters >= 30) && ($letters < 40)) {
            $username.css("font-size", "14px");
        }
        else {
            $username.css("font-size", "20px");
        }

    });


    var delay = (function(){
      var timer = 0;
      return function(callback, ms){
        clearTimeout (timer);
        timer = setTimeout(callback, ms);
      };
    })();

    // # of thinnkinns updater
    $(window).on('maxui-posted-activity', function(event) {
        int_activities = parseInt($('.currentactivity').text(), 10);
        $('.currentactivity').text(int_activities + 1);
    });

    $('#communitylist').on('click', '.favoritedisabled', function(event) {
      event.preventDefault();
    });

    // Subscribe from button
    var subscribe_to_community = function (event, options) {
        event.preventDefault();
        $this = $(event.target);
        msgalert = "Voleu subscrivir-vos a la comunitat ";

        alertify.confirm(_ulearn_i18n(msgalert) + '"' + $this.data().name + '"?', function (e) {
            if (e) {
                // user clicked "ok"
                community_url = $this.data()['community'];
                $.ajax({
                    type: "GET",
                    url: community_url + options.wsURL,
                    error: function() {
                        alertify.error(_ulearn_i18n("Error when (un)subscribing to the community"));
                    },
                    success: function() {
                        if ($('i', $this).hasClass('fa-check-square-o')) {
                            $('i', $this).addClass('fa-square-o').removeClass('fa-check-square-o');
                            alertify.success(_ulearn_i18n("Successfully unsubscribed"));
                        } else {
                            $('i', $this).addClass('fa-check-square-o').removeClass('fa-square-o');
                            alertify.success(_ulearn_i18n("Successfully subscribed"));
                        }
                        window.location.reload(true);
                    }
                });
            } else {
                // user clicked "cancel"
            }
        });
    };


    $(".magrada a").on("click", function (event) {
        event.preventDefault();
        $anchor = $(this);
        idea_url = $(this).data()['idea'];
        $.ajax({
            type: "GET",
            url: idea_url + "/toggle_like",
            error: function() {
                alertify.error(_ulearn_i18n("Error when (un)like the proposal"));
            },
            success: function() {
                if ($('i', $anchor).hasClass('fa-heart-o')) {
                    $('i', $anchor).addClass('fa-heart').removeClass('fa-heart-o');
                    alertify.success(_ulearn_i18n("Gràcies per donar suport a aquesta idea."));
                } else {
                    $('i', $anchor).addClass('fa-heart-o').removeClass('fa-heart');
                    alertify.set({ delay: 10000 });
                    alertify.success(_ulearn_i18n("Heu cancel·lat el m'agrada d'aquesta proposta."));
                    alertify.set({ delay: 5000 });
                }
            }
        });
    });

    $(".mhiapunto a").on("click", function (event) {
        event.preventDefault();
        $anchor = $(this);
        idea_url = $(this).data()['idea'];
        $.ajax({
            type: "GET",
            url: idea_url + "/toggle_join",
            error: function() {
                alertify.error(_ulearn_i18n("Error when (un)join the proposal"));
            },
            success: function() {
                if ($('i', $anchor).hasClass('fa-sign-out')) {
                    $('i', $anchor).addClass('fa-sign-in').removeClass('fa-sign-out');
                    alertify.success(_ulearn_i18n("Heu cancel·lat la implicació a aquesta proposta."));
                } else {
                    $('i', $anchor).addClass('fa-sign-out').removeClass('fa-sign-in');
                    alertify.set({ delay: 10000 });
                    alertify.success(_ulearn_i18n("Gràcies per implicar-te en aquesta proposta. les persones que la promouen es posaran en contacte amb tu per mirar de tirar-la endavant."));
                    alertify.set({ delay: 5000 });
                }
            }
        });
    });

    // NX24 like popover specific
    $('.like_popover')
        .popover({
          html:true,
          placement:'bottom',
          content:function(){
              return $('.like_content').html();
          }
        })
        .click(function(e) { // evita scroll top
          e.preventDefault();
    });
    // NX24 join popover specific
    $('.join_popover')
        .popover({
          html:true,
          placement:'bottom',
          content:function(){
              return $('.join_content').html();
          }
        })
        .click(function(e) { // evita scroll top
          e.preventDefault();
    });

    var liveSearch = function(data_url) {
        return function findMatches(q, cb) {
          if (document.getElementById('searchbox_currentfolder_only').checked){
                cf =  $('#ulearnsearch .searchSection #searchbox_currentfolder_only').val();
          } else {
                cf = ''
          }
          $.get(data_url + '?q=' + q + '&cf=' + cf, function(data) {
            window._gw_typeahead_last_result = data;
            cb(data);
          });

        };
    };

    window._gw_typeahead_last_result = [];
    var selector = '#ulearnsearch .typeahead';
    var $typeahead_dom = $(selector);
    $typeahead_dom.typeahead({
        hint: true,
        highlight: true,
        minLength: 1
    },
    {
        name: 'states',
        displayKey: 'title',
        source: liveSearch($typeahead_dom.attr('data-typeahead-url')),
        templates: {
        suggestion: Handlebars.compile('<a class="{{class}}" href="{{itemUrl}}">{{title}}</a>'),
        empty: '<div class="tt-empty"><p>'+ window._ulearn_i18n("No hi ha elements") + '<p></div>'
    }
    }).on("typeahead:datasetRendered", function(event) {
        var $dropdown = $(this).parent().find('.tt-dropdown-menu');
        var $separator = $dropdown.find('.tt-suggestion a.with-separator').parent();
        var separator_css = {
        "border-top": ' 1px solid rgba(0, 0, 0, 0.2)',
        'background-color': "#f5f5f5",
        "padding-top": "4px"
     };

    if ($separator.is(':first-child')) {
        separator_css['border-top-left-radius']= "8px";
        separator_css['border-top-right-radius']= "8px";
        separator_css['border-top'] = "none";
        }

    $separator.css(separator_css);
    $separator = $dropdown.find('.tt-suggestion a.with-background').parent();
    $separator.css({'background-color': "#f5f5f5" });
    })
    .on("keyup", function(event) {
      if (event.keyCode === 13) {
          var text = $(this).val();
          if (document.getElementById('searchbox_currentfolder_only').checked){
            cf =  $('#ulearnsearch .searchSection #searchbox_currentfolder_only').val();
          } else {
                cf = ''
          }
          if (!_.findWhere(window._gw_typeahead_last_result, {'title': text})) {
              window.location.href = $typeahead_dom.attr('data-search-url') + '?SearchableText=' + text + '&path=' + cf;
          }
      }
    })
    .on("typeahead:selected", function(event, suggestion, dataset) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        window.location.href = suggestion.itemUrl;
    });

    // Toggle Flash in Dexterity Objects
    $('#toggle-flash').on('click', '.sliderbutton', function(event) {
      var dexterity_url = $(this).data()['dextobject'];
      $.post(dexterity_url + '/toggle_flash');
    });

    // Toggle Important in Dexterity Objects
    $('#toggle-important').on('click', '.sliderbutton', function(event) {
      var dexterity_url = $(this).data()['dextobject'];
      $.post(dexterity_url + '/toggle_important');
    });

    // Toggle List in Dexterity Objects
    $('#toggle-outoflist').on('click', '.sliderbutton', function(event) {
      var dexterity_url = $(this).data()['dextobject'];
      $.post(dexterity_url + '/toggle_outoflist');
    });

    // Toggle News in App in Dexterity News Items
    $('#toggle-newsinapp').on('click', '.sliderbutton', function(event) {
      var dexterity_url = $(this).data()['dextobject'];
      $.post(dexterity_url + '/toggle_news_in_app');
    });


});
