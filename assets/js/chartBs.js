document.addEventListener('DOMContentLoaded', function(){
  class BaseActiveIntegrator {
    constructor(initNormalized){
      this.divisionFactor = 2048; /* active integrator _*/
        /*_ applies division factor to evaluate a normalized value */
      if(typeof(initNormalized) === "undefined"){
        this.accumulated = 0;
      } else {
        this.accumulated = initNormalized * this.divisionFactor;
      }
      this.evaluateNextNormalized()
    }
  
    evaluateNextNormalized() {
      this.normalized = this.accumulated / this.divisionFactor;
    }
  
    putValue(value){
      this.accumulated += value;
      this.evaluateNextNormalized();
      // this.accumulated -= this.normalized;
    }
  
    getValue(){
      return this.normalized;
    }
  }

      /* Initialize integratorA with normalized value */
  var IntegratorA = new BaseActiveIntegrator(1.0);
      /* Initialize integratorB with normalized value */
  var IntegratorB = new BaseActiveIntegrator(0.0);

  var labels = [], normsA = [],
      values = [], normsB = [];
  var nextValue = 0.0;

  for(i=1; i<50000; i++){
    /* nextValue incomes as a closed-loop to R1 from DA3 */
    var thisValue = -nextValue;
    IntegratorA.putValue(thisValue);
    thisValue = -IntegratorA.normalized;
    IntegratorB.putValue(thisValue);
    nextValue = -IntegratorB.normalized;
    if(i % 120 == 0){
      labels.push(i/60);
      values.push(nextValue);
      normsA.push(IntegratorA.normalized);
      normsB.push(IntegratorB.normalized);
    }
  }
  var chartData = {/* from w  ww.j a v  a 2 s.com */
    CC: [{
      code: 'oscilator',
      labels: labels,
      datasets: [{
        label: 'value',
        backgroundColor: "rgba(255,0,0,0.5)",
        data: values
      },{
        label: 'normalizedA',
        backgroundColor: "rgba(0,127,0,0.5)",
        data: normsA
      },{
        label: 'normalizedB',
        backgroundColor: "rgba(0,0,127,0.5)",
        data: normsB
      }]
    }]
  };
  chartData.CC.forEach(function(data, index){
    var canvas = document.createElement('canvas'),
        chartId = 'chart' + data.code;
    canvas.id = chartId;
    document.querySelector('.content .charts').appendChild(canvas);
    var context = document.getElementById(chartId).getContext('2d');
    var scales = JSON.parse(JSON.stringify(data.datasets));
    scales.map((data) => {
      data["stacked"] = true;
      data["id"] = data["label"];
      delete data["label"];
    });
    data.datasets.map((data) => {
      data["yAxisID"] = data["label"];
    });
    console.log('scales', scales);
    window[chartId] = new Chart(context, {
      type: 'bar',
      data: data,
      options: {
        title: {
          display: true,
          text: data.code
        },
        tooltips: {
          mode: 'index',
          intersect: false
        },
        responsive: true,
        scales: {
          xAxes: [{
            stacked: true,
          }],
          yAxes: scales
        }
      }
    });
  });
});
