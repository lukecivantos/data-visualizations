
// SVG drawing area

var margin = {top: 40, right: 10, bottom: 60, left: 60};

var width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var padding = 50;

var svg = d3.select("#chart-area").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


// Scales
var x = d3.scaleBand()
    .rangeRound([0, width])
	.paddingInner(0.1);

var y = d3.scaleLinear()
    .range([height, 0]);


// Initialize data
loadData();

// Create a 'data' property under the window object
// to store the coffee chain data
Object.defineProperty(window, 'data', {
	// data getter
	get: function() { return _data; },
	// data setter
	set: function(value) {
		_data = value;
		// update the visualization each time the data property is set by using the equal sign (e.g. data = [])
		updateVisualization()
	}
});

// Load CSV file
function loadData() {
	d3.csv("data/coffee-house-chains.csv", function(error, csv) {

		csv.forEach(function(d){
			d.revenue = +d.revenue;
			d.stores = +d.stores;
		});

		// Store csv data in global variable
		data = csv;

        // updateVisualization gets automatically called within the data = csv call;
		// basically(whenever the data is set to a value using = operator);
		// see the definition above: Object.defineProperty(window, 'data', { ...


    });
}

// Render visualization
function updateVisualization() {


    var rankType = d3.select("#ranking-type").property("value");


    data.sort(function(a, b) { return b[rankType] - a[rankType]; });

  	console.log(data);



    x.domain(data.map(function(d) { return d.company; }));
    y.domain([0, d3.max(data, function(d) { return d[rankType] })]);




    var xAxis = d3.axisBottom()
        .scale(x);
    var yAxis = d3.axisLeft()
        .scale(y);


    d3.select('.axis').remove();
    d3.select('.axis').remove();

	// Draw the axis
    svg.append("g")
        .attr("class", "axis x-axis")
        .attr("transform", "translate(0," + (height) + ")")
		.transition().duration(750)
        .call(xAxis);

    svg.append("g")
        .attr("class", "axis y-axis")
        .attr("transform", "translate(0, 0)")
        .transition().duration(750)
        .call(yAxis);



    // Data-join (rect now contains the update selection)
	var rect = svg.selectAll("rect")
        .data(data);

    // Enter (initialize the newly added elements)
    rect.enter().append("rect")
        .attr("class", "bar")
        // Enter and Update (set the dynamic properties of the elements)
        .merge(rect)
        .attr("x", function(d) { return x(d.company); })
        .transition()
		.duration(700)
        .attr("y", function(d) { return y(d[rankType]); })
        .attr("width", x.bandwidth())
        .attr("height", function(d) { return height - y(d[rankType]); });



    // Exit
    rect.exit().remove();

}