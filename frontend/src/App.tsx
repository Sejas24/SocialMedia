import { useEffect, useState } from 'react';
import api from './services/api';

function App() {
  const [mensaje, setMensaje] = useState<string>('');

  useEffect(() => {
    api.get('/')
      .then(res => setMensaje(res.data.message))
      .catch(() => setMensaje('❌ Error conectando al backend'));
  }, []);

  return (
    <div>
      <h1>Test de conexión</h1>
      <p>{mensaje}</p>
    </div>
  );
}

export default App;