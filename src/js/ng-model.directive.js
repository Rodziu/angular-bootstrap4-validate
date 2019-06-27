/*
 * AngularJS validation plugin for  Bootstrap 4
 *  Copyright (c) 2019 Rodziu <mateusz.rohde@gmail.com>
 *  License: MIT
 */

!function(){
	'use strict';

	/**
	 * @ngInject
	 */
	function ngModelDirective(validate, $parse){
		return {
			restrict: 'A',
			require: ['ngModel', '?^form'],
			link(scope, element, attrs, ctrl){
				const ngModel = ctrl[0],
					formCtrl = ctrl[1];
				if(
					formCtrl === null
					|| formCtrl.$$element[0].hasAttribute('novalidate')
				){
					return;
				}

				let invalidFeedback = null;

				// update feedback on errors
				scope.$watch(function(){
					return ngModel.$error;
				}, function(errors){
					if(invalidFeedback === null){
						invalidFeedback = angular.element(
							'<div class="invalid-' + formCtrl.validationMode + '"></div>'
						);
						element.parent().append(invalidFeedback);
						if(
							element.parent().hasClass('input-group')
						){
							angular.element(invalidFeedback[0].previousElementSibling).addClass('input-group-fix');
						}
					}
					const errorMessages = [];
					for(let e in errors){
						if(errors.hasOwnProperty(e)){
							let msg = attrs[e + 'ErrorMsg'] || validate.errorMessages[e];
							if(angular.isObject(msg)){
								msg = element[0].tagName === 'INPUT' ? msg.input : msg.textarea;
							}
							if(angular.isDefined(msg)){
								let value = attrs[e] || attrs[attrs.$normalize('ng-' + e)];
								try{
									value = $parse(value);
									// try to $parse for expressions, treat them literally on error
								}catch(error){
									// eslint-disable-line no-empty
								}
								errorMessages.push(
									msg.replace('%s', value)
								);
							}
						}
					}
					invalidFeedback.html(errorMessages.join(', '));
				}, true);

				// display validation on dirty form controls
				scope.$watch(function(){
					return ngModel.$dirty;
				}, function(nV){
					if(nV){
						element.parent().addClass('was-validated');
					}
				});

				// display validation on whole form on submit
				element[0].addEventListener('invalid', function(event){
					event.preventDefault();
					formCtrl.$$element.addClass('was-validated');
				});

				// cleanup
				scope.$on('$destroy', function(){
					invalidFeedback.remove();
				});
			}
		}
	}

	angular.module('validate').directive('ngModel', ngModelDirective);
}();