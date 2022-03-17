import { useContext } from 'react';
import JWTContext from './JWTContext';

const useAuth = () => useContext(JWTContext);

export default useAuth;
