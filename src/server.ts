import express from 'express';
import cors from 'cors';
import { env } from './config/env';
import { router } from './adapters/http/routes';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas
app.use('/api', router);

// Health check (útil para monitoramento)
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(env.port, () => {
  console.log(`Servidor rodando em http://localhost:${env.port}`);
  console.log(`Ambiente: ${env.nodeEnv}`);
});