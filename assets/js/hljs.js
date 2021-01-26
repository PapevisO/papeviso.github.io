document.addEventListener('DOMContentLoaded', (event) => {
  $.ajax({
    url: "https://papeviso.github.io/assets/js/chartBs.js",
    success: (data) => {     
      document
      .querySelector('pre code#chartBs')
      .innerText = data
                   .replace(/^.*?\r?\n/, '')
                   .replace(/\r?.*var chartData\r*(.*\r*\n*)*/, '');
      document.querySelectorAll('pre code').forEach((block) => {
        hljs.highlightBlock(block);
      });    
    },
    err: null
  });
});