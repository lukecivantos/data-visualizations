
// SVG drawing area

var margin = {top: 40, right: 40, bottom: 60, left: 60};

var width = 600 - margin.left - margin.right,
		height = 500 - margin.top - margin.bottom;

var svg = d3.select("#chart-area").append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
	.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");


// Date parser
var formatDate = d3.timeFormat("%Y");
var parseDate = d3.timeParse("%Y");


// Initialize data
loadData();

// FIFA world cup
var data;


// Scales
var x = d3.scaleLinear()
    .range([0, width]);

var y = d3.scaleLinear()
    .range([height, 0]);



// Load CSV file
function loadData() {
	d3.csv("data/fifa-world-cup.csv", function(error, csv) {

		csv.forEach(function(d){
			// Convert string to 'date object'
			d.YEAR = parseDate(d.YEAR);
			
			// Convert numeric values to 'numbers'
			d.TEAMS = +d.TEAMS;
			d.MATCHES = +d.MATCHES;
			d.GOALS = +d.GOALS;
			d.AVERAGE_GOALS = +d.AVERAGE_GOALS;
			d.AVERAGE_ATTENDANCE = +d.AVERAGE_ATTENDANCE;
		});

		// Store csv data in global variable
		data = csv;

		// Draw the visualization for the first time
		updateVisualization();
	});
}

var yearMin = 1929;
var yearMax = 2015;

function filterYears() {
    var boundary = document.getElementById("filter-years");
    if (boundary[0].value == '') {
    	yearMin = 1929;
	} else {
        yearMin = boundary[0].value;
	}
	if(boundary[1].value == '') {
    	yearMax = 2015;
    } else {
        yearMax = boundary[1].value;
	}

    updateVisualization();
}

svg.append("path")
    .attr("interpolate","linear")
    .attr("class", "line");


// Render visualization
function updateVisualization() {

	var filtered_data = data.filter(function (value) {
        return ((formatDate(value.YEAR) >= yearMin) && (formatDate(value.YEAR) <= yearMax));
    });
    filtered_data.sort(function (a,b) {
        return formatDate(a.YEAR) - formatDate(b.YEAR);
    });
    var rankType = d3.select("#ranking-type").property("value");

	var xExtent = d3.extent(filtered_data, function (d) {
		return formatDate(d["YEAR"]);
    });
	var minimum = xExtent[0];
	var maximum = xExtent[1];

    xExtent = d3.extent(filtered_data, function (d) {
        return formatDate(d["YEAR"]);
    });

    minimum = xExtent[0];
	maximum = xExtent[1];


    x.domain([minimum, maximum]);
    y.domain([0, d3.max(filtered_data, function(d) { return d[rankType] })]);

    var xAxis = d3.axisBottom()
        .scale(x)
        .tickFormat(d3.format("d"));
    var yAxis = d3.axisLeft()
        .scale(y);

    d3.select('.axis').remove();
    d3.select('.axis').remove();

    // Draw the axis
    svg.append("g")
        .attr("class", "axis x-axis")
        .attr("transform", "translate(0," + (height) + ")")
        .transition().duration(800)
        .call(xAxis);

    svg.append("g")
        .attr("class", "axis y-axis")
        .attr("transform", "translate(0, 0)")
        .transition().duration(800)
        .call(yAxis);

    var line = d3.line()
        .x(function(d) {
            return x(formatDate(d["YEAR"]));
        })
        .y(function(d) {
            return y(d[rankType]);
        });

    var state = svg.selectAll(".line")
		.transition().duration(800)
        .attr("d", line(filtered_data));

    var titles = {
    	EDITION: "Edition: ",
		WINNER: "Winner: ",
		LOCATION: "Location: ",
		GOALS: "Goals: ",
		MATCHES: "Matches: ",
		AVERAGE_ATTENDANCE: "Average Attendance: ",
		TEAMS: "Teams: ",
		AVERAGE_GOALS: "Average Goals: "
	};

    /* Initialize tooltip */
    var tip = d3.tip()
		.attr('class', 'd3-tip')
		.offset([-8,0])
		.html(function(d) {
    		return d.EDITION + "<br />" + titles[rankType] + d[rankType];
		});

    /* Invoke the tip in the context of your visualization */
    svg.call(tip);


    // Data-join (rect now contains the update selection)
    var circle = svg.selectAll("circle")
        .data(filtered_data);

    // Enter (initialize the newly added elements)
    circle.enter().append("circle")
        .attr("class", "circ")
        // Enter and Update (set the dynamic properties of the elements)
        .merge(circle)
        .on("click", function (d) {
            showEdition(d);
        })
        .on('mouseover', tip.show)
        .on('mousemove', tip.show)
        .on('mouseout', tip.hide)
        .transition()
        .duration(800)
        .attr("cx", function(d) {
            return x(formatDate(d["YEAR"]));
        })
        .attr("cy", function(d) {
        	return y(d[rankType]);
        })
		.attr('r', 6);

    // Exit
    circle.exit().remove();


}


// Show details for a specific FIFA World Cup
function showEdition(d){
	d3.select("#edition-info")
		.attr("height", height)
		.text(d.EDITION);


	var ids = ["WINNER", "LOCATION", "GOALS", "MATCHES", "AVERAGE_ATTENDANCE", "TEAMS", "AVERAGE_GOALS"];
	for (var i = 0; i < ids.length; i++) {
        d3.select("#" + ids[i] + "-title").text(ids[i] + ":");
		d3.select("#" + ids[i] + "-info").text(d[ids[i]]);
	}
}
