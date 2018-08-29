(($) => {

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ DATA

	const Data = {

		defaults: {
			//
		}

	};

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ ENGINE

	const Engine = {

		init($input, settings) {
			const $checkthat = Build.build($input);
			$input.data('checkthat', $checkthat);
			Binds.bind($checkthat);
		},

		destroy($input) {
			const $checkthat = $input.data('checkthat');
			$checkthat.children().not($input).remove();
			$input.removeClass('.checkthat-input').unwrap('.checkthat');
		},

		controlInput($input, initialized=false) {
			let control = true;
			if(!$input.is('input[type="checkbox"]') && !$input.is('input[type="radio"]')) {
				console.error('checkThat | Invalid input type');
				control = false;
			}
			if(initialized && !$input.closest('.checkthat').length) {
				console.error('checkThat | Not initialized');
				control = false;
			}
			return control;
		}

	};

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ BUILD

	const Build = {

		build($input, settings) {
			const type = $input.attr('type');
			$input
				.addClass('checkthat-input')
				.wrap('<div class="checkthat checkthat-'+type+'"></div>');
			const $checkthat = $input.closest('.checkthat');
			const icon = type === 'checkbox' ? 'check' : 'circle';
			$checkthat.append('<i class="checkthat-icon fas fa-'+icon+'"></i>');
			return $checkthat;
		}

	};

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ BINDS

	const Binds = {

		bind($checkthat) {
			$checkthat.off('click.checkthat').on('click.checkthat', Binds.click);
		},

		click(e) {
			const $checkthat = $(e.currentTarget);
			const $input = $checkthat.find('.checkthat-input');
			if($checkthat.is('.checkthat-checkbox')) {
				$input.prop('checked', !$input.is(':checked'));
			}
			else if($checkthat.is('.checkthat-radio')) {
				$input.prop('checked', true);
			}
			$input.trigger('change');
		}

	};

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ METHODS

	const Methods = {

		init(options) {
			const settings = $.extend(true, {}, Data.defaults, options);
			return this.each((idx, el) => {
				const $input = $(el);
				if(Engine.controlInput($input)) {
					Engine.init($input, settings);
				}
			});
		}, 

		destroy() {
			return this.each((idx, el) => {
				const $originalSelect = $(el);
				if(Engine.controlInput($input, true)) {
					Engine.destroy($input);
				}
			});
		}

	};

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ HANDLER

	$.fn.checkThat = function(arg) {
		if(this.length < 1) { return; }
		if(Methods[arg]) {
			return Methods[arg].apply(this, Array.prototype.slice.call(arguments, 1));
		}
		else if(typeof arg === 'undefined' || typeof arg === 'object') {
			return Methods.init.apply(this, arguments);
		}
		else {
			console.error('checkThat | Invalid argument');
		}
	};

})(jQuery);