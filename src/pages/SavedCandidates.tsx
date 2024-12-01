import { useEffect, useState } from 'react';
import { Candidate } from '../interfaces/Candidate.interface.tsx';
import { searchGithub, searchGithubUser } from '../api/API.tsx';




const CandidateSearch = () => { // Candidate search component
  const [candidates, setCandidates] = useState<string[]>([]); 
  const [currentCandidate, setCurrentCandidate] = useState<Candidate | null>(null); 
  const [currentIndex, setCurrentIndex] = useState(0); 
  const [loading, setLoading] = useState(true); 

 
  useEffect(() => { // Fetch candidates from GitHub API
    const fetchCandidates = async () => {
      const data = await searchGithub();
      setCandidates(data.map((candidate: { login: string }) => candidate.login)); // Extract usernames
      setLoading(false); 
    };

    fetchCandidates(); 
  }, []); // Run once when the component mounts

  
  useEffect(() => { // Fetch candidate details
    if (candidates.length > 0 && currentIndex < candidates.length) {
      const fetchCandidateDetails = async () => {
        setLoading(true);
        const candidateData = await searchGithubUser(candidates[currentIndex]);
        
       
        if (candidateData && candidateData.id) { // Check if the account exists
          setCurrentCandidate(candidateData);
        } else {
          console.log("Failed to gather account: ", candidates[currentIndex])
          handleNextCandidate(); // Move to the next candidate
        }
        setLoading(false);
      };

      fetchCandidateDetails();
    }
  }, [currentIndex, candidates]); // Run when currentIndex or candidates change


  const handleSaveCandidate = (candidate: Candidate) => { // Save the candidate
    // saveCandidate(candidate);
    console.log("Candidate saved: ", candidate.login);
    handleNextCandidate(); 
  };

  
  const handleNextCandidate = () => { // Move to the next candidate
    setCurrentIndex((prevIndex) => prevIndex + 1);
  };

  const handleSkipCandidate = () => { // Skip the current candidate
    handleNextCandidate(); 
  };


  if (loading) { // Loading message
    return <p>Loading candidate details...</p>;
  }

  if (currentIndex >= candidates.length || !currentCandidate) { // Display message when no more candidates are available
    return <p>No more candidates available.</p>;
  }

  return ( // Candidate details
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
              Name: {`${currentCandidate.name || 'N/A'} (${currentCandidate.login})`}
            </p>
            <p style={{ marginLeft: 15 }}>Location: {currentCandidate.location || 'N/A'}</p>
            <p style={{ marginLeft: 15 }}>Email: {currentCandidate.email || 'N/A'}</p>
            <p style={{ marginLeft: 15 }}>Company: {currentCandidate.company || 'N/A'}</p>
            <p style={{ marginLeft: 15 }}>Bio: {currentCandidate.bio || 'N/A'}</p>
          </div>
        </div>

        <div
          className="button-container"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '300px',
            textAlign: 'center',
            marginTop: '10px',
          }}
        >
          <button onClick={handleSkipCandidate} className="circle-btn-minus">
            <code>&#8212;</code>
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