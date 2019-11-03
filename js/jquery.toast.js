// jQuery toast plugin created by Kamran Ahmed copyright MIT license 2015
if ( typeof Object.create !== 'function' ) {
    Object.create = function( obj ) {
        function F() {}
        F.prototype = obj;
        return new F();
    };
}

(function( $, window, document, undefined ) {

    "use strict";
    
    var Toasts = {

        _positionClasses : ['bottom-left', 'bottom-right', 'top-right', 'top-left', 'bottom-center', 'top-center', 'mid-center'],
        _defaultIcons : ['success', 'error', 'info', 'warning'],

        init: function (options, elem) {
            this.prepareOptions(options, $.toasts.options);
            this.process();
        },

        prepareOptions: function(options, options_to_extend) {
            var _options = {};
            if ( ( typeof options === 'string' ) || ( options instanceof Array ) ) {
                _options.text = options;
            } else {
                _options = options;
            }
            this.options = $.extend( {}, options_to_extend, _options );
        },

        process: function () {
            this.setup();
            this.addToDom();
            this.position();
            this.bindtoasts();
            this.animate();
        },

        setup: function () {
            
            var _toastsContent = '';
            
            this._toastsEl = this._toastsEl || $('<div></div>', {
                class : 'jq-toasts-single'
            });

            // For the loader on top
            _toastsContent += '<span class="jq-toasts-loader"></span>';            

            if ( this.options.allowtoastsClose ) {
                _toastsContent += '<span class="close-jq-toasts-single">&times;</span>';
            };

            if ( this.options.text instanceof Array ) {

                if ( this.options.heading ) {
                    _toastsContent +='<h2 class="jq-toasts-heading">' + this.options.heading + '</h2>';
                };

                _toastsContent += '<ul class="jq-toasts-ul">';
                for (var i = 0; i < this.options.text.length; i++) {
                    _toastsContent += '<li class="jq-toasts-li" id="jq-toasts-item-' + i + '">' + this.options.text[i] + '</li>';
                }
                _toastsContent += '</ul>';

            } else {
                if ( this.options.heading ) {
                    _toastsContent +='<h2 class="jq-toasts-heading">' + this.options.heading + '</h2>';
                };
                _toastsContent += this.options.text;
            }

            this._toastsEl.html( _toastsContent );

            if ( this.options.bgColor !== false ) {
                this._toastsEl.css("background-color", this.options.bgColor);
            };

            if ( this.options.textColor !== false ) {
                this._toastsEl.css("color", this.options.textColor);
            };

            if ( this.options.textAlign ) {
                this._toastsEl.css('text-align', this.options.textAlign);
            }

            if ( this.options.icon !== false ) {
                this._toastsEl.addClass('jq-has-icon');

                if ( $.inArray(this.options.icon, this._defaultIcons) !== -1 ) {
                    this._toastsEl.addClass('jq-icon-' + this.options.icon);
                };
            };

            if ( this.options.class !== false ){
                this._toastsEl.addClass(this.options.class)
            }
        },

        position: function () {
            if ( ( typeof this.options.position === 'string' ) && ( $.inArray( this.options.position, this._positionClasses) !== -1 ) ) {

                if ( this.options.position === 'bottom-center' ) {
                    this._container.css({
                        left: ( $(window).outerWidth() / 2 ) - this._container.outerWidth()/2,
                        bottom: 20
                    });
                } else if ( this.options.position === 'top-center' ) {
                    this._container.css({
                        left: ( $(window).outerWidth() / 2 ) - this._container.outerWidth()/2,
                        top: 20
                    });
                } else if ( this.options.position === 'mid-center' ) {
                    this._container.css({
                        left: ( $(window).outerWidth() / 2 ) - this._container.outerWidth()/2,
                        top: ( $(window).outerHeight() / 2 ) - this._container.outerHeight()/2
                    });
                } else {
                    this._container.addClass( this.options.position );
                }

            } else if ( typeof this.options.position === 'object' ) {
                this._container.css({
                    top : this.options.position.top ? this.options.position.top : 'auto',
                    bottom : this.options.position.bottom ? this.options.position.bottom : 'auto',
                    left : this.options.position.left ? this.options.position.left : 'auto',
                    right : this.options.position.right ? this.options.position.right : 'auto'
                });
            } else {
                this._container.addClass( 'bottom-left' );
            }
        },

        bindtoasts: function () {

            var that = this;

            this._toastsEl.on('afterShown', function () {
                that.processLoader();
            });

            this._toastsEl.find('.close-jq-toasts-single').on('click', function ( e ) {

                e.preventDefault();

                if( that.options.showHideTransition === 'fade') {
                    that._toastsEl.trigger('beforeHide');
                    that._toastsEl.fadeOut(function () {
                        that._toastsEl.trigger('afterHidden');
                    });
                } else if ( that.options.showHideTransition === 'slide' ) {
                    that._toastsEl.trigger('beforeHide');
                    that._toastsEl.slideUp(function () {
                        that._toastsEl.trigger('afterHidden');
                    });
                } else {
                    that._toastsEl.trigger('beforeHide');
                    that._toastsEl.hide(function () {
                        that._toastsEl.trigger('afterHidden');
                    });
                }
            });

            if ( typeof this.options.beforeShow == 'function' ) {
                this._toastsEl.on('beforeShow', function () {
                    that.options.beforeShow(that._toastsEl);
                });
            };

            if ( typeof this.options.afterShown == 'function' ) {
                this._toastsEl.on('afterShown', function () {
                    that.options.afterShown(that._toastsEl);
                });
            };

            if ( typeof this.options.beforeHide == 'function' ) {
                this._toastsEl.on('beforeHide', function () {
                    that.options.beforeHide(that._toastsEl);
                });
            };

            if ( typeof this.options.afterHidden == 'function' ) {
                this._toastsEl.on('afterHidden', function () {
                    that.options.afterHidden(that._toastsEl);
                });
            };

            if ( typeof this.options.onClick == 'function' ) {
                this._toastsEl.on('click', function () {
                    that.options.onClick(that._toastsEl);
                });
            };    
        },

        addToDom: function () {

             var _container = $('.jq-toasts-wrap');
             
             if ( _container.length === 0 ) {
                
                _container = $('<div></div>',{
                    class: "jq-toasts-wrap"
                });

                $('body').append( _container );

             } else if ( !this.options.stack || isNaN( parseInt(this.options.stack, 10) ) ) {
                _container.empty();
             }

             _container.find('.jq-toasts-single:hidden').remove();

             _container.append( this._toastsEl );

            if ( this.options.stack && !isNaN( parseInt( this.options.stack ), 10 ) ) {
                
                var _prevtoastsCount = _container.find('.jq-toasts-single').length,
                    _exttoastsCount = _prevtoastsCount - this.options.stack;

                if ( _exttoastsCount > 0 ) {
                    $('.jq-toasts-wrap').find('.jq-toasts-single').slice(0, _exttoastsCount).remove();
                };

            }

            this._container = _container;
        },

        canAutoHide: function () {
            return ( this.options.hideAfter !== false ) && !isNaN( parseInt( this.options.hideAfter, 10 ) );
        },

        processLoader: function () {
            // Show the loader only, if auto-hide is on and loader is demanded
            if (!this.canAutoHide() || this.options.loader === false) {
                return false;
            }

            var loader = this._toastsEl.find('.jq-toasts-loader');

            // 400 is the default time that jquery uses for fade/slide
            // Divide by 1000 for milliseconds to seconds conversion
            var transitionTime = (this.options.hideAfter - 400) / 1000 + 's';
            var loaderBg = this.options.loaderBg;

            var style = loader.attr('style') || '';
            style = style.substring(0, style.indexOf('-webkit-transition')); // Remove the last transition definition

            style += '-webkit-transition: width ' + transitionTime + ' ease-in; \
                      -o-transition: width ' + transitionTime + ' ease-in; \
                      transition: width ' + transitionTime + ' ease-in; \
                      background-color: ' + loaderBg + ';';


            loader.attr('style', style).addClass('jq-toasts-loaded');
        },

        animate: function () {

            var that = this;

            this._toastsEl.hide();

            this._toastsEl.trigger('beforeShow');

            if ( this.options.showHideTransition.toLowerCase() === 'fade' ) {
                this._toastsEl.fadeIn(function ( ){
                    that._toastsEl.trigger('afterShown');
                });
            } else if ( this.options.showHideTransition.toLowerCase() === 'slide' ) {
                this._toastsEl.slideDown(function ( ){
                    that._toastsEl.trigger('afterShown');
                });
            } else {
                this._toastsEl.show(function ( ){
                    that._toastsEl.trigger('afterShown');
                });
            }

            if (this.canAutoHide()) {

                var that = this;

                window.setTimeout(function(){
                    
                    if ( that.options.showHideTransition.toLowerCase() === 'fade' ) {
                        that._toastsEl.trigger('beforeHide');
                        that._toastsEl.fadeOut(function () {
                            that._toastsEl.trigger('afterHidden');
                        });
                    } else if ( that.options.showHideTransition.toLowerCase() === 'slide' ) {
                        that._toastsEl.trigger('beforeHide');
                        that._toastsEl.slideUp(function () {
                            that._toastsEl.trigger('afterHidden');
                        });
                    } else {
                        that._toastsEl.trigger('beforeHide');
                        that._toastsEl.hide(function () {
                            that._toastsEl.trigger('afterHidden');
                        });
                    }

                }, this.options.hideAfter);
            };
        },

        reset: function ( resetWhat ) {

            if ( resetWhat === 'all' ) {
                $('.jq-toasts-wrap').remove();
            } else {
                this._toastsEl.remove();
            }

        },

        update: function(options) {
            this.prepareOptions(options, this.options);
            this.setup();
            this.bindtoasts();
        },
        
        close: function() {
            this._toastsEl.find('.close-jq-toasts-single').click();
        }
    };
    
    $.toasts = function(options) {
        var toasts = Object.create(Toasts);
        toasts.init(options, this);

        return {
            
            reset: function ( what ) {
                toasts.reset( what );
            },

            update: function( options ) {
                toasts.update( options );
            },
            
            close: function( ) {
            	toasts.close( );
            }
        }
    };

    $.toasts.options = {
        text: '',
        heading: '',
        showHideTransition: 'fade',
        allowtoastsClose: true,
        hideAfter: 3000,
        loader: true,
        loaderBg: '#9EC600',
        stack: 5,
        position: 'bottom-left',
        bgColor: false,
        textColor: false,
        textAlign: 'left',
        icon: false,
        beforeShow: function () {},
        afterShown: function () {},
        beforeHide: function () {},
        afterHidden: function () {},
        onClick: function () {}
    };

})( jQuery, window, document );
