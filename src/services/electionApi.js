// API service for election-related operations
const API_BASE_URL = 'http://localhost:5000/api';

// Get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Create headers with auth token
const getHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// ============ ELECTION APIs ============

// Get all elections (with optional filters)
export const getAllElections = async (type = '', status = '') => {
  try {
    let url = `${API_BASE_URL}/elections`;
    const params = new URLSearchParams();
    if (type) params.append('type', type);
    if (status) params.append('status', status);
    if (params.toString()) url += `?${params.toString()}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: getHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to fetch elections');
    }

    return await response.json();
  } catch (error) {
    console.error('getAllElections error:', error);
    throw error;
  }
};

// Get elections available for student to vote
export const getStudentElections = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/elections/student/available`, {
      method: 'GET',
      headers: getHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to fetch student elections');
    }

    return await response.json();
  } catch (error) {
    console.error('getStudentElections error:', error);
    throw error;
  }
};

// Get single election by ID
export const getElectionById = async (electionId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/elections/${electionId}`, {
      method: 'GET',
      headers: getHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to fetch election');
    }

    return await response.json();
  } catch (error) {
    console.error('getElectionById error:', error);
    throw error;
  }
};

// Get election results
export const getElectionResults = async (electionId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/elections/${electionId}/results`, {
      method: 'GET',
      headers: getHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to fetch election results');
    }

    return await response.json();
  } catch (error) {
    console.error('getElectionResults error:', error);
    throw error;
  }
};

// Cast vote
export const castVote = async (electionId, candidateId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/elections/vote`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ electionId, candidateId })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to cast vote');
    }

    return data;
  } catch (error) {
    console.error('castVote error:', error);
    throw error;
  }
};

// ============ ADMIN ELECTION APIs ============

// Create election
export const createElection = async (electionData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/elections/create`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(electionData)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to create election');
    }

    return data;
  } catch (error) {
    console.error('createElection error:', error);
    throw error;
  }
};

// Add candidate to election
export const addCandidateToElection = async (electionId, studentId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/elections/add-candidate`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ electionId, studentId })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to add candidate');
    }

    return data;
  } catch (error) {
    console.error('addCandidateToElection error:', error);
    throw error;
  }
};

// Start election
export const startElection = async (electionId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/elections/${electionId}/start`, {
      method: 'PUT',
      headers: getHeaders()
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to start election');
    }

    return data;
  } catch (error) {
    console.error('startElection error:', error);
    throw error;
  }
};

// End election
export const endElection = async (electionId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/elections/${electionId}/end`, {
      method: 'PUT',
      headers: getHeaders()
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to end election');
    }

    return data;
  } catch (error) {
    console.error('endElection error:', error);
    throw error;
  }
};

// Cancel election
export const cancelElection = async (electionId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/elections/${electionId}/cancel`, {
      method: 'PUT',
      headers: getHeaders()
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to cancel election');
    }

    return data;
  } catch (error) {
    console.error('cancelElection error:', error);
    throw error;
  }
};

// ============ CANDIDATE APIs ============

// Get all candidates
export const getAllCandidates = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/candidates`, {
      method: 'GET',
      headers: getHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to fetch candidates');
    }

    return await response.json();
  } catch (error) {
    console.error('getAllCandidates error:', error);
    throw error;
  }
};

// Get approved candidates
export const getApprovedCandidates = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/candidates/approved`, {
      method: 'GET',
      headers: getHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to fetch approved candidates');
    }

    return await response.json();
  } catch (error) {
    console.error('getApprovedCandidates error:', error);
    throw error;
  }
};

export default {
  getAllElections,
  getStudentElections,
  getElectionById,
  getElectionResults,
  castVote,
  createElection,
  addCandidateToElection,
  startElection,
  endElection,
  cancelElection,
  getAllCandidates,
  getApprovedCandidates
};
