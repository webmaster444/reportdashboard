function drawHeatmap(chartWrapper, dataset,oData,selectedKey){
var margin = {top:50, right:0, bottom:100, left:30},
		width=960-margin.left-margin.right,
		height=250-margin.top-margin.bottom,
		gridSize=Math.floor(width/24),
		legendElementWidth=gridSize*2.665,
		buckets = 10,

		colors = ["#f7fcf0","#e0f3db","#ccebc5","#a8ddb5","#7bccc4","#4eb3d3","#2b8cbe","#0868ac","#084081"],
		days = [],
	times = [];
	
	var heatmap;
	var legend;

for(var index in dataset){	
	times.push(dataset[index].key);
}
gridSize = Math.floor(width / times.length);


	var svg = d3.select(chartWrapper).append("svg")
		.attr("width",'100%')
		.attr("height", '100%')
		.attr('viewBox', '0 0 '+ parseInt(width + margin.left+margin.right) + ' ' + parseInt(height+margin.top+margin.bottom))
		.append("g")
		.attr("transform", "translate("+ margin.left+","+margin.top+")");		
			
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
		.attr("x", function(d,i) {return i * gridSize;})
		.attr("y", 0)
		.attr("rx", 4)
		.attr("ry", 4)
		.attr("class", "hour bordered")
		.attr("width", gridSize)
		.attr("height", gridSize)
		.style("fill", colors[0]).on('click',function(d){console.log(d); tabulate(oData,['Id','Flow','Status'], selectedKey, d.key, svg);});
		
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
		.text(function(d) {return "≥ "+d.toString().substr(0,1);})
		.attr("x", function(d, i){ return legendElementWidth *i;})
		.attr("y", height+ gridSize);		

function tabulate(data, columns, selectedKey, selectedValue,context) {   
  d3.select('#table_data').html('');
  var table = d3.select('#table_data').append('table')
  var thead = table.append('thead')
  var tbody = table.append('tbody');

  // append the header row
  thead.append('tr')
    .selectAll('th')
    .data(columns).enter()
    .append('th')
      .text(function (column) { return column; });

  // create a row for each object in the data
  var rows = tbody.selectAll('tr')
    .data(oData.filter(function(d){
    return d[selectedKey] == selectedValue;
  }))
    .enter()
    .append('tr').attr('data-toggle','tooltip').attr('title',function(d){
      return d.Scenario;
    });

  // // create a cell in each row for each column
  var cells = rows.selectAll('td')
    .data(function (row) {                  
      return columns.map(function (column) {        
        return {column: column, value: row[column]};
      });
    })
    .enter()    
    .append('td')    
    .text(function (d) { return d.value; });

  return table;

}							
}