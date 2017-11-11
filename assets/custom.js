$(function() {    
    var donutData,donutData1;
    d3.json('assets/jsondata.json',function(data){
        var _data = data;
        
        donutData = parseData(_data,'test status','Flow exection status');        
        var donuts = new DonutCharts('#flow_execution_chart');
        donuts.create(donutData);

        var barChartData = parseBarChartData(_data);
        drawBarchart("#scenarios_by_funcion_chart", barChartData);

        donutData1 = parseData(data,'auomated', "Behavioural test coverage");
        var donuts1 = new DonutCharts('#behavioural_test_coverage');
        donuts1.create(donutData1);
    })
});

function parseBarChartData(data){
    var dataset = d3.nest()
        .key(function(d){return d['funcional area'];})
        .rollup(function(v){return v.length;})
        .entries(data);
    
    var tmp_data = new Array();
    for(index in dataset){
        var datum = dataset[index];
                    
        tmp_data.push({
            'key':datum.key,
            'value':datum.values
        })
    }

    return tmp_data;
}

