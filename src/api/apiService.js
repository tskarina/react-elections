import axios from 'axios';

export async function apiGetAllCities() {
  const { data } = await axios.get('http://localhost:3001/cities');
  return data;
}

export async function apiGetAllCandidates() {
  const { data } = await axios.get('http://localhost:3001/candidates');
  return data;
}

export async function apiGetElectionFrom(cityId) {
  // prettier-ignore
  const { data } = 
    await axios.get(`http://localhost:3001/election?cityId=${cityId}`);

  return data;
}
