import passengerGender from './passengerGender.js';
import passengerAge from './passengerAge.js';
import passengerClass from './passengerClass.js';

async function handleData() {
  const data = await d3.json('titanic-passengers.json');

  passengerAge(data);
  passengerClass(data);
  passengerGender(data);
}

handleData();
