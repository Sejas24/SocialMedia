import 'dotenv/config';
import app from './app';
import { sequelize } from './models';

const PORT = process.env.PORT || 4000;

const startServer = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log('Conexión a MySQL establecida correctamente.');

    await sequelize.sync({ alter: true });
    console.log('Modelos sincronizados con la base de datos.');

    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Error al conectar con la base de datos:', error);
  }
};

startServer();