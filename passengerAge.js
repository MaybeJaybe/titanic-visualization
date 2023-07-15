/* eslint-disable max-len */
export default async function passengerAge(data) {
  const width = 600;
  const height = 300;
  const margin = 50;
  const ageRange = 10;

  const getPassengersByAge = (data, ageRange) => {
    const ageData = [];
    const maxAge = Math.max(...data.map((passenger) => passenger.fields.age).filter((age) => age !== undefined));
    const numBuckets = Math.floor(maxAge / ageRange);

    for (let i = 0; i <= numBuckets; i++) {
      ageData.push({
        ageRange: i * ageRange,
        survived: 0,
        notSurvived: 0,
        total: 0,
      });
    }

    const passengersWithAges = data.filter((passenger) => passenger.fields.age !== undefined);

    for (const passenger of passengersWithAges) {
      const age = passenger.fields.age;
      const bucket = Math.floor(age / ageRange) * ageRange;
      const index = ageData.findIndex((object) => object.ageRange === bucket);
      ageData[index].total += 1;
      passenger.fields.survived === 'Yes' ? ageData[index].survived += 1 : ageData[index].notSurvived += 1;
    }

    return ageData;
  };

  const ageData = getPassengersByAge(data, ageRange);
  const subgroups = ['survived', 'notSurvived'];

  const color = d3.scaleOrdinal()
    .domain(subgroups)
    .range(['#0f1840', '#5366bd']);

  const xScale = d3.scaleBand()
    .domain(ageData.map((obj) => obj.ageRange))
    .range([margin, width])
    .padding(0.05);

  const yScale = d3.scaleLinear()
    .domain([0, 240])
    .range([height, margin]);

  const svg = d3.select('#svg_age');

  const title = svg.append('g');
  title.append('text')
    .text('Age Ranges of the Passengers who Survived or Perished')
    .attr('transform', `translate(${width / 2 - 185}, 20)`)
    .attr('class', 'textInfo');

  const bottomAxis = d3.axisBottom(xScale)
    .tickFormat((d) => `${d} - ${d + 9}`);

  svg.append('g')
    .attr('transform', `translate(${0}, ${height})`)
    .call(bottomAxis);

  const leftAxis = d3.axisLeft(yScale);

  svg.append('g')
    .attr('transform', `translate(${margin}, 0)`)
    .call(leftAxis);

  const stackedData = d3.stack()
    .keys(subgroups)(ageData);

  svg.append('g')
    .selectAll('g')
    .data(stackedData)
    .enter()
    .append('g')
    .attr('fill', (d, i) => color(i))
    .selectAll('rect')
    .data((d) => d)
    .enter()
    .append('rect')
    .attr('x', (d) => xScale(d.data.ageRange))
    .attr('y', (d) => yScale(d[1]))
    .attr('height', (d) => yScale(d[0]) - yScale(d[1]))
    .attr('width', xScale.bandwidth());

  const labels = svg.append('g');

  labels.selectAll('circle')
    .data(subgroups)
    .enter()
    .append('circle')
    .attr('r', '5')
    .attr('cx', width - 100)
    .attr('cy', (d, i) => (i * 20) + 55)
    .attr('fill', (d, i) => color(i));

  labels.selectAll('text')
    .data(subgroups)
    .enter()
    .append('text')
    .text((d) => `${d[0].toUpperCase() + d.slice(1)}`)
    .attr('x', width - 85)
    .attr('y', (d, i) => (i * 20) + 60)
    .attr('class', 'textInfo');
}
