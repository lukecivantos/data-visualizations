

// Load CSV file
d3.csv("data/zaatari-refugee-camp-population.csv", function(data) {


    var parseTime = d3.timeParse("%Y-%m-%d"),
        bisectDate = d3.bisector(function(d) { return d.date; }).left,
        formatTimeToolTip = d3.timeFormat("%Y-%d-%m");

    data.forEach(function (d) {
        d.population = +d.population;
        d.date = parseTime(d.date); // "June 30, 2015"
    });

    console.log(data);

    var margin = {top: 20, right: 10, bottom: 20, left: 10};
    var padding = 50;

    var width = 600 - margin.left - margin.right,
        height = 450 - margin.top - margin.bottom;

    var svg = d3.select("#left").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);

    var g = svg.append("g");

    // Returns the min. and max. value in a given array (= [6900,25000])
    var populationExtent = d3.extent(data, function (d) {
        return d.population;
    });

    var populationScale = d3.scaleLinear()
        .domain([0, populationExtent[1]])
        .range([height - padding, padding]);


    // Returns the min. and max. value in a given array (= [6900,25000])
    var timeExtent = d3.extent(data, function (d) {
        return d.date;
    });


    var timeScale = d3.scaleTime()
        .domain(timeExtent)
        .range([2 * padding, width]);

    var area = d3.area()
        .x(function (d) {
            return timeScale(d.date);
        })
        .y1(function (d) {
            return populationScale(d.population);
        })
        .y0(height - padding)


    var grad = g.append("defs")
        .append("linearGradient")
        .attr("id", "grad")
        .attr("x1", "0%")
        .attr("y1", "0%")
        .attr("x2", "0%")
        .attr("y2", "100%");
    grad.append("stop").attr("offset", "0%").attr("stop-color", "#B11313");
    grad.append("stop").attr("offset", "51%").attr("stop-color", "#B11313");
    grad.append("stop").attr("offset", "51%").attr("stop-color", "#B89681");
    grad.append("stop").attr("offset", "100%").attr("stop-color", "#B89681");

    var path = g.append("path")
        .datum(data)
        .attr("class", "area")
        .attr("d", area)
        .attr('fill', 'url(#grad)');
    var formatTime = d3.timeFormat("%b %Y");
    var xAxis = d3.axisBottom()
        .scale(timeScale)
        .tickFormat(formatTime);

    var yAxis = d3.axisLeft()
        .scale(populationScale)
        .tickValues([0, 20000, 40000, 60000, 80000, 100000, 120000, 140000, 160000, 180000, 200000]);

    // Draw the axis
    svg.append("g")
        .attr("class", "axis x-axis")
        .attr("transform", "translate(0," + (height - padding) + ")")
        .call(xAxis)
        .selectAll('text')
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr('transform', "rotate(-65)");

    svg.append("g")
        .attr("class", "axis y-axis")
        .attr("transform", "translate(" + (2 * padding) + ", 0)")
        .call(yAxis);

    svg.append("line")//making a line for legend
        .attr("x1", 2*padding)
        .attr("x2", width)
        .attr("y1", populationScale(100000) + .5)
        .attr("y2", populationScale(100000) + .5)
        .style("stroke-dasharray","5,5")//dashed array for line
        .style("stroke", "black");

    // now add titles to the axes
    svg.append("text")
        .attr("class", "labels")
        .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
        .attr("transform", "translate(" + ((padding) / 2) + "," + (height / 2) + ")rotate(-90)")  // text is drawn off the screen top left, move down and out and rotate
        .text("Population");


    svg.append("text")
        .attr("class", "top-label")
        .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
        .attr("transform", "translate(" + ((width / 2) + 60) + "," + (padding / 2) + ")")  // centre below axis
        .text("Camp Population");





    // append the rect at the intersection
    g.append("rect")
        .attr("class", "y")
        .style("fill", "none")
        .style("stroke", "none")
        .attr("width", 1)
        .attr("height", height - (2 * padding));

    // append the text at the intersection
    g.append("text")
        .attr("class", "y-population")
        .text("");

    // append the text at the intersection
    g.append("text")
        .attr("class", "y-date")
        .text("");


    // append the rectangle to capture mouse
    svg.append("rect")
        .attr('x', 2 * padding)
        .attr("width", width - padding)
        .attr("height", height)
        .style("fill", "none")
        .style("pointer-events", "all")
        .on("mouseover", function() { g.style("display", null); })
        .on("mouseout", mouseout)
        .on("mousemove", mousemove);

    function mouseout() {
        g.select("rect.y")
            .style("stroke", "none");
        g.select("text.y-population")
            .text("");
        g.select("text.y-date")
            .text("");
    }
    var commaFormat = d3.format(",");
    function mousemove() {
        var x0 = timeScale.invert(d3.mouse(this)[0]),
            i = bisectDate(data, x0, 1),
            d0 = data[i - 1],
            d1 = data[i],
            d = x0 - d0.population > d1.population - x0 ? d1 : d0;

        g.select("rect.y")
            .style("stroke", "brown")
            .attr("transform",
                "translate(" + timeScale(d.date) + "," +
                padding + ")");

        g.select("text.y-population")
            .text(commaFormat(d.population))
            .attr("transform", function () {
                if (timeScale(d.date) + 5 < width - padding) {
                    return "translate(" + (timeScale(d.date) + 5) + "," +
                        (padding + 12) + ")";
                } else {
                    return "translate(" + (timeScale(d.date) - 50) + "," +
                        (padding + 12) + ")";
                }
            });

        g.select("text.y-date")
            .text(formatTimeToolTip(d.date))
            .attr("transform", function () {
                if (timeScale(d.date) + 5 < width - padding) {
                    return "translate(" + (timeScale(d.date) + 5) + "," +
                    (padding + 28) + ")";
                } else {
                    return "translate(" + (timeScale(d.date) - 80) + "," +
                        (padding + 28) + ")";
                }
            });
    }








    // Creating new Object Array to carry information about the shelters
    var typeData = [
        {
            shelter: "Caravans",
            percentage: 79.68
        },
        {
            shelter: "Combination",
            percentage: 10.81
        },
        {
            shelter: "Tents",
            percentage: 9.51
        }
    ];

    // Setting margins and Padding - creating svg for bar chart
    var barMargin = {top: 20, right: 10, bottom: 20, left: 10};
    var barPadding = 50;

    var barWidth = 450 - barMargin.left - barMargin.right,
        barHeight = 450 - barMargin.top - barMargin.bottom;

    var barSvg = d3.select("#right").append("svg")
        .attr("width", barWidth + barMargin.left + barMargin.right)
        .attr("height", barHeight + barMargin.top + barMargin.bottom);

    // Scale values to bar chart height
    var shelterScale = d3.scaleLinear()
        .domain([0, 100])
        .range([barPadding,barHeight - barPadding]);

    console.log(typeData);

    // Create bars for chart
    barSvg.selectAll('rect')
        .data(typeData)
        .enter()
        .append('rect')
        .attr("fill", '#B89681')
        .attr("x", function (d, i) {
            return i * (barWidth / 3) + 70;
        })
        .attr("height", function(d) {
            return shelterScale(d.percentage) - barPadding;
        })
        .attr("width", (barWidth/4))
        .attr("y", function(d) {
            return barHeight - shelterScale(d.percentage);
        });

    // Set percent values at top of each rect
    barSvg.selectAll('text.percent')
        .data(typeData)
        .enter()
        .append('text')
        .attr('x', function (d, i) {
            return i * (barWidth / 3) + 30 + 70;
        })
        .attr('y', function (d) {
            return barHeight - shelterScale(d.percentage) + 20;
        })
        .text(function (d) {
            return String(d.percentage) + "%";
        });

    // Add Y axis
    var barYAxis = d3.axisLeft()
        .scale(shelterScale)
        .ticks(10)
        .tickFormat(function(d){return (100 - d) + "%"});

    barSvg.append("g")
        .attr("class", "axis y-axis")
        .attr("transform", "translate(" + (barPadding) + ", 0)")
        .call(barYAxis);

    // Add title
    barSvg.append("text")
        .attr("class", "top-label")
        .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
        .attr("transform", "translate(" + ((width / 2) - 20) + "," + (padding / 2) + ")")  // centre below axis
        .text("Type of Shelter");

    var locationScale = d3.scaleBand()
        .domain(["Caravans", "Combination*", "Tents"])
        .range([barPadding, barWidth + barPadding]);

    var barXAxis = d3.axisBottom()
        .scale(locationScale);

    // Draw the axes
    barSvg.append("g")
        .attr("class", "axis x-axis")
        .attr("transform", "translate(0," + (barHeight - barPadding) + ")")
        .call(barXAxis);
});