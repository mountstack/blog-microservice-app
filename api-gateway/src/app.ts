import cors from "cors";
import dotenv from 'dotenv'; 
import Express, { Application } from 'express'; 
import { createProxyMiddleware, fixRequestBody } from 'http-proxy-middleware'; 

dotenv.config();

const app: Application = Express(); 
app.use(cors({
  origin: 'http://localhost:3000', 
  credentials: true, 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
})); 
app.use(Express.json()); 

const { API_GATEWAY_PORT, USER_PORT, POST_PORT, COMMENT_PORT, QUERY_SERVICE_PORT } = process.env;

const routes: Record<string, string> = {
  '/user':    `http://localhost:${USER_PORT}`,
  '/profile': `http://localhost:${USER_PORT}`,
  '/post':    `http://localhost:${POST_PORT}`,
  '/comment': `http://localhost:${COMMENT_PORT}`,
  '/query':   `http://localhost:${QUERY_SERVICE_PORT}`,
};

Object.entries(routes).forEach(([path, target]) => {
  app.use(path, createProxyMiddleware({
    target,
    changeOrigin: true,
    on: {
      proxyReq: (proxyReq, req) => {
        const originalPath = (req as any).originalUrl; 
        proxyReq.path = originalPath;
        fixRequestBody(proxyReq, req);
      },
      error: (err, req, res: any) => { 
        res.status(502).json({ error: 'Bad gateway', message: err.message });
      }
    }
  }));
});

app.listen(API_GATEWAY_PORT, () => { 
  console.log(`[API GATEWAY]: ${API_GATEWAY_PORT}`); 
}); 