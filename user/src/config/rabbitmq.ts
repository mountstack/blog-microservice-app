import { Channel, ChannelModel, connect } from 'amqplib';

let channel: Channel;
let connection: ChannelModel;

let isConnecting = false;
const RECONNECT_DELAY_MS = 5000;

export async function initRabbit(): Promise<void> { 
  await createConnection(); 

  process.on('SIGINT', async () => {
    try {
      await channel?.close();
      await connection?.close();
      console.log('RabbitMQ connection closed gracefully.');
    } catch (_) { }
    process.exit(0);
  });
}

export function getChannel(): Channel {
  if (!channel) {
    throw new Error('RabbitMQ channel is not initialized. Call initRabbit() first.');
  }
  return channel;
}

export function publishEvent(event: { type: string; data: Record<string, unknown> }): void {
  getChannel().publish('blog_bus', '', Buffer.from(JSON.stringify(event)));
} 


async function createConnection(): Promise<void> {
  if (isConnecting) return;
  isConnecting = true;

  try {
    connection = await connect({
      protocol: 'amqp',
      hostname: 'localhost',
      port: 5672,
      username: 'guest',
      password: 'guest',
      vhost: '/',
      heartbeat: 60 
    });

    connection.on('error', (err) => { 
      console.error('RabbitMQ connection error:', err.message); 
    }); 

    connection.on('close', () => { 
      console.warn('RabbitMQ connection closed. Reconnecting in 5s...'); 
      isConnecting = false; 
      setTimeout(createConnection, RECONNECT_DELAY_MS); 
    }); 

    channel = await connection.createChannel(); 

    channel.on('error', (err) => { 
      console.error('RabbitMQ channel error:', err.message); 
    }); 

    channel.on('close', () => { 
      console.warn('RabbitMQ channel closed.'); 
    }); 

    await channel.assertExchange('blog_bus', 'fanout', { durable: false });

    console.log('RabbitMQ Connected');
    isConnecting = false;
  }
  catch (err) { 
    console.error('RabbitMQ connection failed. Retrying in 5s...', err); 
    isConnecting = false; 
    setTimeout(createConnection, RECONNECT_DELAY_MS); 
  } 
} 