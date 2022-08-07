const videoGameSalesURL =
	'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json';

const width = 1000;
const height = 600;

let videoGameSalesData;

const canvas = d3.select('#canvas');
const tooltip = d3.select('#tooltip');

canvas.attr('width', width).attr('height', height);

const drawTreeMap = () => {
	let root = d3
		.hierarchy(videoGameSalesData, (node) => node['children'])
		.sum((node) => (m = node['value']))
		.sort((node1, node2) => node2['value'] - node1['value']);

	let createTreeMap = d3.treemap().size([1000, 600]).paddingInner(1);

	createTreeMap(root);
	let gameTiles = root.leaves();
	console.log(gameTiles);

	let block = canvas
		.selectAll('g')
		.data(gameTiles)
		.enter()
		.append('g')
		.attr('transform', (game) => `translate(${game['x0']},${game['y0']})`);

	block
		.append('rect')
		.attr('class', 'tile')
		.attr('fill', (game) => {
			let category = game['data']['category'];

			switch (category) {
				case 'Wii':
					return 'blue';
				case 'GB':
					return 'limegreen';
				case 'PS2':
					return 'red';
				case 'SNES':
					return 'lightblue';
				case 'GBA':
					return 'pink';
				case '2600':
					return 'khaki';
				case 'DS':
					return 'tan';
				case 'PS3':
					return 'green';
				case '3DS':
					return 'purple';
				case 'PS':
					return 'yellow';
				case 'XB':
					return 'teal';
				case 'PSP':
					return 'magenta';
				case 'X360':
					return 'coral';
				case 'NES':
					return 'orange';
				case 'PS4':
					return 'gold';
				case 'N64':
					return 'lightgreen';
				case 'PC':
					return 'bisque';
				case 'XOne':
					return 'gray';
				default:
					break;
			}
		})
		.attr('data-name', (game) => game['data']['name'])
		.attr('data-category', (game) => game['data']['category'])
		.attr('data-value', (game) => game['data']['value'])
		.attr('width', (game) => game['x1'] - game['x0'])
		.attr('height', (game) => game['y1'] - game['y0'])
		.on('mouseover', (event, game) => {
			tooltip
				.transition()
				.duration(1)
				.style('visibility', 'visible')
				.style('opacity', 0.8)
				.attr('data-value', game['data']['value'])
				.style('left', event.pageX - 10 + 'px')
				.style('top', event.pageY - 28 + 'px');

			// let revenue = movie['data']['value'].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

			tooltip.html(
				`Name: ${game['data']['name']}<br/> Category: ${game['data']['category']}<br/>  Value: ${game['data']['value']}`
			);
		})
		.on('mouseout', (game) => {
			tooltip.transition().duration(1).style('visibility', 'hidden');
		});

	block
		.append('text')
		.text((game) => game['data']['name'])
		.attr('x', 5)
		.attr('y', 20)
		.attr('font-size', '0.7em');
};

d3.json(videoGameSalesURL).then((data, err) => {
	if (err) {
		console.log(err);
	} else {
		videoGameSalesData = data;
		console.log(videoGameSalesData);
		drawTreeMap();
	}
});
