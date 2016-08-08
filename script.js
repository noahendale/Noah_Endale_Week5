var wiki = {};
var yum = {};
yum.APIkey = '20df0e101bb5ef2c9bf247ae44f5b670';
yum.appID = 'abcc327c';

wiki.getInfo = function(query) {
	$.ajax({
		url: 'https://en.wikipedia.org/w/api.php',
		method: 'GET',
		dataType: 'jsonp',
		rvprop: 'content',
		data: {
			action: 'query',
			titles: query + '_cuisine',
			format: 'json',
			prop: 'info',
			inprop: 'url'
		}
	}).then(function(response) {
		for (var key in response.query.pages) {
			wiki.displayInfo(response.query.pages[key].canonicalurl);
		};
	});
};

wiki.displayInfo = function(foodWiki) {
	$('#link').empty();
		var countryLink = $('<a>').attr('href', foodWiki).text("What's a " + $("#countrySelect option:selected").text() + "??").attr('target', '_blank');
		$('#link').append(countryLink);
};

//GET RECIPE BASED ON SELECTION
yum.getInfo = function(query) {
	$.ajax({
		url: 'http://api.yummly.com/v1/api/recipes?',
		method: 'GET',
		dataType: 'jsonp',
		data: {
			_app_key: yum.APIkey,
			_app_id: yum.appID,
			q: query,
			requirePictures: true,
			maxResult: 6
		}
	}).then(function(data) {
		yum.displayInfo(data.matches);
		yum.legal(data);
	});
};

//DISPLAY USER'S RECIPIES
var colours = ['#f2849e', '#7ecaf6', '#7bd0c1', '#c75b9b', '#ae85ca', '#8499e7'];

yum.displayInfo = function(foodData) {
	$('#results').empty();
	var i = -1;
	foodData.forEach(function(recipe){
		//FOR EACH RESULT, CREATE A CONTAINER
		var foodContainer = $('<div>').addClass('meals');
		//WRAP TITLE IN NEWLY CREATED H2 TAG
		var recipeTitle = $('<h2>').text(recipe.recipeName);
		//GRAB PIC FROM API AND ENLARGE
		var urlImage = recipe.smallImageUrls[0].replace(/s90/g, 's500');
		//CREATE URL
		var recipeLink = $('<a>').attr('href', 'http://www.yummly.com/recipe/' + recipe.id).text('See Recipe').attr('target', '_blank');

		i++;//INCREMENT i FIRST
		var colourContainer = $('<div>').addClass('overlay');
		$(colourContainer).css('background-color', colours[i]); //GO THROUGH ARRAY OF COLOURS AND GIVE EACH RECIPE A DIFFERENT COLOUR

		//THROW ITEMS INTO NEW CONTAINER WITH 2ND BG
		foodContainer.append(recipeTitle, recipeLink, colourContainer).css('background-image', 'url(' + urlImage + ')').css('background-size', 'cover').css('background-repeat', 'no-repeat');

		//ADD CONTAINER INTO DIV
		$('#results').append(foodContainer);
	});
};

yum.legal = function(link) {
	$('.attribution').empty();
	$('.attribution').append(link.attribution.html);
}

yum.init = function() {
	yum.getInfo('moroccan');
	wiki.getInfo('moroccan');
	$('#countrySelect').on('click', function(e) {
		e.preventDefault();
		var searchTerm = $('#countrySelect').val();
		yum.getInfo(searchTerm);
		wiki.getInfo(searchTerm);
	});
};

$(function() {
	yum.init();
});