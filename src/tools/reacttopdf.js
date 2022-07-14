import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import JsPdf from 'jspdf';
import html2canvas from 'html2canvas';

import logo from '../img/GAS-Logo.png';

class ReactToPdfMatt extends PureComponent {
  constructor(props) {
    super(props);
    this.toPdf = this.toPdf.bind(this);
    this.targetRef = React.createRef();
  }

  toPdf() {
    const { targetRef, filename, x, y, options, onComplete, backgroundColor, currentDealership, currDateString, histDateString } = this.props;
    const source = targetRef || this.targetRef;
    const targetComponent = source.current || source;
    if (!targetComponent) {
      throw new Error(
        'Target ref must be used or informed. See https://github.com/ivmarcos/react-to-pdf#usage.'
      );
    }

    html2canvas(targetComponent, {
      logging: false,
      useCORS: true,
      scale: this.props.scale
    }).then(canvas => {
        const imgData = canvas.toDataURL();

        const pdf = new JsPdf(options);
        
        const imgProps= pdf.getImageProperties(imgData);

        var pageWidth = pdf.internal.pageSize.getWidth();
        var pageHeight = pdf.internal.pageSize.getHeight();

        pdf.setFillColor(backgroundColor);
        pdf.rect(0, 0, pageWidth, pageHeight, "F");

        var image = new Image();
        image.src = logo;

        var currentHeight = 0;

        var imageWidth = 80;
        var imageHeight = 15;

         /*
            Font heights    https://www.translatorscafe.com/unit-converter/en-US/typography/13-4/point%20(computer)-millimeter/#:~:text=In%20typography%2C%20a%20point%20(pt,mm%20depending%20on%20the%20country.
            16  5.644444444444
            20  7.055555555556
            22  7.761111111111
        */

        var fontGaps = {
            16:6,
            20:8,
            22:9
        }

        var standardGap = 5;

        currentHeight = standardGap;

        pdf.addImage(image, 'PNG', pageWidth - imageWidth, currentHeight);       

        currentHeight += imageHeight + standardGap * 2;

        pdf.setTextColor("#fff");
        pdf.setFontSize(22);
        pdf.setFont("helvetica");
        pdf.text('Weekly Digital Marketing Stats', pageWidth / 2, currentHeight, {align: 'center'});

        currentHeight += fontGaps[22];

        pdf.setFontSize(16);
        pdf.text('Key Performance Indicators for this week as compared to last', pageWidth / 2, currentHeight, {align: 'center'});

        currentHeight += fontGaps[16] + standardGap * 2;

        pdf.setFontSize(20);
        pdf.text('Client: ' + currentDealership, standardGap, currentHeight);

        currentHeight += fontGaps[20];

        pdf.setFontSize(16);
        pdf.text('Current Date Range: ' + currDateString, standardGap, currentHeight);
        currentHeight += fontGaps[16];
        pdf.text('Previous Date Range: ' + histDateString, standardGap, currentHeight);
        currentHeight += fontGaps[16] + standardGap * 2;

        const imgHeight = (imgProps.height * pageWidth) / imgProps.width;
        //graph image
        pdf.addImage(imgData, 'JPEG', x, y + currentHeight, pageWidth, imgHeight);  


        //start from bottom
        currentHeight = pageHeight - imageHeight;
        
        pdf.addImage(image, 'PNG', pageWidth / 2 - (imageWidth/2), currentHeight);

        currentHeight -= standardGap * 2;

        pdf.setFontSize(16);
        pdf.text('info@doubleclutch.com', pageWidth / 2, currentHeight, {align: 'center'});
        currentHeight -= fontGaps[16];
        pdf.text('516-680-3500', pageWidth / 2, currentHeight, {align: 'center'});
        currentHeight -= fontGaps[16];
        pdf.text('Gregg Hayim', pageWidth / 2, currentHeight, {align: 'center'});
        currentHeight -= fontGaps[16];
        pdf.text('If you have any questions or concerns please reach out to us anytime.', pageWidth / 2, currentHeight, {align: 'center'});
        currentHeight -= fontGaps[16];

        pdf.save(filename);
        if (onComplete) onComplete();
    });
  }

  render() {
    const { children } = this.props;
    return children({ toPdf: this.toPdf, targetRef: this.targetRef });
  }
}

ReactToPdfMatt.propTypes = {
  filename: PropTypes.string,
  x: PropTypes.number,
  y: PropTypes.number,
  options: PropTypes.shape({}),
  scale: PropTypes.number,
  children: PropTypes.func.isRequired,
  onComplete: PropTypes.func,
  targetRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(Element) })
  ])
};

ReactToPdfMatt.defaultProps = {
  filename: 'download.pdf',
  options: undefined,
  x: 0,
  y: 0,
  scale: 1,
  onComplete: undefined,
  targetRef: undefined
};

export default ReactToPdfMatt;