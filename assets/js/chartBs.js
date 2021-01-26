document.addEventListener('DOMContentLoaded', function(){
  var amp = 0.1;        /* active integrator gain */
  var linearAmp =22.2;  /* inverting amplifier gain */
  var shift = 16777216; /* active integrator accumulating division factor */
                  /* Initial value for normalizedA */
                  /* |     | */
  var accumulatorA = -1000.0 * shift;
                  /* \_____/ */
  var accumulatorB = 0.0, normalizedA = 0.0,
      nextValue = 0.0,    normalizedB = 0.0;
  var labels = [], normsA = [],
      values = [], normsB = [];

  for(i=1; i<50000; i++){
    /* nextValue incomes as a closed-loop to R1 from DA3 */
    var thisValue = -nextValue * linearAmp
    accumulatorA += thisValue;
    thisValue = accumulatorA / shift;
    accumulatorA -= thisValue;
    normalizedA = thisValue * amp;
    thisValue = -normalizedA
    accumulatorB += thisValue;
    thisValue = accumulatorB / shift;
    accumulatorB -= thisValue;
    normalizedB = thisValue * amp;
    nextValue += normalizedA + normalizedB;
    if(i % 50 == 0){
      labels.push(i);
      values.push(nextValue);
      normsA.push(normalizedA);
      normsB.push(normalizedB);
    }
    /* time constant of integrators is changed at the following time steps */
    if(i==8640){ shift /= 4; accumulatorA /= 4; accumulatorB /= 4; }
    /* if(i==23768){ shift *= 4; accumulatorA *= 4; accumulatorB *= 4; } */
    /* if(i==29000){ shift *= 2; accumulatorA *= 2; accumulatorB *= 2; } */
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
