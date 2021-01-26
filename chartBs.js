document.addEventListener('DOMContentLoaded', function(){
  var amp = 0.1,        // active integrator gain
      linearAmp =22.2,  // inverting amplifier gain
      shift = 16777216, // active integrator accumulating division factor
                  // Initial value for normalizedA
      accumulatorA = 1000.0 * shift / amp;
  var accumulatorB = 0.0, normalizedA = 0.0,
      nextValue = 0.0,    normalizedB = 0.0;
  var labels = [], normsA = [],
      values = [], normsB = [];

  for(i=1; i<50000; i++){
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
    if(i==12960){ shift /= 4; accumulatorA /= 4; accumulatorB /= 4; }
    if(i==23768){ shift *= 4; accumulatorA *= 4; accumulatorB *= 4; }
    if(i==29000){ shift *= 2; accumulatorA *= 2; accumulatorB *= 2; }
  }
  var chartData = {//from w  ww.j a v  a 2 s.com
    CC: [{
      code: 'oscilator',
      labels: labels,
      datasets: [/*{
        label: 'value',
        backgroundColor: "rgba(255,0,0,1)",
        data: values
      },*/{
        label: 'normalizedA',
        backgroundColor: "rgba(0,127,0,1)",
        data: normsA
      },{
        label: 'normalizedB',
        backgroundColor: "rgba(0,0,127,1)",
        data: normsB
      }]
    }]
  };
  chartData.CC.forEach(function(data, index){
    var canvas = document.createElement('canvas'),
        chartId = 'chart' + data.code;
    canvas.id = chartId;
    document.body.appendChild(canvas);
    var context = document.getElementById(chartId).getContext('2d');
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
          yAxes: [{
            stacked: true
          }]
        }
      }
    });
  });
});
