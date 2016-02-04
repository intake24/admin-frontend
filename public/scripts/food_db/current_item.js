angular.module('intake24.admin.food_db').factory('CurrentItem', ['$rootScope', function($rootScope) {

	var currentItem = null;

	return {
		setCurrentItem : function(newItem) {
			currentItem = newItem;
			// Does this have to be rootScope?
			$rootScope.$broadcast('intake24.admin.food_db.CurrentItemChanged', newItem);
		},

		getCurrentItem : function() {
			return currentItem;
		}
	};
}]);
