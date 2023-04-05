import { ConfigType } from "@ainohai/antColony/lib/cjs/types/types";
import { Producer, Consumer } from "kafkajs";

export type MyMessage = {
    msg: string
}

export abstract class KafkaProducer implements MessageInterface {
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

export interface MessageInterface {
    connect(): Promise<void>;
    handle(message: any): Promise<void>
    disconnect(): Promise<void>;
}

export abstract class KafkaConsumer implements MessageInterface {
    protected consumer: Consumer;
    abstract connect(): Promise<void>;
    abstract handle(message: any): Promise<void>
    abstract disconnect(): Promise<void>;

    constructor(consumer: Consumer) {
        this.consumer = consumer;
    }
}

export enum KafkaMsgKey {
    RUN_SIMULATION= "RUN_SIMULATION",
    SIMULATION_ACK = "SIMULATION_ACK",
    SIMULATION_RESULT = "SIMULATION_RESULT"
}

export type SimulationRunPayload = {
    config: ConfigType
}

export type SimulationAckPayload = {
    id: string | undefined;
}

export type SimulationResultPayload = {
    points: number,
    id: string
}
