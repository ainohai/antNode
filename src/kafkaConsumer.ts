import { EachMessagePayload, Kafka, KafkaMessage } from "kafkajs";
import { KafkaConsumer, KafkaMsgKey } from "./types";


export class TaskConsumer extends KafkaConsumer {

  private topic: string;
  private handlingCB: (message: KafkaMessage) => Promise<void>;

  constructor(kafka: Kafka, groupId: string, topic: string, handlingCb: (message: KafkaMessage) => Promise<void>) {
    super(kafka.consumer({ groupId: groupId, readUncommitted: false }));
    this.topic = topic;
    this.handlingCB = handlingCb;
  }

  async connect(): Promise<void> {
    try {
      await this.consumer.connect();
      await this.consumer.subscribe({ topic: this.topic, fromBeginning: false });
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
}
