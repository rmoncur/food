//Initializing the app & adding the firebase code
var app = angular.module('myApp', ["firebase","ui.bootstrap","ui.utils"])
.factory("fireService", ["$firebase", function($firebase) {
	var ref = new Firebase("https://brilliant-fire-721.firebaseio.com");
	return $firebase(ref);
}]);

angular.module('myApp').filter('selectedTags', function() {
    return function(tasks, tags) {
        return tasks.filter(function(task) {

            for (var i in task.Tags) {
                if (tags.indexOf(task.Tags[i]) != -1) {
                    return true;
                }
            }
            return false;

        });
    };
});

// Controller for the instance of the Modal Dialog
app.controller("rootCtrl",["$scope","$http","fireService",function ($scope, $http, fireService) {
	
	$scope.ui = {
		input:{
			sort:"title",
			sortdirection:true
		},
		menu:{
			recipe:false,
			recipeedit:false,
			sort:"title",
			sortdirection:true
		}
	}
	
	$scope.guesswhat = ["I love you Rob"];
	$scope.secretmessage = ["You are the best husband in the world!"];
	
	$scope.blankrecipe = {title:"",ingredients:[],categories:[],directions:"",rating:3};	//template object for recipes
	$scope.recipe = {	//the first recipe
		id:"",
		title:"",
		ingredients:[],
		categories:[],
		directions:"",
		rawtext:"",
		rating:3
	}
	
	
	$scope.db = {};
	fireService.$bind($scope, "db");	//three-way-binding the db object
	$scope.categories = ["Main Dish","Breakfast","Lunch","Dinner","Dessert","Side Dish","Crockpot","Italian","Pasta","Asian","Chinese","Cookies","Thai"];	//populating the autofill categories
	
	//Saving a recipe
	$scope.saveRecipe = function(){
		//$scope.db.$add({"recipes":[]});
		
		if( $scope.db == null) $scope.db = {};
		
		var type = typeof $scope.db.recipes;
		
		if( Object.prototype.toString.call( $scope.db.recipes ) === '[object Array]' ) {
			//$scope.recipe.id = generateUUID();
			$scope.recipe.created_at = new Date();
			$scope.db.recipes.push($scope.recipe);
		} else {
			$scope.db.recipes = [$scope.recipe]	
			$scope.db.selectedIngredients = [];
		}
				
		$scope.resetRecipe();
	}
	
	//Deleting a recipe
	$scope.deleteRecipe = function(r){
		
		if( !confirm("Really delete this recipe?") ) return;
		
		for( var i in $scope.db.recipes ){
			if( r == $scope.db.recipes[i] ){
				$scope.db.recipes.splice(i,1);	
			}
		}
		
		var lisasays = ["Rob is awesome!!!!!"];
	}
	
	//Resetting the recipe in the editor
	$scope.resetRecipe = function(){
		$scope.recipe = $.extend(true, {}, $scope.blankrecipe);	
		$scope.recipe.id = generateUUID();
	}
	
	//Load a recipe into the editor
	$scope.loadRecipe = function(r){
		$scope.recipe = r;
		//setTimeout( function(){ $scope.ingtext = $(".well").first().text().trim(); $scope.$apply(); console.log($(".well").first().text().trim()) },500);
		
	}
	
	//Selecting a recipe, and adding its ingredients to the selectedIngredients list
	$scope.selectRecipe = function(r){
		if( $scope.db.selectedIngredients == null ) $scope.db.selectedIngredients = [];
		
		if( r.selected == true ){
			for(var i in r.ingredients){
				var newIng = $.extend(true, {}, r.ingredients[i]);
				newIng.recipe_id = r.id;
				newIng.checked = false;
				$scope.db.selectedIngredients.push(newIng);
			}
		} else {
			
			var keepIngredients = [];
			for(var i in $scope.db.selectedIngredients){				
				var ing = $scope.db.selectedIngredients[i];
				if( ing.recipe_id != r.id){					
					keepIngredients.push(ing)
				}
			}			
			$scope.db.selectedIngredients = keepIngredients;

		}
	}
	
	//Removing an ingredient from the list
	$scope.removeIngredient = function(ingredient){
		for(var i in $scope.db.selectedIngredients){			
			var ing = $scope.db.selectedIngredients[i];
			if( ing == ingredient){					
				$scope.db.selectedIngredients.splice(i,1);
				break;
			}
		}
	}
	
	//Add a category to the current recipe
	$scope.addCategory = function(){
		if( typeof $scope.recipe.categories != "object") $scope.recipe.categories = [];
		
		$scope.recipe.categories.push($scope.nextCategory);
		$scope.nextCategory = "";	
	}
	
	//Deleting a category from the current category
	$scope.deleteCategory = function(c){
		for( var i in $scope.recipe.categories ){
			if( c == $scope.recipe.categories[i] ){
				$scope.recipe.categories.splice(i,1);	
			}
		}
	}
	
	//Parsing ingredients from text
	$scope.parseIngredients = function(){
		
		$scope.recipe.ingredients = [];
		
		//Parsing the text into lines
		var lines = $scope.recipe.rawtext.split("\n");

		//Parsing each line into an ingredient (amount, unit, ingredient)
		for(var i in lines){
			
			//Replacing double spaces with single spaces
			var line = lines[i].trim();			
			var note = /\s*\(.*?\)\s*/.exec(line);
			line = line.replace(/ *\([^)]*\) */g, '' );			
			
			//Converting measurements
			line = line.replace(/1 1\/8/g, '1.125');
			line = line.replace(/1 1\/4/g, '1.25');
			line = line.replace(/1 1\/3/g, '1.333');
			line = line.replace(/1 1\/2/g, '1.5');
			line = line.replace(/1 3\/4/g, '1.75');
			line = line.replace(/2 1\/8/g, '2.125');
			line = line.replace(/2 1\/4/g, '2.25');
			line = line.replace(/2 1\/3/g, '2.333');
			line = line.replace(/2 1\/2/g, '2.5');
			line = line.replace(/2 3\/4/g, '2.75');
			line = line.replace(/3 1\/8/g, '3.125');
			line = line.replace(/3 1\/4/g, '3.25');
			line = line.replace(/3 1\/3/g, '3.333');
			line = line.replace(/3 1\/2/g, '3.5');
			line = line.replace(/3 3\/4/g, '3.75');
			line = line.replace(/4 1\/8/g, '4.125');
			line = line.replace(/4 1\/4/g, '4.25');
			line = line.replace(/4 1\/3/g, '4.333');
			line = line.replace(/4 1\/2/g, '4.5');
			line = line.replace(/4 3\/4/g, '4.75');
			line = line.replace(/5 1\/8/g, '5.125');
			line = line.replace(/5 1\/4/g, '5.25');
			line = line.replace(/5 1\/3/g, '5.333');
			line = line.replace(/5 1\/2/g, '5.5');
			line = line.replace(/5 3\/4/g, '5.75');
			line = line.replace(/6 1\/8/g, '6.125');
			line = line.replace(/6 1\/4/g, '6.25');
			line = line.replace(/6 1\/3/g, '6.333');
			line = line.replace(/6 1\/2/g, '6.5');
			line = line.replace(/6 3\/4/g, '6.75');

			line = line.replace(/1\/2/g, '0.5');
			line = line.replace(/½/g, '0.5');
			line = line.replace(/1\/3/g, '0.333');
			line = line.replace(/⅓/g, '0.333');
			line = line.replace(/1\/4/g, '0.25');
			line = line.replace(/¼/g, '0.25');
			line = line.replace(/2\/3/g, '0.666');
			line = line.replace(/⅔/g, '0.666');
			line = line.replace(/3\/4/g, '0.75');
			line = line.replace(/¾/g, '0.75');
			line = line.replace(/3\/2/g, '1.5');
			
			//Removing double spaces
			var words = line.replace(/\s{2,}/g, ' ').split(" ");
			
			//Parsing each word into a part of an ingedient
			var ingredient = {amount:null,unit:"",name:""};
			if( note != null ) ingredient.note = note[0];
			for(var j in words){
				var word = words[j];
				if( !isNaN(word) ) {
					ingredient.amount = word;
				} else {
					parsedUnit = $scope.parseUnit(word);
					
					if(parsedUnit == null ){
						ingredient.name += $scope.parseName(word) + " ";
					} else {
						ingredient.unit = parsedUnit;
					}
					
				}
			}
			
			//Adding the ingredient to the list
			ingredient.name = ingredient.name.trim().replace(/\s{2,}/g, ' ')
			$scope.recipe.ingredients.push(ingredient);
		}
		
	}
	
	//Parsing the unit from an ingredient line
	$scope.parseUnit = function(unit){
		switch(unit){
			case "cup":
			case "cups":
			case "Cups":
			case "Cup":	
			case "CUP":
			case "c":
			case "C":
			case "c.":
				return "cup";
				break;
			case "tsp":
			case "tsp.":
			case "teaspoon":
			case "teaspoons":
			case "Teaspoon":
			case "Teaspoons":
			case "t":
				return "teaspoon";
				break;
			case "Tbsp":
			case "TBSP":
			case "T":
			case "Tbl":
			case "TBL":			
			case "tbsp":
			case "Tbs":
			case "Tbs.":
			case "tablespoon":
			case "tablespoons":
			case "Tablespoon":
			case "Tablespoons":
				return "tablespoon";
			case "Oz":
			case "oz":
			case "oz.":
			case "Oz.":
			case "ounce":
			case "Ounce":
				return "ounce";
			case "Can":
			case "can":
			case "cans":
				return "can";
			case "envelope":
			case "Envelope":
			case "env":
				return "envelope";
			case "Package":
			case "package":
			case "Packages":
			case "packages":
			case "pkg":
			case "pkg.":
			case "pkgs":
			case "Pkg":
			case "Pkgs":
			case "PKG":
			case "PKGS":
				return "package";
			case "LB":
			case "lb":
			case "lbs":
			case "lbs.":
			case "pound":
			case "Pound":
			case "POUND":
			case "pounds":
			case "Pounds":
			case "POUNDS":
				return "pound";
			case "pint":
			case "Pint":
			case "PINT":
				return "pint";
			case "slice":
				return "slice";
			case "bunch":
				return "bunch";
			case "qt":
				return "quart";
			default:
				return null;
		}
	}
	
	//Parsing the name from an ingredient line
	$scope.parseName = function(name){
		return name;
	}
	
	//Displaying a recipe on the menu page
	$scope.displayRecipe = function(r){
		$scope.ui.menu.recipe = r;
	}
	
	//Hiding the recipe on the menu page
	$scope.hideRecipe = function(){
		$scope.ui.menu.recipe = null;	
	}
	
	//Adding a custom ingredient to the shopping list
	$scope.addCustomIngredient = function(){
		$scope.db.selectedIngredients.push({name:$scope.customIngredient});
		$scope.customIngredient = "";
	}
	
	
}]);

//Generating a guid for the recipe
function generateUUID(){
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x7|0x8)).toString(16);
    });
    return uuid;
 };