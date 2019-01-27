(function ($) {
    $.fn.interactiveImg = function (options) {
        var settings = $.extend(
            {
                imageWidth: 0,
                imageHeight: 0,
                mode: 'hover click',
                duration: 300,
            },
            options
        );

        return this.each(initImage);

        function setConfig(obj, config) {
            var innerSetting = config;
            innerSetting.imageWidth = obj.data('ii-width') ? obj.data('ii-width') : innerSetting.imageWidth;
            innerSetting.imageHeight = obj.data('ii-height') ? obj.data('ii-height') : innerSetting.imageHeight;
            innerSetting.mode = obj.data('ii-mode') ? obj.data('ii-mode') : innerSetting.mode;
            innerSetting.duration = obj.data('ii-duration') ? obj.data('ii-duration') : innerSetting.duration;
            return innerSetting;
        }

        function initImage() {
            var $image = $(this);
            $(window).resize(function () {
                var $image = $(this);
                console.log($image);
                var thisSettings = setConfig($image, settings);
                initPoints($image.find('img'), thisSettings);
            }.bind($image));
            var image = new Image();
            image.className = 'interactive__img';
            image.onload = function () {
                var $image = $(this);
                var thisSettings = setConfig($image, settings);
                initPoints($image.find('img'), thisSettings)
            }.bind($image);
            image.src = $image.data('ii-src');
            $image.append($(image));
            $image.append('<div class="interactive-darken" style="display: none;"></div>');
        }

        function initPoints(img, imgSettings) {
            var $points = $(img).parent().find('.interactive-point');
            $points.each(function () {
                initPoint(this, imgSettings);
            });
        }

        function initPoint(point, imgSetting) {
            var $point = $(point);
            $point.off();
            var top, left;
            var img = $point.parents('.interactive').find('img.interactive__img');
            top = (parseInt($point.data('ii-top')) * parseInt(img.height())
                / parseInt(imgSetting.imageHeight))
                - ($point.innerHeight() / 2);
            left = (parseInt($point.data('ii-left')) * parseInt(img.width())
                / parseInt(imgSetting.imageWidth))
                - ($point.innerWidth() / 2);
            descriptionPos($point);
            $(window).resize(function () {
                correctionPos($point);
            });
            if (imgSetting.mode.indexOf('click') !== false) {
                $point.on('click', function (e) {
                    var $darken = $point.parent().find('.interactive-darken');
                    $point.parent().append($darken);
                    $point.parent().append($point);
                    $darken.stop().toggle(imgSetting.duration);
                    $point.find('.interactive-point__description').stop().toggle(imgSetting.duration, function () {
                        if ($(window).width() <= 992) {
                            correctionPos($point);
                        }
                    });
                });
            }
            if (imgSetting.mode.indexOf('hover') !== false && $(window).width() > 992) {
                $point.hover(function () {
                    var $darken = $point.parent().find('.interactive-darken');
                    $point.parent().append($darken);
                    $point.parent().append($point);
                    $darken.stop().show(imgSetting.duration);
                    $point.find('.interactive-point__description').stop().show(imgSetting.duration);
                }, function () {
                    $point.parent().find('.interactive-darken').stop().hide(imgSetting.duration);
                    $point.find('.interactive-point__description').stop().hide(imgSetting.duration);
                });
            }

            $point.css({top: top, left: left});
        }

        function descriptionPos($point) {
            var desc = $point.find('.interactive-point__description');
            var desc_pos = $point.data('ii-position') ? $point.data('ii-position') : 'bottom';
            switch (desc_pos) {
                case 'top':
                    desc.addClass('interactive-point__description--top');
                    desc.css('margin', '-' + (desc.innerHeight() + $point.height() * 1.5) + 'px 0 0 -' + (desc.innerWidth() / 2 - $point.width() / 2) + 'px');
                    break;
                case 'bottom':
                    desc.addClass('interactive-point__description--bottom');
                    desc.css('margin', ($point.height() / 2) + 'px 0 0 -' + (desc.innerWidth() / 2 - $point.width() / 2) + 'px');
                    break;
                case 'right':
                    desc.addClass('interactive-point__description--right');
                    desc.css('margin', '-' + (desc.innerHeight() / 2 + $point.height() / 2) + 'px 0 0 ' + $point.width() * 1.5 + 'px');
                    break;
                case 'left':
                    desc.addClass('interactive-point__description--left');
                    desc.css('margin', '-' + (desc.innerHeight() / 2 + $point.height() / 2) + 'px 0 0 -' + (desc.innerWidth() + $point.width() / 2) + 'px');
                    break;
            }
        }

        function correctionPos($point) {
            var desc = $point.find('.interactive-point__description');
            if (desc.offset().top < 0)
                desc.css('margin-top', (parseInt(desc.css('margin-top')) + Math.abs(desc.offset().top)) + 'px');
            if (desc.offset().left < 0)
                desc.css('margin-left', (parseInt(desc.css('margin-left')) + Math.abs(desc.offset().left)) + 'px');
            if ($(window).width() - (desc.offset().left + desc.width()) < 0) {
                desc.css('margin-left', (parseInt(desc.css('margin-left')) - Math.abs(($(window).width() - (desc.offset().left + desc.width()))) - parseInt(desc.css('padding-right')) - parseInt(desc.css('padding-left'))) + 'px');
            }
        }

    }
})(jQuery);