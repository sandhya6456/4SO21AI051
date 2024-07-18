const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 9876;
const WINDOW_SIZE = 10;
const FETCH_TIMEOUT = 2000;

let numbers = [];
const BEARER_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzIxMjk4MDMzLCJpYXQiOjE3MjEyOTc3MzMsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6IjdjNzg5MmUyLThlYTUtNDlhZi1iMzY4LWM3YjQ4MzQyZDg1ZSIsInN1YiI6InNhbmRoeWFrdW1hcmkyMDA4MjAwM0BnbWFpbC5jb20ifSwiY29tcGFueU5hbWUiOiJBZmZvcmQiLCJjbGllbnRJRCI6IjdjNzg5MmUyLThlYTUtNDlhZi1iMzY4LWM3YjQ4MzQyZDg1ZSIsImNsaWVudFNlY3JldCI6Ik9Kd252cWRpVk13akdwbWIiLCJvd25lck5hbWUiOiJTYW5kaHlhIEt1bWFyaSIsIm93bmVyRW1haWwiOiJzYW5kaHlha3VtYXJpMjAwODIwMDNAZ21haWwuY29tIiwicm9sbE5vIjoiNFNPMjFBSTA1MSJ9.kP9VhksTTs8wdlllv_BQYZb-Z6Mt4cvuX4yFa6p0SG8";

async function fetchNumber(numberId) {
  let url;
  switch (numberId) {
    case 'p':
      url = 'http://20.244.56.144/test/primes'; 
      break;
    case 'f':
      url = 'http://20.244.56.144/test/fibo'; 
      break;
    case 'e':
      url = 'http://20.244.56.144/test/even'; 
      break;
    case 'r':
      url = 'http://20.244.56.144/test/rand'; 
      break;
    default:
      return null; 
  }

  try {
    const response = await axios.get(url, {
      headers: {
        'Authorization': `Bearer ${BEARER_TOKEN}`
      },
      timeout: FETCH_TIMEOUT
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching number with ID ${numberId}:`, error.message);
    return null;
  }
}

function calculateAverage(numbers) {
  if (numbers.length === 0) return 0;
  const sum = numbers.reduce((acc, num) => acc + num, 0);
  return sum / numbers.length;
}

app.get('/numbers/:numberId', async (req, res) => {
  const { numberId } = req.params;
  const validIds = ['p', 'f', 'e', 'r'];

  if (!validIds.includes(numberId)) {
    return res.status(400).json({ error: 'Invalid number ID' });
  }

  try {
    const fetchedNumber = await fetchNumber(numberId);

    if (fetchedNumber !== null) {
      if (numbers.length >= WINDOW_SIZE) {
        numbers.shift();
      }
      numbers.push(fetchedNumber);
    }

    const average = calculateAverage(numbers);

    res.json({
      numbersBefore: [...numbers],
      fetchedNumber,
      numbersAfter: [...numbers],
      average
    });
  } catch (error) {
    console.error('Error processing request:', error.message);
    res.status(500).json({ error: 'Failed to process request' });
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
