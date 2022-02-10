import Chartist from 'chartist';
function ctPointLabels(options) {
    return function ctPointLabels(chart) {
      var defaultOptions = {
        labelClass: 'ct-label',
        labelOffset: {
          x: 0,
          y: -10
        },
        textAnchor: 'right'
      };
  
      options = Chartist.extend({}, defaultOptions, options);
  
      if (chart instanceof Chartist.Bar) {
        chart.on('draw', function (data) {
            var barHorizontalCenter, barVerticalCenter, label, value;
            if (data.type === "bar") {
                barHorizontalCenter = data.x2 - 15;
                barVerticalCenter = data.y1 + (data.element.height() * -1) - 10;
                value = data.element.attr('ct:value');
                value = Math.round(value);
                if (value !== '0') {
                label = new Chartist.Svg('text');
                label.text(value);
                label.addClass("ct-barlabel");
                label.attr({
                    x: barHorizontalCenter,
                    y: barVerticalCenter,
                    'text-anchor': 'right'
                });
                return data.group.append(label);
                }
            }
        });
        }
    }
}
  
export default ctPointLabels;