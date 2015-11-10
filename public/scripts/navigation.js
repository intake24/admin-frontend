// Navigation (NavigationController)

app.controller('NavigationController', function($scope, $http, expandPropertiesService, fetchCategoriesService, SharedData) {

	// Listen for boradcasts
	expandPropertiesService.listen(function(event, data) { expandProperties(); });
	
	// Init shared data
	$scope.SharedData = SharedData;

	$('.sidebar-btn').click(function() {
		if ($(this).closest("li").children("ul").length == 0) {
			$('.sidebar').removeClass('active');
		}
	});

	function expandProperties() {
		$('#food-list-col').animate({'opacity':0}, function() { $('#food-list-col').hide(); $('#properties-col').addClass('fullwidth'); });
	}

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
	
		$('#food-list-col').show().animate({'opacity':1}, function() { 
			$('#properties-col').addClass('active');
		});
	});

	// Add new food
	$('#add-new-food-btn').click(function() {
		
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

		$scope.$apply();

		expandPropertiesService.broadcast();
		showContainer('#add-new-food-container');
	});


	/***********************/
	/** Manage categories **/
	/***********************/

	// Add new category
	$('#add-new-category-btn').click(function() {

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

		$scope.$apply();
		
		expandPropertiesService.broadcast();
		showContainer('#add-new-category-container');
	});

});