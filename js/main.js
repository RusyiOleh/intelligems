// Global parameters
window.params = {
    isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
    isIOS: /iPhone|iPad|iPod/i.test(navigator.userAgent)
};


/**
     *
     * Check if element exist on page
     *
     * @param el {string} jQuery object (#popup)
     *
     * @return {bool}
     *
*/
function exist(el){
    if ( $(el).length > 0 ) {
        return true;
    } else {
        return false;
    }
}


jQuery(document).ready(function($) {

    $(".header").headroom();

    /*---------------------------
                                PAGE ANCHORS
    ---------------------------*/
    $('.anchor').click(function() {
        $('html, body').animate({
            scrollTop: $($(this).attr('href')).offset().top - 50
        }, 800);
        return false;
    });

    $('.text-navigation a').click(function() {
        var selfel = $(this),
            target = selfel.parent().attr('href'),
            to = $( selfel.attr('href') );

        $(target).mCustomScrollbar("scrollTo", $(target).find('.mCSB_container').find(to));
        selfel.parent().find('a').removeClass('active');
        selfel.addClass('active');
        return false;
    });

    /*---------------------------
                                  MENU TOGGLE
    ---------------------------*/
    $('.js-toggle-menu').on('click', function(event) {
        event.preventDefault();
        $(this).toggleClass('is-active');
        $(this).siblings('header').toggleClass('open');
    });



    /*---------------------------
                                  Fancybox
    ---------------------------*/
    $('.fancybox').fancybox({});


    /*---------------------------
                                  PORTFOLIO MIXING
    ---------------------------*/
    if (exist($('.mix-container'))) {
        var mixer = mixitup('.mix-container', {
            animation: {
                "duration": 500
            }}
        );
        var visEl = [];
        $('.mix-container').on('mixEnd', function() {
            $('.portfolio-grid__item:visible').each(function(){
                $(this).removeClass('g-1 g-3 g-7');
                visEl.push($(this));
            });
            for ($i = 1; $i <= visEl.length; $i++) {
                if (($i - 1) % 10 === 0 || $i === 1) {
                  visEl[$i - 1].addClass('g-1');
                }
                if (($i - 3) % 10 === 0 || $i === 3) {
                    visEl[$i - 1].addClass('g-3');
                }
                if (($i - 7) % 10 === 0 || $i === 7) {
                    visEl[$i - 1].addClass('g-7');
                }
            }
            visEl = [];
        });

        var count = 1;
        $('.portfolio-grid__item').each(function(){
            if ((count - 1) % 10 === 0 || count === 1) {
              $(this).addClass('g-1');
            }
            if ((count - 3) % 10 === 0 || count === 3) {
                $(this).addClass('g-3');
            }
            if ((count - 7) % 10 === 0 || count === 7) {
                $(this).addClass('g-7');
            }
            count++;
        });
    }

    /*---------------------------
                                  SLIDERS
    ---------------------------*/
    $('.blog-slider').slick({
        arrows: true,
        dots: true,
        slidesToShow: 4,
        slidesToScroll: 1
    });

    $('.work-slider').slick({
        arrows: true,
        dots: true,
        fade: true,
         adaptiveHeight: true
    });

    $('.offer-slider').slick({
        arrows: true,
        dots: true,
        fade: true,
        adaptiveHeight: true
    });

    $('.gallery-slider').slick({
        arrows: true,
        dots: false,
        adaptiveHeight: true
    });

    $('.imgTextSlider').slick({
        arrows: true,
        dots: false,
        fade: true,
        adaptiveHeight: true
    });

    /*---------------------------
                                  Custom scollbar
    ---------------------------*/
    $(".custom-scrollbar").mCustomScrollbar({
        theme:"rounded-dark",
            callbacks:{
            onScroll:function(){
                if ($(this).hasClass('text-for-navigation')) {
                    myCustomFn(this, $(this).attr('id'));
                }
            }
        }
    });

    function myCustomFn(el, nav){
        $(el).find('.mCSB_container').children().each(function(){
            var topOfEl = $(this).position().top - 50;
            var topOfNext = 3000;
            if ($(this).next().length) {
                topOfNext = $(this).next().position().top;
            }
            var scrolled = Math.abs(el.mcs.top);
            var link = '';
            if (scrolled >= topOfEl && scrolled < topOfNext ) {
                link = $(this).attr('id');
                $('[href="#' + nav + '"]').find('a').removeClass('active');
                $('[href="#' + nav + '"]').find($('[href="#' + link + '"]')).addClass('active');
            }
        });
    }




    function openPopup(popup){
        $.fancybox.open([
            {
                src  : popup,
                type: 'inline',
                opts : {}
            }
        ], {
            loop : false
        });
    }

    /*---------------------------
                                  Form submit
    ---------------------------*/
    $('.ajax-form').on('submit', function(event) {
        event.preventDefault();
        var data = new FormData(this);
        $(this).find('button').prop('disabled', true);
        $.ajax({
            url: theme.url + '/forms.php',
            type: 'POST',
            data: data,
            cache: false,
            contentType: false,
            processData: false,
            success: function(result) {
                if (result.status == 'ok') {
                    openPopup('#modal-popup-ok')
                } else {
                    openPopup('#modal-popup-error')
                }
            },
            error: function(result) {
                openPopup('#modal-popup-error');
            }
        }).always(function() {
            $('form').each(function(index, el) {
                $(this)[0].reset();
                $(this).find('button').prop('disabled', false);
            });
        });
    });



    /*---------------------------
                                  Google map init
    ---------------------------*/
    var map;
    function googleMap_initialize() {
        var lat = $('#map_canvas').data('lat');
        var long = $('#map_canvas').data('lng');

        var mapCenterCoord = new google.maps.LatLng(lat, long);
        var mapMarkerCoord = new google.maps.LatLng(lat, long);

        var styles = [];

        var mapOptions = {
            center: mapCenterCoord,
            zoom: 16,
            //draggable: false,
            disableDefaultUI: true,
            scrollwheel: false,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);

        var styledMapType=new google.maps.StyledMapType(styles,{name:'Styled'});
        map.mapTypes.set('Styled',styledMapType);
        map.setMapTypeId('Styled');

        var markerImage = new google.maps.MarkerImage('images/location.png');
        var marker = new google.maps.Marker({
            icon: markerImage,
            position: mapMarkerCoord, 
            map: map,
            title:"Site Title"
        });
        
        $(window).resize(function (){
            map.setCenter(mapCenterCoord);
        });
    }

    if ( exist( '#map_canvas' ) ) {
        googleMap_initialize();
    }

}); // end file