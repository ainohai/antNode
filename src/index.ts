import { Kafka, KafkaMessage } from "kafkajs";
import { TaskConsumer } from "./kafkaConsumer";
import { TaskProducer } from "./kafkaProducer";
import { runSimulation } from "./simulation";

const GROUP_ID = 'test-consumer-group';
const TOPIC = 'simulation-events';


//const app = express();
//const host = process.env.HOST_IP;
const kafka = new Kafka({
  clientId: 'antnode',
  brokers: [`127.0.0.1:9092`],
});

/*const prod = kafka.producer()

const startEvent = async () => {
// Connect to the producer
await prod.connect()

  const foo: ProducerRecord = {
    
  topic: 'simulation-events',
  messages: [
    { value: 'Hello micro-services world!' },
  ],
}

// Send an event to the simulation event topic
await prod.send(foo);

// Disconnect the producer once we're done
await prod.disconnect();
}

startEvent()
*/



const consumer = new TaskConsumer(kafka, GROUP_ID, TOPIC);
const producer = new TaskProducer(kafka, TOPIC);

const producerConnect = async () => {
  await producer.connect();
  console.log("foo")
  producer.handle({ msg: "My new producer" });
}

const consumerConnect = async () => {
  consumer.connect();
}

producerConnect().then(t => consumerConnect());


console.log(`🎉🎉🎉 Application running 🎉🎉🎉`);

