$(function() {    
    var donutData,donutData1;
    d3.json('assets/data/tests1.json',function(data){     
        let _data = data;                       
        
        var donutData = parseData(data, 'Status');        
        donutChart('#flow_execution_chart', donutData,_data,'Status');

        var barChartData = parseBarChartData(_data);
        drawBarchart("#scenarios_by_funcion_chart", barChartData,_data,'Functional area');
        drawHeatmap("#heatmap_functional_area", barChartData,_data,'Functional area');

        var donutData1 = parseData(data,'Automated');
        donutChart('#behavioural_test_coverage', donutData1,_data, 'Automated');                
        $('[data-toggle="tooltip"]').tooltip({container: '#table_data'}); 
    });
    d3.json('assets/data/api_tests.json',function(data){     
        let _data = data;                       
        
        var donutData = parseData(data, 'Status');        
        donutChart('#flow_execution_chart', donutData,_data,'Status');
                     
    })      
});

function parseBarChartData(data){
    var dataset = d3.nest()
        .key(function(d){return d['Functional area'];})
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
                "name":cat[j],
                "total":counts[j]
            });
        }

    return tmp_data;
}