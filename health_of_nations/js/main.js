
// SVG Size
var width = 700,
		height = 500;


// Load CSV file
d3.csv("data/wealth-health-2014.csv", function(data){

	// Analyze the dataset in the web console
	console.log(data);
	console.log("Countries: " + data.length);

	data.forEach(function (d) {
		d.Income = +d.Income;
		d.LifeExpectancy = + d.LifeExpectancy;
		d.Population = +d.Population;
	});

    data.sort(function(a, b){
        return b.Population - a.Population;
    });


	var mainSvg = d3.select('#chart-area')
		.append('svg')
		.attr('height', height)
		.attr('width', width);

	// Returns the min. and max. value in a given array (= [6900,25000])
    var incomeExtent = d3.extent(data, function(d) {
        return d.Income;
    });

    var padding = 60;
    var domainPadding = 10000;

	var incomeScale = d3.scaleLinear()
        .domain([incomeExtent[0] - domainPadding, incomeExtent[1] + domainPadding])
        .range([padding, width-padding]);

    // Returns the min. and max. value in a given array (= [6900,25000])
    var lifeExpectancyExtent = d3.extent(data, function(d) {
        return d.LifeExpectancy;
    });

    var lifeExpectancyScale = d3.scaleLinear()
		.domain([lifeExpectancyExtent[0], lifeExpectancyExtent[1]])
		.range([height-padding, padding]);



    // Returns the min. and max. value in a given array (= [6900,25000])
    var populationExtent = d3.extent(data, function(d) {
        return d.Population;
    });

    var populationScale = d3.scaleLinear()
        .domain([populationExtent[0], populationExtent[1]])
        .range([4, 30]);

    var colorPalette = d3.scaleOrdinal(d3.schemeCategory10);
    colorPalette.domain(["East Asia & Pacific", "South Asia", "America",  "Sub-Saharan Africa", "Europe & Central Asia",
		"Middle East & North Africa"]);

	mainSvg.selectAll('circle')
		.data(data)
        .enter()
		.append('circle')
		.attr("cx", function(d){
			return incomeScale(d.Income);
		})
		.attr("cy", function (d) {
			return lifeExpectancyScale(d.LifeExpectancy);
        })
		.attr("fill", function (d) {
			return colorPalette(d.Region);
        })
		.attr('r', function (d) {
			return populationScale(d.Population);
        })
		.attr('stroke', 'black');

    var xAxis = d3.axisBottom()
        .scale(incomeScale);
    var yAxis = d3.axisLeft()
		.scale(lifeExpectancyScale);


    var yValues = data.map(function (d) {
		return lifeExpectancyScale(d.LifeExpectancy)
	});

    yAxis.tickValues([50,55,60,65,70,75,80,85]);


	// Draw the axis
    mainSvg.append("g")
        .attr("class", "axis x-axis")
        .attr("transform", "translate(0," + (height - padding) + ")")
        .call(xAxis);

	mainSvg.append("g")
        .attr("class", "axis y-axis")
        .attr("transform", "translate(" + (padding) + ", 0)")
        .call(yAxis);


    // now add titles to the axes
    mainSvg.append("text")
		.attr("class", "labels")
        .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
        .attr("transform", "translate("+ ((padding)/2) +","+(height/2)+")rotate(-90)")  // text is drawn off the screen top left, move down and out and rotate
        .text("Life Expectancy");

    mainSvg.append("text")
        .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
        .attr("transform", "translate("+ (width/2) +","+(height-((padding)/3))+")")  // centre below axis
        .text("Income");









    var dataNoZeros = data;
    console.log(colorPalette.range());

    console.log(data);
    console.log(dataNoZeros);

    var secondSvg = d3.select('#chart-area')
        .append('svg')
        .attr('height', height)
        .attr('width', width);

    // Returns the min. and max. value in a given array (= [6900,25000])
    var incomeExtent2 = d3.extent(dataNoZeros, function(d) {
        return d.Income;
    });

    var padding2 = 60;

    var incomeScale2 = d3.scaleLog()
        .domain([incomeExtent2[0], incomeExtent2[1]])
        .range([padding2, width - padding2]);

    // Returns the min. and max. value in a given array (= [6900,25000])
    var lifeExpectancyExtent2 = d3.extent(dataNoZeros, function(d) {
        return d.LifeExpectancy;
    });


    var lifeExpectancyScale2 = d3.scaleLinear()
        .domain([lifeExpectancyExtent2[0], lifeExpectancyExtent2[1]])
        .range([height-padding2, padding2]);



    // Returns the min. and max. value in a given array (= [6900,25000])
    var populationExtent2 = d3.extent(dataNoZeros, function(d) {
        return d.Population;
    });

    var populationScale2 = d3.scaleLinear()
        .domain([populationExtent2[0], populationExtent2[1]])
        .range([4, 30]);

    secondSvg.selectAll('circle')
        .data(dataNoZeros)
        .enter()
        .append('circle')
        .attr("cx", function(d){
            return incomeScale2(d.Income);
        })
        .attr("cy", function (d) {
            return lifeExpectancyScale2(d.LifeExpectancy);
        })
        .attr("fill", function (d) {
            return colorPalette(d.Region);
        })
        .attr('r', function (d) {
            return populationScale2(d.Population);
        })
        .attr('stroke', 'black');

    var xAxis2 = d3.axisBottom()
        .scale(incomeScale2);
    var yAxis2 = d3.axisLeft()
        .scale(lifeExpectancyScale2);


    var yValues2 = dataNoZeros.map(function (d) {
        return lifeExpectancyScale2(d.LifeExpectancy)
    });

    yAxis2.tickValues([50,55,60,65,70,75,80,85]);
    xAxis2.ticks(7, "d")
		.tickValues([1000,2000,4000,8000,16000,32000,100000]);

    // Draw the axis
    secondSvg.append("g")
        .attr("class", "axis x-axis")
        .attr("transform", "translate(0," + (height - padding2) + ")")
        .call(xAxis2);

    secondSvg.append("g")
        .attr("class", "axis y-axis")
        .attr("transform", "translate(" + (padding2) + ", 0)")
        .call(yAxis2);


    // now add titles to the axes
    secondSvg.append("text")
        .attr("class", "labels")
        .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
        .attr("transform", "translate("+ ((padding2)/2) +","+(height/2)+")rotate(-90)")  // text is drawn off the screen top left, move down and out and rotate
        .text("Life Expectancy");

    secondSvg.append("text")
        .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
        .attr("transform", "translate("+ (width/2) +","+(height-((padding2)/3))+")")  // centre below axis
        .text("Income");
});

