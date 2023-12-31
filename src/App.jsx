import { useEffect, useState } from 'react';

import {
  apiGetAllCities,
  apiGetAllCandidates,
  apiGetElectionFrom,
} from './api/apiService';

import Election from './components/Election';
import Header from './components/Header';
import Loading from './components/Loading';
import Main from './components/Main';
import Select from './components/Select';

export default function App() {
  const [cities, setCities] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [currentElection, setCurrentElection] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [loadingCity, setLoadingCity] = useState(true);

  useEffect(() => {
    async function getCities() {
      const apiCities = (await apiGetAllCities())
        .sort((a, b) => a.name.localeCompare(b.name))
        .map(city => ({ ...city, description: city.name }));

      setCities(apiCities);
    }

    async function getCandidates() {
      const apiCandidates = await apiGetAllCandidates();
      setCandidates(apiCandidates);
    }

    getCities().then(() => {
      getCandidates().then(() => {
        setTimeout(() => {
          setInitialLoading(false);
        }, 500);
      });
    });
  }, []);

  useEffect(() => {
    if (cities.length > 0) {
      setSelectedCity(cities[0]);
    }
  }, [cities]);

  useEffect(() => {
    async function getCurrentElection() {
      if (selectedCity) {
        setLoadingCity(true);
        const election = await apiGetElectionFrom(selectedCity.id);
        setCurrentElection(election);

        setTimeout(() => {
          setLoadingCity(false);
        }, 500);
      }
    }

    getCurrentElection();
  }, [selectedCity]);

  function handleCityChange(newSelectedCityId) {
    setSelectedCity(cities.find(city => city.id === newSelectedCityId));
  }

  let mainJsx = (
    <div className="flex flex-row justify-center">
      <Loading />
    </div>
  );

  if (!initialLoading) {
    const fullElection = {
      election: currentElection
        .map(election => ({
          ...election,
          candidate: candidates.find(
            candidate => candidate.id === election.candidateId
          ),
        }))
        .sort((a, b) => b.votes - a.votes),
      city: selectedCity,
    };

    mainJsx = (
      <>
        <Select
          labelDescription="Escolha o município"
          onChangeValue={handleCityChange}
          selectedValue={selectedCity}
        >
          {cities}
        </Select>

        {loadingCity ? (
          <div className="flex flex-row justify-center">
            <Loading />
          </div>
        ) : (
          <Election>{fullElection}</Election>
        )}
      </>
    );
  }

  return (
    <>
      <Header>react-elections</Header>
      <Main>{mainJsx}</Main>
    </>
  );
}
