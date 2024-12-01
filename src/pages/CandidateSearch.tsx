import { useState, useEffect } from 'react';
import { searchGithub, searchGithubUser } from '../api/API';
import { Candidate } from '../interfaces/Candidate.interface';

//saved candidates?


const CandidateSearch = () => {
  const [candidates, setCandidates] = useState([]); // Candidates
  const [currentCandidate, setCurrentCandidate] = useState<Candidate | null>(null); // Current candidate
  const [currentIndex, setCurrentIndex] = useState<number>(0); // Index of the current candidate
  const [loading, setLoading] = useState<boolean>(true); // Loading state

  useEffect(() => {
    const fetchCandidates = async () => {
      const data = await searchGithub(); 
      // setCandidates(data.items);
      setCandidates(data.map((candidate: { login: string; }) => candidate.login)); // Extract usernames
      setLoading(false);
    };
    fetchCandidates();
  }, []);

  useEffect(() => {
    if (candidates.length > 0 && currentIndex < candidates.length) {
      const fetchCandidateDetails = async () => {
        setLoading(true);
        const candidateData = await searchGithubUser(candidates[currentIndex]);
        
// Check if the account exists, if not, move to the next candidate

        if (candidateData && candidateData.id) {
          setCurrentCandidate(candidateData);
        } else {
          console.log("Failed to gather account: ", candidates[currentIndex])
          handleNextCandidate(); 
        }
        setLoading(false);
      };
      fetchCandidateDetails();
    }
  }, [currentIndex, candidates]);


const handleSaveCandidate = (candidate: Candidate) => {
  setCurrentCandidate(candidate); // why is this not defined?
  handleNextCandidate(); // Move to the next candidate
};

const handleNextCandidate = () => {
  setCurrentIndex((prevIndex: number) => prevIndex + 1);
};

const handleSkipCandidate = () => {
  handleNextCandidate(); // Skip the current candidate
};


if (loading) { // Loading state for candidate details
  return <p>Loading candidates...</p>;
}

if (currentIndex >= candidates.length || !currentCandidate) {
  return <p>No more candidates!</p>;
}

return (
  <div>
    <h1>Candidate Search</h1>
    <div style={{ width: '300px', margin: '0 auto', borderRadius: '10px', overflow: 'hidden' }}>
      <div style={{ display: 'flex', flexFlow: 'column', alignItems: 'center', borderRadius: '10px', overflow: 'hidden' }}>
        <img
          src={currentCandidate.avatar_url}
          alt={`${currentCandidate.login}'s avatar`}
          style={{
            width: '300px',
            height: '100%',
            borderTopLeftRadius: '10px',
            borderTopRightRadius: '10px',
          }}
        />
        <div
          style={{
            width: '300px',
            flexGrow: 1,
            backgroundColor: 'black',
            color: 'white',
            padding: '10px',
            borderBottomLeftRadius: '10px',
            borderBottomRightRadius: '10px',
          }}
        >
          <p style={{ marginLeft: 15 }}>
            Name: {`${currentCandidate.name || ''} (${currentCandidate.login})`}
          </p>
          <p style={{ marginLeft: 15 }}>Location: {currentCandidate.location || 'No Location provided.'}</p>
          <p style={{ marginLeft: 15 }}>Email: {currentCandidate.email || 'No email provided.'}</p>
          <p style={{ marginLeft: 15 }}>Company: {currentCandidate.company || 'No company provided.'}</p>
          <p style={{ marginLeft: 15 }}>Bio: {currentCandidate.bio || 'This candidate has not written a bio.'}</p>
        </div>
      </div>

      <div
        className="button-container"
        style={{
          textAlign: 'center',
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '10px',
          width: '300px',
        }}
      >
        <button onClick={handleSkipCandidate} className="circle-btn-minus">
          -
        </button>
        <button onClick={() => handleSaveCandidate(currentCandidate)} className="circle-btn-plus">
          +
        </button>
        
      </div>
    </div>
  </div>
);
};


export default CandidateSearch;
