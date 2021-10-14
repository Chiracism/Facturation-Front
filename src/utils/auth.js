import { useNavigate } from 'react-router-dom';
import jwt from 'jsonwebtoken';

export function CheckUserAuth() {
  const navigate = useNavigate();
  // Check User Auth
  const tokenData = localStorage.getItem('lmc_token');

  if (tokenData) {
    const user = jwt.verify(JSON.parse(tokenData), process.env.REACT_APP_JWT_KEY);

    if (!user) {
      localStorage.removeItem('lmc_token');
      navigate('/', { replace: true });
    } else if (user && user.role_id === 2) {
      navigate('/dashboard', { replace: true });
    }
  } else {
    navigate('/', { replace: true });
  }

  return <div style={{ display: 'none' }}>Check Auth</div>;
}
