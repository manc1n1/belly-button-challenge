const url =
	'https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json';

d3.json(url).then((data) => {
	const metadata = data.metadata;
	const samples = data.samples;

	samples.forEach((sample, index) => {
		d3.select('#selDataset')
			.append('option')
			.text(sample.id)
			.property('value', index);
	});

	function createBarChart(selectedIndex) {
		let otu_ids = selectedIndex.otu_ids.slice(0, 10).reverse();
		let sample_values = selectedIndex.sample_values.slice(0, 10).reverse();
		let otu_labels = selectedIndex.otu_labels.slice(0, 10).reverse();

		let trace = {
			x: sample_values,
			y: otu_ids.map((id) => `OTU ${id}`),
			text: otu_labels,
			type: 'bar',
			orientation: 'h',
		};

		let data = [trace];

		Plotly.newPlot('bar', data);
	}

	function createBubbleChart(selectedIndex) {
		var trace = {
			x: selectedIndex.otu_ids,
			y: selectedIndex.sample_values,
			text: selectedIndex.otu_labels,
			mode: 'markers',
			marker: {
				size: selectedIndex.sample_values,
				color: selectedIndex.otu_ids,
				colorscale: 'Viridis',
				opacity: 0.7,
			},
		};

		var data = [trace];

		Plotly.newPlot('bubble', data);
	}

	function createGaugeChart(wfreq) {
		let data = [
			{
				domain: { x: [0, 1], y: [0, 1] },
				value: wfreq,
				title: {
					text: '<b>Belly Button Washing Frequency</b><br>Scrubs per Week',
				},
				type: 'indicator',
				mode: 'gauge+number',
				gauge: {
					axis: { range: [null, 9] },
					steps: [
						{ range: [0, 1], color: '#f7f7f7' },
						{ range: [1, 2], color: '#e5e5e5' },
						{ range: [2, 3], color: '#d4d4d4' },
						{ range: [3, 4], color: '#c2c2c2' },
						{ range: [4, 5], color: '#b0b0b0' },
						{ range: [5, 6], color: '#9e9e9e' },
						{ range: [6, 7], color: '#8c8c8c' },
						{ range: [7, 8], color: '#7a7a7a' },
						{ range: [8, 9], color: '#686868' },
					],
				},
			},
		];

		Plotly.newPlot('gauge', data);
	}

	function demographicInfo(selectedIndex) {
		let header = d3.select('#sample-metadata');
		header.selectAll('strong').remove();
		header.selectAll('span').remove();
		header.selectAll('br').remove();
		Object.entries(metadata[selectedIndex]).forEach(([key, value]) => {
			header.append('strong').text(`${key}: `);
			header.append('span').text(`${value}`);
			header.append('br');
		});
	}

	createBarChart(samples[0]);
	createBubbleChart(samples[0]);
	demographicInfo(0);
	createGaugeChart(metadata[0].wfreq);

	function updateCharts(selectedIndex) {
		createBarChart(samples[selectedIndex]);
		createBubbleChart(samples[selectedIndex]);
		demographicInfo(selectedIndex);
		createGaugeChart(metadata[selectedIndex].wfreq);
	}

	d3.select('#selDataset').on('change', function () {
		let selectedIndex = this.value;
		updateCharts(selectedIndex);
	});
});
