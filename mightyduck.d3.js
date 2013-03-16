function MightyDuck(element, data){

	this.data = data;

	// Generic Data 
	var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	var shortMonthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
	var monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

	// Settings
	width = typeof width !== 'undefined' ? width : 42;
	var width = 1000,
			height = 800;

	var xAxisShow = true,
			xAxisSize = 40,
			xAxisTicks = 4,
			xAxisOnTop = false,
			xAxisPadding = 15;

	var yAxisShow = true,
			yAxisTicks = 5,
			yAxisPadding = 10,
			yAxisOnRight = false;

	var useRandomColors = false,
			randomColorsFirst = '#aad',
			randomColorsLast = '#556';

	var	randomColors = d3.scale.linear().range([randomColorsFirst, randomColorsLast]);

	var useSetColors = true,
			setColors = ['#f26d54', '#b0e4e3', '#d8dd8c'];

	var color = randomColors;

	var fillLines = true,
			fillOpacity = 0.3;

	var stroke = true,
			strokeWidth = 1;

	var tooltips = false;


	var xMin = new Date(d3.min(data[0].values, function(d) { return d[0]; }));
	/*var xMinSUPER = function(){
		var xMinArray;
		for (var i = 0; i < data.length; i++){
			console.log(xMinArray);
			xMinArray[i] = d3.min(data[0].values, function(d) { return d[0]; });
			console.log(xMinArray);
		}
		return new Date(d3.min(xMinArray));
	}*/

	var xMax = new Date(d3.max(data[0].values, function(d) { return d[0]; }))
	var xScale = d3.time.scale()
		.domain([xMin, xMax])
		.range([0, width])
		.nice();
	var yMax = d3.max(data[0].values, function(d) { return d[1]; });
	var yScale = d3.scale.linear()
		.domain([ 0, yMax ])
		.range([height, 0])
		.nice();

	// Set Up SVG
	var svg = d3.select(element)
		.attr("width", width)
		.attr("height", height + xAxisSize);

	// Axes Settings
	var xAxis = d3.svg.axis()
	  .scale(xScale)
	  .orient("bottom")
	  .ticks(xAxisTicks)
	  .tickSize(0)
	  .tickPadding(xAxisPadding);

	var yAxis = d3.svg.axis()
	  .scale(yScale)
	  .orient("right")
	  .ticks(yAxisTicks)
	  .tickSize(0)
	  .tickPadding(yAxisPadding);

		// Tooltip Settings
	/*var tooltip = d3.svg.area()
		.style("position", "absolute")
		.style("z-index", "10")
		.style("visibility", "hidden")
		.text("a tooltip");*/

	// Add Line
	var area = d3.svg.area()
	  .x(function(d) { return xScale(new Date(d[0])); })
	  .y0(function(d) { return yScale(0); })
	  .y1(function(d) { return yScale(d[1]); })
	  .interpolate('cardinal');

	var	line = d3.svg.line()
		.x(function(d) { return xScale(new Date(d[0])); })
		.y(function(d) { return yScale(d[1]); })
		.interpolate('cardinal');

	// Text Labels
	/*if (debug === true){
		svg.selectAll('text')
			 .data(data[0].values)
			 .enter()
			 .append("text")
			 .attr("x", function(d) { return xScale(new Date(d[0])) + 12; })
			 .attr("y", function(d) { return yScale(d[1]) + 5; })
			 .text(function(d) { return shortMonthNames[new Date(d[0] * 1000).getMonth()] + " " + new Date(d[0] * 1000).getDate() + " - " + d[1]; })
			 .attr("opacity", 0.5);
	}*/

	// Draw Lines
	for (var i = 0; i < data.length; i++){
		if (useRandomColors === true){
			var dataColor = color(Math.random());
		}
		if (useSetColors === true){
			var dataColor = setColors[i % setColors.length];
		}

		// Draw Area with opacity
		if (fillLines === true){
			svg.append("path")
				.attr("class", "line")
				.attr("d", area(data[i].values))
				.style("fill", dataColor)
				.style("fill-opacity", fillOpacity);
		}
		if (stroke === true){
			svg.append("path")
				.attr("class", "line")
				.attr("d", line(data[i].values))
				.style("stroke", dataColor)
				.style("stroke-width", strokeWidth)
				.style("fill", "none");
		}
	}

	//Axes
	if (xAxisShow === true){
		svg.append("g")
			.attr("class", "x-axis")
			.attr("transform", "translate(0," + height + ")")
			.attr("dy", "10px")
			.attr("text-anchor", "middle")
			.call(xAxis);
	}
	if (yAxisShow === true){
		svg.append("g")
			.attr("class", "y-axis")
			.attr("text-anchor", "end")
			.call(yAxis);
	}

	// Tooltip
	for (var i = 0; i < data.length; i++){
		svg.append("circle")
			.attr("stroke", "black")
			.attr("fill", "")
			.attr("r", 50)
			.attr("cx", 52)
			.attr("cy", 52)
			.on("mouseover", function(){return tooltip.style("visibility", "visible");})
			.on("mousemove", function(){return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
			.on("mouseout", function(){return tooltip.style("visibility", "hidden");});
	}
}

MightyDuck.prototype.daysInMonth = function(month, year){
  var monthLength = [31,28,31,30,31,30,31,31,30,31,30,31];
  if (month != 2) return monthLength[month - 1];
  if (year % 4 != 0) return monthLength[1];
  if (year % 100 == 0 && year % 400 != 0) return monthLength[1];
  return monthLength[1] + 1;
}

MightyDuck.prototype.tooltips = function(){
  alert(this.data);
};