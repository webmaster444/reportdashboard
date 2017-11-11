$(function() {    
    var donutData,donutData1;
    d3.json('assets/jsondata.json',function(data){
        var _data = data;
        
        donutData = parseData(_data,'test status');        
        var donuts = new DonutCharts('#flow_execution_chart');
        donuts.create(donutData);
        
        donutData1 = parseData(data,'auomated');
        var donuts1 = new DonutCharts('#behavioural_test_coverage');
        donuts1.create(donutData1);


    })
});
    

    function DonutCharts(chartWrapper) {

        var charts = d3.select(chartWrapper);

        var chart_m,
            chart_r,
            color = d3.scale.category20();

        var getCatNames = function(dataset) {
            var catNames = new Array();

            for (var i = 0; i < dataset[0].data.length; i++) {
                catNames.push(dataset[0].data[i].cat);
            }

            return catNames;
        }

        var createLegend = function(catNames) {
            var legends = charts.select('.legend')
                            .selectAll('g')
                                .data(catNames)
                            .enter().append('g')
                                .attr('transform', function(d, i) {
                                    return 'translate(' + (i * 150 + 50) + ', 10)';
                                });
    
            legends.append('circle')
                .attr('class', 'legend-icon')
                .attr('r', 6)
                .style('fill', function(d, i) {
                    return color(i);
                });
    
            legends.append('text')
                .attr('dx', '1em')
                .attr('dy', '.3em')
                .text(function(d) {
                    return d;
                });
        }

        var createCenter = function(pie) {

            var eventObj = {
                'mouseover': function(d, i) {
                    d3.select(this)
                        .transition()
                        .attr("r", chart_r * 0.65);
                },

                'mouseout': function(d, i) {
                    d3.select(this)
                        .transition()
                        .duration(500)
                        .ease('bounce')
                        .attr("r", chart_r * 0.6);
                },

                'click': function(d, i) {
                    var paths = charts.selectAll('.clicked');
                    pathAnim(paths, 0);
                    paths.classed('clicked', false);
                    resetAllCenterText();
                }
            }

            var donuts = d3.selectAll('.donut');

            // The circle displaying total data.
            donuts.append("svg:circle")
                .attr("r", chart_r * 0.6)
                .style("fill", "#E7E7E7")
                .on(eventObj);
    
            donuts.append('text')
                    .attr('class', 'center-txt type')
                    .attr('y', chart_r * -0.16)
                    .attr('text-anchor', 'middle')
                    .style('font-weight', 'bold')
                    .text(function(d, i) {
                        return d.type;
                    });
            donuts.append('text')
                    .attr('class', 'center-txt value')
                    .attr('text-anchor', 'middle');
            donuts.append('text')
                    .attr('class', 'center-txt percentage')
                    .attr('y', chart_r * 0.16)
                    .attr('text-anchor', 'middle')
                    .style('fill', '#A2A2A2');
        }

        var setCenterText = function(thisDonut) {
            var sum = d3.sum(thisDonut.selectAll('.clicked').data(), function(d) {
                return d.data.val;
            });

            thisDonut.select('.value')
                .text(function(d) {
                    return (sum)? sum.toFixed(1) + d.unit
                                : d.total.toFixed(1) + d.unit;
                });
            thisDonut.select('.percentage')
                .text(function(d) {
                    return (sum)? (sum/d.total*100).toFixed(2) + '%'
                                : '';
                });
        }

        var resetAllCenterText = function() {
            charts.selectAll('.value')
                .text(function(d) {
                    return d.total.toFixed(1) + d.unit;
                });
            charts.selectAll('.percentage')
                .text('');
        }

        var pathAnim = function(path, dir) {
            switch(dir) {
                case 0:
                    path.transition()
                        .duration(500)
                        .ease('bounce')
                        .attr('d', d3.svg.arc()
                            .innerRadius(chart_r * 0.7)
                            .outerRadius(chart_r)
                        );
                    break;

                case 1:
                    path.transition()
                        .attr('d', d3.svg.arc()
                            .innerRadius(chart_r * 0.7)
                            .outerRadius(chart_r * 1.08)
                        );
                    break;
            }
        }

        var updateDonut = function() {

            var eventObj = {

                'mouseover': function(d, i, j) {
                    pathAnim(d3.select(this), 1);

                    var thisDonut = charts.select('.type' + j);
                    thisDonut.select('.value').text(function(donut_d) {
                        return d.data.val.toFixed(1) + donut_d.unit;
                    });
                    thisDonut.select('.percentage').text(function(donut_d) {
                        return (d.data.val/donut_d.total*100).toFixed(2) + '%';
                    });
                },
                
                'mouseout': function(d, i, j) {
                    var thisPath = d3.select(this);
                    if (!thisPath.classed('clicked')) {
                        pathAnim(thisPath, 0);
                    }
                    var thisDonut = charts.select('.type' + j);
                    setCenterText(thisDonut);
                },

                'click': function(d, i, j) {
                    var thisDonut = charts.select('.type' + j);

                    if (0 === thisDonut.selectAll('.clicked')[0].length) {
                        thisDonut.select('circle').on('click')();
                    }

                    var thisPath = d3.select(this);
                    var clicked = thisPath.classed('clicked');
                    pathAnim(thisPath, ~~(!clicked));
                    thisPath.classed('clicked', !clicked);

                    setCenterText(thisDonut);
                }
            };

            var pie = d3.layout.pie()
                            .sort(null)
                            .value(function(d) {
                                return d.val;
                            });

            var arc = d3.svg.arc()
                            .innerRadius(chart_r * 0.7)
                            .outerRadius(function() {
                                return (d3.select(this).classed('clicked'))? chart_r * 1.08
                                                                           : chart_r;
                            });

            // Start joining data with paths
            var paths = charts.selectAll('.donut')
                            .selectAll('path')
                            .data(function(d, i) {
                                return pie(d.data);
                            });

            paths
                .transition()
                .duration(1000)
                .attr('d', arc);

            paths.enter()
                .append('svg:path')
                    .attr('d', arc)
                    .style('fill', function(d, i) {
                        return color(i);
                    })
                    .style('stroke', '#FFFFFF')
                    .on(eventObj)

            paths.exit().remove();

            resetAllCenterText();
        }

        this.create = function(dataset) {
            var $charts = $(chartWrapper);
            chart_m = $charts.innerWidth() / dataset.length / 2 * 0.14;
            chart_r = $charts.innerWidth() / dataset.length / 2 * 0.85;

            charts.append('svg')
                .attr('class', 'legend')
                .attr('width', '100%')
                .attr('height', 50)
                .attr('transform', 'translate(0, -100)');

            var donut = charts.selectAll('.donut')
                            .data(dataset)
                        .enter().append('svg:svg')
                            .attr('width', (chart_r + chart_m) * 2)
                            .attr('height', (chart_r + chart_m) * 2)
                        .append('svg:g')
                            .attr('class', function(d, i) {
                                return 'donut type' + i;
                            })
                            .attr('transform', 'translate(' + (chart_r+chart_m) + ',' + (chart_r+chart_m) + ')');

            createLegend(getCatNames(dataset));
            createCenter();

            updateDonut();
        }
    
        this.update = function(dataset) {
            // Assume no new categ of data enter
            var donut = charts.selectAll(".donut")
                        .data(dataset);

            updateDonut();
        }
    }


    /*
     * Returns a json-like object.
     */
    function genData() {
        var type = ['Flow execution Status'];
        var unit = ['M', 'GB', ''];
        var cat = ['Pass', 'Fail', 'No Run'];

        var dataset = new Array();

        for (var i = 0; i < type.length; i++) {
            var data = new Array();
            var total = 0;

            for (var j = 0; j < cat.length; j++) {
                var value = Math.random()*10*(3-i);
                total += value;
                data.push({
                    "cat": cat[j],
                    "val": value
                });
            }

            dataset.push({
                "type": type[i],
                "unit": unit[i],
                "data": data,
                "total": total
            });
        }
        return dataset;
    }

    function parseData(data,filterKey){                
        var datasetByTestStatus = d3.nest()
        .key(function(d){return d[filterKey];})
        .rollup(function(v){return v.length;})
        .entries(data);
                
        var data1 = Object.values(datasetByTestStatus);        

        var cat = [];
        var counts = [];
        for(index in data1){
            var tmp_array = Object.values(data1[index]);
            cat.push(tmp_array[0]);
            counts.push(tmp_array[1]);
        }

        var total = 0;
        for(count in counts){
            total +=counts[count];
        }
        
    
        var dataset = new Array();
        var tmp_data = new Array();
        for(var j=0; j<cat.length; j++){
            tmp_data.push({
                "cat":cat[j],
                "val":counts[j]
            });
        }

        dataset.push({
            "type":"Flow execution Status",
            "unit":"",
            "data":tmp_data,
            "total":total
        });
        return dataset;        
    }