import { Kafka, KafkaMessage, Producer, ProducerRecord, RecordMetadata } from "kafkajs";
import { MessageInterface } from "./kafkaConsumer";

type MyMessage = {
    msg: string
}

export abstract class KafkaProducer implements MessageInterface  {
    protected producer: Producer;
    abstract connect(): Promise<void>;
    abstract handle(message: any): Promise<any>
    abstract disconnect(): Promise<void>;
  
    constructor(producer: Producer) {
       this.producer = producer;
       //this.producer.logger().setLogLevel(5);
       console.log(JSON.stringify(this.producer.events));
    }
  }   
    
export class TaskProducer extends KafkaProducer {

private topic: string;

constructor(kafka: Kafka, topic: string) {
    super(kafka.producer());
    this.topic = topic;
}

async connect(): Promise<void> {
    try {
        console.log("SSSS")
        return await this.producer.connect();
    } catch (e) {
        return console.log(`Can't connect ${e}`);
    }
}

    async handle(message: MyMessage): Promise<RecordMetadata[]> {
    // handling of received message

    console.log("Messaging");
    const kafkaMsg: ProducerRecord = {
    
        topic: this.topic,
        messages: [
          { value:  message.msg }, //TODO!
        ],
      }

    return await this.producer.send(kafkaMsg);
}

async disconnect(): Promise<void> {
    try {
        return await this.producer.disconnect();
    } catch (e) {
        return console.log(`Error on disconnect ${e}`);
    }
}
}

/*
const producer = kafka.producer()

const startEvent = async () => {
// Connect to the producer
await producer.connect()

  const foo: ProducerRecord = {
    
  topic: 'simulation-events',
  messages: [
    { value: 'Hello micro-services world!' },
  ],
}

// Send an event to the simulation event topic
await producer.send(foo);

// Disconnect the producer once we're done
await producer.disconnect();
}

startEvent();*/