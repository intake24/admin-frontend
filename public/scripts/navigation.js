// Navigation (NavigationController)

app.controller('NavigationController', function($scope, $http, $cookies, SharedData, fetchCategoriesService) {

	// Set sidebar defaults
	$scope.set_language_active = $cookies.getObject("set_language_active");
	
	$scope.$watch($scope.set_language_active, function(newItem) {
		
		$cookies.putObject("set_language_active", newItem);

	});

	var locale = $cookies.getObject("locale");

	if (locale) {
		if (locale.changed) {
			locale.changed = false;
			showMessage(format('Language set to %s', [locale.language]), 'success');
		}
		SharedData.locale = locale;
		$cookies.putObject("locale", locale);
	}
	
	// Init shared data
	$scope.SharedData = SharedData;

	$scope.setLocale = function(locale) {
		locale.changed = true;
		$cookies.putObject("locale", locale);
		document.location = '/' + locale.locale;
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

		fetchCategoriesService.broadcast();
		
		$(".food-list-container").show();
		$('#food-list-col').show().animate({'opacity':1}, function() { 
			$('#properties-col').addClass('active');
		});
	});

	// Add new food
	$scope.addNewFood = function() {
		
		$scope.SharedData.selectedFoodGroup = $scope.SharedData.foodGroups[0];

		$scope.SharedData.currentItem = {
			code:"",
			englishDescription:"",
			groupCode:0,
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
			}
		};

		$('#properties-col').show().addClass('fullwidth');

		$('#food-list-col').hide();

		showContainer('#add-new-food-container');
	}


	/***********************/
	/** Manage categories **/
	/***********************/

	// Add new category
	$scope.addNewCategory = function() {

		$scope.SharedData.currentItem = {
			code:"",
			englishDescription:"",
			isHidden: false,
			attributes:{
				readyMealOption:Array(),
				sameAsBeforeOption:Array(),
				reasonableAmount:Array()
			}
		};
	
		$('#properties-col').show().addClass('fullwidth');

		$('#food-list-col').hide();

		showContainer('#add-new-category-container');
	}

});