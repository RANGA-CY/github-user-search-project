import React from 'react';
import ReactFC from 'react-fusioncharts';
import FusionCharts from 'fusioncharts';
import Chart from 'fusioncharts/fusioncharts.charts';
import FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';
ReactFC.fcRoot(FusionCharts, Chart, FusionTheme);

const ChartComponent = ({ data }) => {
  const chartConfigs = {
    type: 'pie3d', // The chart type
    width: '100%', // Width of the chart
    height: '400', // Height of the chart
    dataFormat: 'json', // Data type
    dataSource: {
      // Chart Configuration
      chart: {
        caption: 'languages',
        theme: 'fusion',
        decimals: 0,
        pieRadius: '35%',
      },
      // Chart Data
      data,
    },
  };
  return <ReactFC {...chartConfigs} />;
};
// STEP 4 - Creating the DOM element to pass the react-fusioncharts component
// class App extends React.Component {
//   render() {
//     return <ReactFC {...chartConfigs} />;
//   }
// }

// export default App;
export default ChartComponent;
