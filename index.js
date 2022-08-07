// const KickstarterPledges =
//   'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/kickstarter-funding-data.json';


const movieSalesURL =
	'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json';

const width = 1000;
const height = 600;
let movieSalesData;

const canvas = d3.select('#canvas');
const tooltip = d3.select('#tooltip');

canvas.attr('width', width).attr('height', height);

const drawTreeMap = () => {
	let hierarchy = d3
		.hierarchy(movieSalesData, (node) => {
			return node['children'];
		})
		.sum((node) => {
			return (m = node['value']);
		})
		.sort((node1, node2) => {
			return node2['value'] - node1['value'];
		});
	let createTreeMap = d3.treemap().size([1000, 600]).paddingInner(1);
	createTreeMap(hierarchy);

	let movieTiles = hierarchy.leaves();
	console.log(movieTiles);

	let block = canvas
		.selectAll('g')
		.data(movieTiles)
		.enter()
		.append('g')
		.attr('transform', (movie) => {
			return `translate(${movie['x0']}, ${movie['y0']})`;
		});
	block
		.append('rect')
		.attr('class', 'tile')
		.attr('fill', (movie) => {
			let category = movie['data']['category'];
			switch (category) {
				case 'Action':
					return 'orange';
				case 'Drama':
					return 'limegreen';
				case 'Adventure':
					return 'coral';
				case 'Family':
					return 'lightblue';
				case 'Animation':
					return 'pink';
				case 'Comedy':
					return 'khaki';
				case 'Biography':
					return 'tan';
				default:
					break;
			}
		})
		.attr('data-name', (movie) => movie['data']['name'])
		.attr('data-category', (movie) => movie['data']['category'])
		.attr('data-value', (movie) => movie['data']['value'])
		.attr('width', (movie) => movie['x1'] - movie['x0'])
		.attr('height', (movie) => movie['y1'] - movie['y0'])
		.on('mouseover', (event, movie) => {
			tooltip
				.transition()
				.duration(1)
				.style('visibility', 'visible')
				.style('opacity', 0.8)
				.attr('data-value', movie['data']['value'])
				.style('left', event.pageX - 10 + 'px')
				.style('top', event.pageY - 28 + 'px');

			let revenue = movie['data']['value'].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

			tooltip.html(`$ ${revenue} <hr/> ${movie['data']['name']}`);
		})
		.on('mouseout', (movie) => {
			tooltip.transition().duration(1).style('visibility', 'hidden');
		});

	block
		.append('text')
		.text((movie) => movie['data']['name'])
		.attr('x', 5)
		.attr('y', 20)
		.attr('font-size', '0.7em');
};

d3.json(movieSalesURL).then((data, err) => {
	if (err) {
		console.log(err);
	} else {
		movieSalesData = data;
		console.log(movieSalesData);
		drawTreeMap();
	}
});
