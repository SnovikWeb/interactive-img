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

        $(window).resize(function () {
            var $image = $(this);
            var thisSettings = setConfig($image, settings);
            initPoints($image.find('img'), thisSettings);
        }.bind(this));

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
            var image = new Image();
            image.className = 'interactive__img';
            image.onload = function () {
                var $image = $(this).parent();
                var thisSettings = setConfig($image, settings);
                initPoints(this, thisSettings)
            }.bind(image);
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
                - ($point.height() / 2);
            left = (parseInt($point.data('ii-left')) * parseInt(img.width())
                / parseInt(imgSetting.imageWidth))
                - ($point.width() / 2);
            if (imgSetting.mode.indexOf('click') !== false) {
                $point.on('click', function (e) {
                    $point.find('.interactive-point__description').stop().toggle(imgSetting.duration);
                    $point.parent().find('.interactive-darken').stop().toggle(imgSetting.duration);
                });
            }
            if (imgSetting.mode.indexOf('hover') !== false) {
                $point.hover(function () {
                    $point.parent().find('.interactive-darken').stop().show(imgSetting.duration);
                    $point.find('.interactive-point__description').stop().show(imgSetting.duration);
                }, function () {
                    $point.parent().find('.interactive-darken').stop().hide(imgSetting.duration);
                    $point.find('.interactive-point__description').stop().hide(imgSetting.duration);
                });
            }

            $point.css({top: top, left: left});
        }
    }
})(jQuery);