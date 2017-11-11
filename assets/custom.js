$(function() {    
    var donutData,donutData1;
    d3.json('assets/jsondata.json',function(data){
        var _data = data;
        
        donutData = parseData(_data,'test status','Flow exection status');        
        var donuts = new DonutCharts('#flow_execution_chart');
        donuts.create(donutData);

        drawBarchart("#scenarios_by_funcion_chart", _data);

        donutData1 = parseData(data,'auomated', "Behavioural test coverage");
        var donuts1 = new DonutCharts('#behavioural_test_coverage');
        donuts1.create(donutData1);
    })
});