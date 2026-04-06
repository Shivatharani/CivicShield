const axios = require('axios');

async function testRoles() {
  const signup = async (username, password, role) => {
    try {
      await axios.post('http://localhost:5000/signup', { username, password, role });
      console.log(`Signup ${role} success`);
    } catch (e) {
      console.error(`Signup ${role} failed`, e.response?.data || e.message);
    }
  };

  const login = async (username, password) => {
    try {
      const res = await axios.post('http://localhost:5000/login', { username, password });
      return res.data;
    } catch (e) {
      console.error(`Login failed`, e.response?.data || e.message);
    }
  };

  const userV = { u: `viewer_${Date.now()}@test.com`, p: 'password123', r: 'VIEWER' };
  const userO = { u: `operator_${Date.now()}@test.com`, p: 'password123', r: 'OPERATOR' };

  await signup(userV.u, userV.p, userV.r);
  await signup(userO.u, userO.p, userO.r);

  const resV = await login(userV.u, userV.p);
  const resO = await login(userO.u, userO.p);

  console.log('--- TEST: Dashboard Access ---');
  try {
    const dV = await axios.get('http://localhost:5000/dashboard', { headers: { Authorization: resV.token } });
    console.log('Viewer Dashboard: SUCCESS');
  } catch (e) { console.log('Viewer Dashboard: FAILED', e.response?.status); }

  console.log('--- TEST: Apply Access ---');
  try {
    const aV = await axios.post('http://localhost:5000/apply', { id: 'test', scheme: 'test', amount: 100 }, { headers: { Authorization: resV.token } });
    console.log('Viewer Apply: SUCCESS (WRONG!)');
  } catch (e) { console.log('Viewer Apply: BLOCKED (403)', e.response?.status); }

  try {
    const aO = await axios.post('http://localhost:5000/apply', { id: 'test', scheme: 'test', amount: 100 }, { headers: { Authorization: resO.token } });
    console.log('Operator Apply: SUCCESS');
  } catch (e) { console.log('Operator Apply: FAILED', e.response?.status, e.response?.data); }

  console.log('--- TEST: Admin Control Access ---');
  try {
    await axios.post('http://localhost:5000/admin/pause', {}, { headers: { Authorization: resV.token } });
    console.log('Viewer Pause: SUCCESS (WRONG!)');
  } catch (e) { console.log('Viewer Pause: BLOCKED (403)', e.response?.status); }

  try {
    await axios.post('http://localhost:5000/admin/pause', {}, { headers: { Authorization: resO.token } });
    console.log('Operator Pause: SUCCESS');
  } catch (e) { console.log('Operator Pause: FAILED', e.response?.status); }
}

testRoles();
