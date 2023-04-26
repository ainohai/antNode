import { Kafka, KafkaMessage } from "kafkajs";
import { TaskConsumer } from "./kafkaConsumer";
import { TaskProducer } from "./kafkaProducer";
import { runSimulation } from "./simulation";
import { KafkaMsgKey } from "./types";
import { ConfigType } from "@ainohai/antColony/lib/cjs/types/types";

const simulationTimes = 10;
const maxLoops = 1000;

const GROUP_ID = 'test-consumer-group';
const TOPIC = 'simulation-events';

const kafka = new Kafka({
  clientId: `antnode-${new Date().getTime()}`,
  brokers: [`127.0.0.1:9092`],
});

const producer = new TaskProducer(kafka, TOPIC);

//Blocking. 
const handlingCB = (message: KafkaMessage) => {

  if (message.key?.toString() === KafkaMsgKey.RUN_SIMULATION && !!message.value) {
    console.log(`Received message to run simulation, ${message.key?.toString()}: ${message.value?.toString()}`);
    
    const config: Partial<ConfigType> = { ...message.value as Partial<ConfigType>, ...{moveRandomPercentage : 0}};
    
    const millis = new Date().getTime();
    let res = runSimulation(millis, simulationTimes, config, maxLoops);
    const sum = res.points.reduce((a, b) => a + b, 0);
    const avg = (sum / res.points.length) || 0;
    let returnVal = {
      points: avg, //TODO: Add calculating mean here, if run with multiple runs. 
      id: millis,
      //params: message.value
    }
    producer.handle({key: KafkaMsgKey.SIMULATION_RESULT, value: JSON.stringify(returnVal)});
  }

  else {
     console.log(`Received message, not going to handle ${message.key?.toString()}: ${message.value?.toString()}`);
  }
  return Promise.resolve();
}

const consumer = new TaskConsumer(kafka, GROUP_ID, TOPIC, handlingCB);

const producerConnect = async () => {
  await producer.connect();
  console.log("foo")
  producer.handle({ key: "just chatting", value: "My new producer" });
}

const consumerConnect = async () => {
  consumer.connect();
}

producerConnect().then(t => consumerConnect());


console.log(`🎉🎉🎉 Application running 🎉🎉🎉`);

