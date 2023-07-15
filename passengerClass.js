export default async function passengerClass(data) {
  const width = 600;
  const height = 400;
  const margin = 50;

  const getPassengersByPClass = (data) => {
    const pclassData = [];
    const sections = Math.max(...data.map((passenger) => passenger.fields.pclass));

    for (let i = 1; i <= sections; i++) {
      pclassData.push({
        pclass: i,
        survived: 0,
        notSurvived: 0,
        total: 0,
      });
    }

    for (const passenger of data) {
      const pclass = passenger.fields.pclass;
      const index = pclassData.findIndex((object) => object.pclass === pclass);
      pclassData[index].total += 1;
      passenger.fields.survived === 'Yes' ? pclassData[index].survived += 1 : pclassData[index].notSurvived += 1;
    }
    
    return pclassData;
  };
  
  const pclassData = getPassengersByPClass(data);
  const status = ['survived', 'notSurvived'];
  const pclasses = pclassData.map((obj) => obj.pclass);

  const color = d3.scaleOrdinal()
    .domain(status)
    .range(['#0f1840', '#5366bd']);

  const xScale = d3.scaleBand()
    .domain(pclasses)
    .range([margin, width])
    .padding(0.05);
  const yScale = d3.scaleLinear()
    .domain([0, 500])
    .range([height, margin]);
  const pExtent = d3.extent(pclassData, (d) => d.total);

  const svg = d3.select('#svg_pclass');

  svg.append('g')
    .append('text')
    .text('Survivors and Casualties of the Passengers in each Class')
    .attr('transform', `translate(${width / 2 - 185}, 20)`)
    .attr('class', 'labelText');

  svg.append('g')
    .attr('transform', `translate(${0}, ${height})`)
    .call(d3.axisBottom(xScale).tickFormat((d) => `${d === 1 ? `${d}st` : d === 2 ? `${d}nd` : `${d}rd`} Class`));

  svg.append('g')
    .attr('transform', `translate(${margin}, 0)`)
    .call(d3.axisLeft(yScale));

  svg.append('g')
    .selectAll('g')
    .data(d3.stack().keys(status)(pclassData))
    .enter()
    .append('g')
    .attr('fill', (d, i) => color(i))
    .selectAll('rect')
    .data((d) => d)
    .enter()
    .append('rect')
    .attr('x', (d) => xScale(d.data.pclass))
    .attr('y', (d) => yScale(d[1]))
    .attr('height', (d) => yScale(d[0]) - yScale(d[1]))
    .attr('width', xScale.bandwidth());

  const labels = svg.append('g');

  labels.selectAll('circle')
    .data(status)
    .enter()
    .append('circle')
    .attr('r', '5')
    .attr('cx', 70)
    .attr('cy', (d, i) => (i * 20) + 55)
    .attr('fill', (d, i) => color(i));

  labels.selectAll('text')
    .data(status)
    .enter()
    .append('text')
    .text((d) => `${d[0].toUpperCase() + d.slice(1)}`)
    .attr('x', 85)
    .attr('y', (d, i) => (i * 20) + 60)
    .attr('class', 'labelText');
}
