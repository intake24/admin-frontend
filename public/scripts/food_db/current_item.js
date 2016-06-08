angular.module('intake24.admin.food_db').factory('CurrentItem', ['$rootScope', function($rootScope) {

	var currentItem = null;

	return {
		setCurrentItem : function(newItem) {
			currentItem = newItem;
			// Does this have to be rootScope?
			$rootScope.$broadcast('intake24.admin.food_db.CurrentItemChanged', newItem);
		},

		delete: function() {
			$rootScope.$broadcast('intake24.admin.food_db.DeleteItem');
		},

		setNewItem: function(newItem) {
			$rootScope.$broadcast('intake24.admin.food_db.NewItemCreated', newItem);
		},

		itemUpdated: function(updateEvent) {
			$rootScope.$broadcast('intake24.admin.food_db.CurrentItemUpdated', updateEvent);
		},

		itemDeleted: function(deleteEvent) {
			$rootScope.$broadcast('intake24.admin.food_db.CurrentItemDeleted', deleteEvent);
		},

		getCurrentItem : function() {
			return currentItem;
		},

		setChangedState : function(changed) {
			if (currentItem)
				currentItem.changed = changed;
		}
	};
}]);
