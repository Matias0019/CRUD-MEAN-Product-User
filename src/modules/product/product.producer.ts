import { Kafka, ProducerRecord } from 'kafkajs';

const kafka = new Kafka({ brokers: ["localhost:9092"] });

const producer = kafka.producer();
  
export const sendMessage = async (product: any) => {
    try {
        await producer.connect();
        const payload: ProducerRecord = {
            topic: 'product',
            messages: [
                { value: JSON.stringify(product)}
            ]
        };
        const result = await producer.send(payload);
        console.log(`Message sent successfully! ${JSON.stringify(result)}`);
        console.log(product);
    } catch (err) {
        console.log(`Error sending message: ${err}`);
    } finally {
        await producer.disconnect();
    }
}

  