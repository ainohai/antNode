import { Kafka, ProducerRecord, RecordMetadata } from "kafkajs";
import { KafkaProducer, MyMessage } from "./types";


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

        console.log("Messaging" + message.value);
        const kafkaMsg: ProducerRecord = {

            topic: this.topic,
            messages: [
                { 
                    key: message.key,
                    value: message.value                
                }, 
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
