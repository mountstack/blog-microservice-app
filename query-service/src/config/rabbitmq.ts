import amqp, { ChannelModel, Channel } from 'amqplib';

let connection: ChannelModel;
let channel: Channel;
let isConnecting = false;

const RECONNECT_DELAY_MS = 5000;

export async function initRabbit(onReady: (channel: Channel) => Promise<void>): Promise<void> {
  await createConnection(onReady);

  process.on('SIGINT', async () => {
    try {
      await channel?.close();
      await connection?.close();
      console.log('RabbitMQ closed gracefully.');
    } catch (_) {}
    process.exit(0);
  });
}

async function createConnection(onReady: (channel: Channel) => Promise<void>): Promise<void> {
  if (isConnecting) return;
  isConnecting = true;

  try {
    connection = await amqp.connect({
      protocol: 'amqp',
      hostname: 'localhost',
      port: 5672,
      username: 'guest',
      password: 'guest',
      vhost: '/',
      heartbeat: 60,
    });

    connection.on('error', (err) => console.error('RabbitMQ error:', err.message));
    connection.on('close', () => {
      console.warn('RabbitMQ disconnected. Reconnecting in 5s...');
      isConnecting = false;
      setTimeout(() => createConnection(onReady), RECONNECT_DELAY_MS);
    });

    channel = await connection.createChannel();
    channel.on('error', (err) => console.error('Channel error:', err.message));
    channel.on('close', () => console.warn('Channel closed.'));

    console.log('RabbitMQ connected.');
    isConnecting = false;

    await onReady(channel);

  } catch (err) {
    console.error('RabbitMQ failed. Retrying in 5s...', err);
    isConnecting = false;
    setTimeout(() => createConnection(onReady), RECONNECT_DELAY_MS);
  }
} 