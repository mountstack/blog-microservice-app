import { httpServer } from "./APIs/app"; 
import { connectDB } from "./config/database"; 
import { initRabbit } from "./config/rabbitmq"; 
import { startConsumer } from "./events/consumer"; 
import "./websocket/app"; 


const PORT = process.env.PORT || 8010; 

httpServer.listen(PORT, async () => { 
  console.log(`[Query-Service]: ${PORT}`); 
  try { 
    await connectDB(); 
    await initRabbit(startConsumer); 
  } 
  catch (error) { 
    console.error("Failed to start:", error); 
    process.exit(1); 
  } 
}); 
