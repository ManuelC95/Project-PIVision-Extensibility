//----------------------------------------------------3D Barrel Cylinder-------------------------------------------------//
(function (CS) {
	// Specify the symbol definition	
	var myCustomSymbolDefinition = {
		// Specify the unique name for this symbol
		typeName: '3dBarrasCilindro',
		// Specify the user-friendly name of the symbol that will appear in PI Vision
		displayName: '3dBarrasCilindro',
		// Specify the number of data sources for this symbol; just a single data source or multiple
		datasourceBehavior: CS.Extensibility.Enums.DatasourceBehaviors.Multiple,
		// Specify the location of an image file to use as the icon for this symbol
		iconUrl: '/Scripts/app/editor/symbols/ext/Icons/piper.png',
		visObjectType: symbolVis,
		// Specify default configuration for this symbol
		getDefaultConfig: function () {
			return {
				DataShape: 'TimeSeries',
				DataQueryMode: CS.Extensibility.Enums.DataQueryMode.ModeEvents,
				FormatType: null,
				// Specify the default height and width of this symbol
				Height: 700,
				Width: 900,
				// Allow large queries
				Intervals: 1000,
				// Specify the value of custom configuration options
				minimumYValue: 0,
				maximumYValue: 100,				
				yAxisRange: 'allSigma',
				showTitle: false,
				textColor: "black",
				fontSize: 12,
				backgroundColor: "transparent",
				gridColor: "transparent",
				plotAreaFillColor: "transparent",
				barColor1: "red",
				showLegend: true,
				showChartScrollBar: false,
				legendPosition: "bottom",
				useColumns: false,
				decimalPlaces: 1,
				bulletSize: 8,
				customTitle: ""
			};
		},
		// Allow use in collections!
		supportsCollections: true,
		// By including this, you're specifying that you want to allow configuration options for this symbol
		configOptions: function () {
			return [{
				// Add a title that will appear when the user right-clicks a symbol
				title: 'Editar Formato',
				// Supply a unique name for this cofiguration setting, so it can be reused, if needed
				mode: 'format'
		}];
		}
		
	};
	//************************************
	// Function called to initialize the symbol
	//************************************
	function symbolVis() {}
	CS.deriveVisualizationFromBase(symbolVis);
	symbolVis.prototype.init = function (scope, elem) {
		// Specify which function to call when a data update or configuration change occurs 
		this.onDataUpdate = myCustomDataUpdateFunction;           
		this.onConfigChange = myCustomConfigurationChangeFunction;
		// Locate the html div that will contain the symbol, using its id, which is "container" by default
		var symbolContainerDiv = elem.find('#container')[0];
		// Use random functions to generate a new unique id for this symbol, to make it unique among all other custom symbols
		var newUniqueIDString = "myCustomSymbol_" + Math.random().toString(36).substr(2, 16);
		// Write that new unique ID back to overwrite the old id
		symbolContainerDiv.id = newUniqueIDString;
		var chart = false;
		var dataArray = [];

		//************************************
		// Extract the data item labels from a new update
		//************************************
		
		//************************************
		// When a data update occurs...
		//************************************
		function myCustomDataUpdateFunction(data) {
			var a;
			// If there is indeed new data in the update
			if (data !== null && data.Data) {
				dataArray = [];
				if (data.Data[0].Label) {
					var stringLabel1 = data.Data[0].Label;
				}
				if (data.Data[0].Units) {
					var stringUnits1 = data.Data[0].Units;
				}
				var b;
				for (var i = 0; i < data.Data[0].Values.length; i++) {
					var today = data.Data[0].Values[i].Time;
					var monthNow = today.slice(today.indexOf("-") + 1, today.indexOf("-", today.indexOf("-") + 1));
					var dayNow = today.slice(today.indexOf("-") + 4, today.indexOf("T"));									
                    var yearNow = today.substr(today.indexOf("/", today.indexOf("/") + 1) + 1, 4);
					HoraMinuto = today.slice(today.indexOf("T")+1,today.indexOf("Z")-3);
					a=dayNow+"/"+monthNow+"/"+yearNow;
					b = HoraMinuto; 	
					// Create a new event object
					var newDataObject = {
						"timestamp": a,
						"hora":b,
						"value": parseFloat( ("" + data.Data[0].Values[i].Value).replace(",", ".") ),	   
					};			
					dataArray.push(newDataObject);
					
					}
					
				// Create the custom visualization
				if (!chart) {
					console.log("aca"+a);
					// Create the chart
					chart = AmCharts.makeChart(symbolContainerDiv.id, {
						"type": "serial",
						"categoryField": "category",
						"backgroundAlpha": 0.18,
						"backgroundColor": scope.config.backgroundColor,
						"gridAboveGraphs": false,
						"startEffect": "easeInSine",
						"angle": 30,
						"depth3D": 30,
						"pathToImages": "Scripts/app/editor/symbols/ext/images/",
						"startDuration": 1,
						"categoryAxis": {
							"gridPosition": "start",
							"gridAlpha": 0.89,
							"gridColor": scope.config.gridColor
						},
						"trendLines": [],
						"graphs": [
							{
								"balloonText": stringLabel1+"\n"+"Valor : [[value]]\n[[timestamp]]",
								"id": "AmGraph-1",
								"title": stringLabel1,
								"type": "column",
								"topRadius": 1,
								"valueField": "value",
								"fillAlphas": 0.7,
								"fillColors": scope.config.barColor1,
								"lineColor": scope.config.barColor1
							},	
						],
						"guides": [],
						"valueAxes": [
							{
								"id": "ValueAxis-1",
								"title": stringLabel1
							}
						],
						"allLabels": [],
						"balloon": {},
						"legend": {
							"fontSize": scope.config.fontSize,
							"position": scope.config.legendPosition,
							"equalWidths": false,                                
							"enabled": scope.config.showLegend,
							"valueAlign": "right",
							"horizontalGap": 10,
							"useGraphSettings": true,
							"markerSize": 10
						},
						"titles": [
							{
								"id": "Title-1",
								"size": 15,
								"text": "Chart Title"
							}
						],
						
						  "chartCursor": {
							"limitToGraph": "L4",
							"fullWidth": true,
							"cursorAlpha": 1,
							"text": a						
						  },
						 
						  "export": {
							"enabled": true,
							"menuReviver": function(item,li) {
							  if (item.format == "XLSX") {
								item.name = "My sheet";
							  }
							  return li;
							}
						  },
						  "chartScrollbar": {
							"graph": "AmGraph-1",
							"graphType": "column",
							"position": "bottom",
							"scrollbarHeight": 20,
							"autoGridCount": true,
							"enabled": scope.config.showChartScrollBar,
							"dragIcon": "dragIconRectSmall",
							"backgroundAlpha": 1,
							"backgroundColor": "#000000",
							"selectedBackgroundAlpha": 0.2
						},
						"dataProvider": dataArray,
						"categoryField": "hora",    
					});
				} else {
					// Update the title
					if (scope.config.showTitle) {
						chart.titles = createArrayOfChartTitles();
					} else {
						chart.titles = null;
					} // Refresh the graph					
					chart.dataProvider = dataArray;
					chart.validateData();
					chart.validateNow();
				}
			}
		 }
		function createArrayOfChartTitles() {
				// Build the titles array
				var titlesArray;
				if (scope.config.useCustomTitle) {
					titlesArray = [
						{
							"text": scope.config.customTitle,
							"size": (scope.config.fontSize + 3)
				}
			];
				} else {
					titlesArray = [
						{
							"text": " " /*+ convertMonthToString(monthNow)*/,
							"bold": true,
							"size": (scope.config.fontSize + 3)
				}
			];
				}
				return titlesArray;
			}
		//var oldLabelSettings;
		function myCustomConfigurationChangeFunction(data) {		
				if (chart) {
					// Update the title
					if (scope.config.showTitle) {
						chart.titles = createArrayOfChartTitles();
					} else {
						chart.titles = null;
					}
					// Update colors and fonts
					if (chart.color !== scope.config.textColor) {
						chart.color = scope.config.textColor;
					}
					//Update background color
					if (chart.backgroundColor !== scope.config.backgroundColor) {
						chart.backgroundColor = scope.config.backgroundColor;
					}
					if (chart.plotAreaFillColors !== scope.config.plotAreaFillColor) {
						chart.plotAreaFillColors = scope.config.plotAreaFillColor;
					}
					//para el grid
					if(chart.categoryAxis.gridColor !== scope.config.gridColor){
						chart.categoryAxis.gridColor = scope.config.gridColor;
					}
					//Update color of the graphic
					if (chart.graphs[0].fillColors !== scope.config.barColor1) {
						chart.graphs[0].fillColors = scope.config.barColor1;
					}
					//Para cambiar el color de la linea de contorno
					if (chart.graphs[0].lineColor !== scope.config.barColor1) {
						chart.graphs[0].lineColor = scope.config.barColor1;
					}			   
					chart.legend.enabled = scope.config.showLegend;
					chart.legend.position = scope.config.legendPosition;
					// Commit updates to the chart
					chart.validateNow();
					
				}
			}

		};

		// Register this custom symbol definition with PI Vision
		CS.symbolCatalog.register(myCustomSymbolDefinition);

	})(window.PIVisualization);
