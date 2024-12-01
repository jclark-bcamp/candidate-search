import { Link } from 'react-router-dom'; 

// Navigation bar
const Nav = () => { 
  return (
    <nav className='nav'> 
        <Link to="/" className='nav-link nav-item'>Home</Link>
        <Link to="/SavedCandidates" className='nav-link nav-item'>Potential Candidates</Link>
    </nav>
  );
};

export default Nav;
