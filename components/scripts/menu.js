jQuery(function ($) {
    $( window ).resize(function() {
        if ($(window).width() > 569) {
            $('.menu').show();
        }
    });

    $('.btn-block__menu-btn').on('click', function (e) {
        $('.menu').toggle();

        $(document).on('click.menu-btn', function (e) {
            if (!$(e.target).hasClass('btn-block__menu-btn') &&
                !$(e.target).closest('.menu').length) {
                $('.menu').toggle();

                $(document).off('click.menu-btn');
            }
        });
    });
});