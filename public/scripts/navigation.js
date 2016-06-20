// Navigation (NavigationController)

app.controller('NavigationController', ["$rootScope", "$scope", "Locales", "CurrentItem", function($rootScope, $scope, locales, currentItem) {

	// FIXME: What are these for?
	$scope.manage_foods_active = true;
	$scope.manage_categories_active = true;

	$scope.$watch(function() {
			return locales.list();
		}, function(event) {
			$scope.locales = locales.list();
	});

	$scope.currentLocale = locales.current();

	$scope.currentItem = currentItem;

	/*if (locale) {
		 showMessage(format('Language set to %s', [locale.language]), 'success');

		SharedData.locale = locale;
		$cookies.putObject("locale", locale);
	}*/;

	$scope.setLocale = function(intake24_locale, ui_locale) {
		document.location = '/' + intake24_locale + '/' + ui_locale;
	}

	$('.sidebar-btn').click(function() {
		if ($(this).closest("li").children("ul").length == 0) {
			$('.sidebar').removeClass('active');
		}
	});

	function showContainer(container_id) {
		$('.properties-container:not(' + container_id + ')').hide();
		$(container_id).show();
	}


	/******************/
	/** Manage foods **/
	/******************/

	// Browse foods
	$('#browse-foods-btn').click(function() {

		$('#properties-col').removeClass('fullwidth');
		$('#add-new-food-container').hide();
		$('#add-new-category-container').hide();

		// fetchCategoriesService.broadcast();

		$(".food-list-container").show();
		$('#food-list-col').show().animate({'opacity':1}, function() {
			$('#properties-col').addClass('active');
		});
	});

	$scope.addNewFood = function() {
		$rootScope.$broadcast('intake24.admin.food_db.AddNewFood');
	}

	$scope.addNewCategory = function() {
		$rootScope.$broadcast('intake24.admin.food_db.AddNewCategory');
	}

	$scope.cloneFoodEnabled = function() {
		var curItem = $scope.currentItem.getCurrentItem();
		return (curItem && curItem.type == 'food');
	}

	$scope.cloneFood = function() {
		$rootScope.$broadcast('intake24.admin.food_db.CloneFood');
	}

	$scope.deleteItemEnabled = function() {
		return $scope.currentItem.getCurrentItem();
	}

	$scope.deleteItem = function() {
		if ($scope.deleteItemEnabled())
			$scope.currentItem.delete();
	}

}]);
