export type Time = ReturnType<Date['getTime']>;
export type InitTickOptions = {
    engine?: typeof setTimeout & typeof requestAnimationFrame;
    destroyer?: typeof clearTimeout & typeof cancelAnimationFrame;
    interval?: Time;
};
export type Event = {
    fn: () => void;
    sleep?: Time;
};
export default class Ticker {
    #private;
    engineId: number;
    eventMatrix: {
        [key: string]: {
            eventQueue: Event[];
            updateTime: Time;
        };
    };
    constructor(options?: InitTickOptions);
    getNow(): Time;
    addTickEvent(event: Event, interval: Time, leading?: boolean): void;
    removeTickEvent(event: Event): void;
    run(): void;
    stop(): void;
}
