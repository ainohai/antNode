import { EachMessagePayload, Kafka, KafkaMessage } from "kafkajs";
import { KafkaConsumer, KafkaMsgKey } from "./types";


export class TaskConsumer extends KafkaConsumer {

  private topic: string;

  constructor(kafka: Kafka, groupId: string, topic: string) {
    super(kafka.consumer({ groupId: groupId }));
    this.topic = topic;
  }

  async connect(): Promise<void> {
    try {
      await this.consumer.connect();
      await this.consumer.subscribe({ topic: this.topic });
      return this.consumer.run({ eachMessage: async (payload: any) => this.handle(payload) });
    } catch (e) {
      return console.log(`Can't connect ${e}`);
    }
  }

  handle({ topic, partition, message }: EachMessagePayload): Promise<void> {
    // handling of received message
    if (topic !== this.topic) {
      console.log("Trying to handle wrong topic")
      return Promise.resolve();
    }
    return this.handlingCB(message)
  }

  async disconnect(): Promise<void> {
    try {
      return await this.consumer.disconnect();
    } catch (e) {
      return console.log(`Error on disconnect ${e}`);
    }
  }

  private handlingCB(message: KafkaMessage) {

    if (message.key?.toString() === KafkaMsgKey.RUN_SIMULATION) {
      console.log(`Received message to run simulation, ${message.key?.toString()}: ${message.value?.toString()}`);
    }

    console.log(`Received message, not going to handle ${message.key?.toString()}: ${message.value?.toString()}`);
    return Promise.resolve();
  }
}




/*const consumer = kafka.consumer({ groupId: 'test-consumer-group' });

const consume = async() => {
await consumer.connect()
await consumer.subscribe({ topic: 'simulation-events', fromBeginning: true })

await consumer.run({
  eachMessage: async ({ topic, partition, message }) => {
    console.log({
      value: message.value?.toString() ?? "No val here",
    })
  },
});
}
consume();

*/