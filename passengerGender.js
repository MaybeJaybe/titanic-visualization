export default async function passengerGender(data) {
  const width = 600;
  const height = 600;

  const pieChart = d3.pie().sort(null);

  const getPassengerByGender = (data, gender, status, color) => {
    const survived = status === 'Survived' ? 'Yes' : 'No';
    return {
      count: data.filter((passenger) => passenger.fields.sex === gender && passenger.fields.survived === survived).length,
      gender,
      status,
      color,
    };
  };

  const genderData = [
    getPassengerByGender(data, 'male', 'Survived', '#53c297'),
    getPassengerByGender(data, 'male', 'Not Survived', '#194736'),
    getPassengerByGender(data, 'female', 'Not Survived', '#281947'),
    getPassengerByGender(data, 'female', 'Survived', '#7453bd'),
  ];

  const slices = pieChart(genderData.map((data) => data.count));
  const makeCircle = d3.arc()
    .innerRadius(0)
    .outerRadius(200);

  const svg = d3.select('#svg_gender');

  const pieGroup = svg
    .append('g')
    .attr('transform', `translate(${width / 2}, ${height / 2})`);

  const colors = d3.scaleOrdinal().range(genderData.map((data) => data.color));

  pieGroup
    .selectAll('path')
    .data(slices)
    .enter()
    .append('path')
    .attr('d', makeCircle)
    .attr('fill', colors);

  const title = svg
    .append('g');

  title
    .append('text')
    .text('Survivors and Casualties By Gender')
    .attr('transform', `translate(${width / 2 - 170}, 20)`)
    .attr('class', 'labelText');

  const labels = svg
    .append('g');

  labels
    .selectAll('circle')
    .data(genderData)
    .enter()
    .append('circle')
    .attr('r', '5')
    .attr('cx', 10)
    .attr('cy', (d, i) => (i * 20) + 55)
    .attr('fill', (d, i) => d.color);

  labels
    .selectAll('text')
    .data(genderData)
    .enter()
    .append('text')
    .text((d) => `${d.gender[0].toUpperCase() + d.gender.slice(1)}, ${d.status}`)
    .attr('x', 23)
    .attr('y', (d, i) => (i * 20) + 60)
    .attr('class', 'labelText');

  const positionLabel = svg
    .append('g')
    .attr('transform', `translate(${width / 2}, ${height / 2})`);

  const drawCircle = d3.arc()
    .outerRadius(160)
    .innerRadius(160);

  positionLabel
    .selectAll('text')
    .data(genderData)
    .enter()
    .append('text')
    .text((d) => `${d.gender[0].toUpperCase() + d.gender.slice(1)}, ${d.status}, ${d.count}`)
    .attr('transform', (d, i) => `translate(${drawCircle.centroid(slices[i])})`)
    .attr('text-anchor', 'middle')
    .attr('class', 'labelText');
}
