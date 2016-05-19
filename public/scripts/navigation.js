// Navigation (NavigationController)

app.controller('NavigationController', ["$rootScope", "$scope", "Locales", function($rootScope, $scope, locales) {

	// FIXME: What are these for?
	$scope.manage_foods_active = true;
	$scope.manage_categories_active = true;
	$scope.sidebaropen = false;

	$scope.$watch(function() {
			return locales.list();
		}, function(event) {
			$scope.locales = locales.list();
	});

	$scope.currentLocale = locales.current();

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

	// Add new food
	$scope.addNewFood = function() {
		$rootScope.$broadcast('intake24.admin.food_db.AddNewFood');
	}

	// Clone food
	$scope.cloneFood = function() {

		if ($scope.SharedData.currentItem.type != 'food') {

			showMessage(gettext('Please select a food'), 'warning');

			return;
		}

		$scope.SharedData.selectedFoodGroup = $scope.SharedData.foodGroups[0];

		$('#properties-col').show().addClass('fullwidth');

		$('#food-list-col').hide();

		showContainer('#add-new-food-container');
	}


	/***********************/
	/** Manage categories **/
	/***********************/

	// Add new category
	$scope.addNewCategory = function() {

		$.each($scope.SharedData.topLevelCategories, function(index, value) {

			value.state = 'none';

		});

		$scope.SharedData.currentItem = {
			code:"",
			englishDescription:"",
			isHidden: false,
			attributes:{
				readyMealOption:Array(),
				sameAsBeforeOption:Array(),
				reasonableAmount:Array()
			},
			localData:{
				version:Array(),
				localDescription:Array(),
				nutrientTableCodes:{},
				portionSize:Array()
			},
			parentCategories:Array()
		};

		$('#properties-col').show().addClass('fullwidth');

		$('#food-list-col').hide();

		showContainer('#add-new-category-container');
	}

	// Clone category
	$scope.cloneCategory = function() {

		if ($scope.SharedData.currentItem.type != 'category') {

			showMessage(gettext('Please select a category'), 'warning');

			return;
		}

		$('#properties-col').show().addClass('fullwidth');

		$('#food-list-col').hide();

		showContainer('#add-new-category-container');
	}

}]);
