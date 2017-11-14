function drawHeatmap(chartWrapper, dataset,oData,selectedKey){
var margin = {top:50, right:0, bottom:100, left:30},
		width=960-margin.left-margin.right,
		height=430-margin.top-margin.bottom,
		gridSize=Math.floor(width/24),
		legendElementWidth=gridSize*2.665,
		buckets = 10,

		colors = ["#f7fcf0","#e0f3db","#ccebc5","#a8ddb5","#7bccc4","#4eb3d3","#2b8cbe","#0868ac","#084081"],
		days = ["Mo"],
	times = [];
	
	var heatmap;
	var legend;

for(var index in dataset){	
	times.push(dataset[index].key);
}
console.log(times);


	var svg = d3.select(chartWrapper).append("svg")
		.attr("width",width + margin.left+margin.right)
		.attr("height", height+margin.top+margin.bottom)
		.append("g")
		.attr("transform", "translate("+ margin.left+","+margin.top+")");
	
	
		// return {
		// 	day:+d.day2,
		// 	hour:+d.hour,
		// 	value:+d.per_day_per_hour
		// 	};
		// },		
						
			
			var colorScale = d3.scale.quantile()
				.domain([0, (d3.max(dataset, function(d){return d.value;})/2), d3.max(dataset, function(d){return d.value;})])
				.range(colors);


			var dayLabels = svg.selectAll(".dayLabel")
				.data(days)
				.enter().append("text")
				.text(function (d) {return d; })
				.attr("y", function (d, i){ return i*gridSize;})
				.style("text-anchor", "end")
				.attr("transform", "translate(-6," + gridSize/1.5+")")
				.attr("class", function(d, i) { return ((i>=0 && i<=4) ? "dayLabel mono axis axis-workweek": "dayLabel mono axis"); });
				
			var timeLabels = svg.selectAll(".timeLabel")
				.data(times)
				.enter().append("text")
				.text(function(d){return d;})
				.attr("x", function(d,i) {return i * gridSize;})
				.attr("y",0)
				.style("text-anchor", "middle")
				.attr("transform", "translate(" + gridSize/2+", -6)")
				.attr("class", function(d, i) { return ((i>=9 && i<= 17) ? "timeLabel mono axis axis-worktime": "timeLabel mono axis"); });
				
			var heatMap = svg.selectAll(".hour")
				.data(dataset)
				.enter().append("rect")
				.attr("x", function(d) {return (d.hour) * gridSize;})
				.attr("y", function(d) {return (d.day) * gridSize;})
				.attr("rx", 4)
				.attr("ry", 4)
				.attr("class", "hour bordered")
				.attr("width", gridSize)
				.attr("height", gridSize)
				.style("fill", colors[0]);
				
			heatMap.transition().duration(1000)
				.style("fill", function(d){ return colorScale(d.value);});
				
			heatMap.append("title").text(function(d) {return d.value;});
			
			var legend = svg.selectAll(".legend")
				.data([0].concat(colorScale.quantiles()), function(d) {return d;})
				.enter().append("g")
				.attr("class", "legend");
			
			legend.append("rect")
				.attr("x", function(d, i){ return legendElementWidth * i;})
				.attr("y", height)
				.attr("width", legendElementWidth)
				.attr("height", gridSize/2)
				.style("fill", function(d, i) {return colors[i]; });
			
			legend.append("text")
				.attr("class", "mono")
				.text(function(d) {return "≥ "+d.toString().substr(0,4);})
				.attr("x", function(d, i){ return legendElementWidth *i;})
				.attr("y", height+ gridSize);							

}