export type Time = ReturnType<Date['getTime']>
export type InitTickOptions = {
  engine?: typeof setTimeout & typeof requestAnimationFrame
  destroyer?: typeof clearTimeout & typeof cancelAnimationFrame
  interval?: Time
}
export type Event = {
  fn: () => void
  sleep?: Time
}

export default class Ticker {
  #interval: Time = 100
  #engine: typeof setTimeout & typeof requestAnimationFrame = setTimeout
  #destroyer: typeof clearTimeout & typeof cancelAnimationFrame = clearTimeout
  public engineId: number = 0
  public eventMatrix: {
    [key: string]: {
      eventQueue: Event[]
      updateTime: Time
    }
  } = {}
  constructor(options?: InitTickOptions) {
    // options 装填完毕，tick 开始初始化
    this.#engine = options?.engine || this.#engine
    this.#destroyer = options?.destroyer || this.#destroyer
    this.#interval = options?.interval || this.#interval
    this.run()
  }
  // 获取当前设备时间
  getNow(): Time {
    return new Date().getTime()
  }
  // 添加标记事件
  addTickEvent(event: Event, interval: Time, leading?: boolean): void {
    if (leading === true) event.fn() // 若传入的 leading 为 true，在添加任务时会立刻执行一次
    if (this.eventMatrix[interval]) this.eventMatrix[interval].eventQueue.push(event)
    else
      this.eventMatrix[interval] = {
        eventQueue: [event],
        updateTime: this.getNow(),
      }
  }
  removeTickEvent(event: Event): void {
    Object.entries(this.eventMatrix).forEach(([interval, events]) => {
      const eventIndex = events.eventQueue.findIndex(item => item.fn === event.fn)
      if (eventIndex !== -1) events.eventQueue.splice(eventIndex, 1)
      // 结束后检查，若 length = 0 的 interval 队列，则删除对应队列属性，减少 #engine 循环的负担
      if (events.eventQueue.length === 0) delete this.eventMatrix[interval]
    })
  }
  run(): void {
    (this.engineId as any) = this.#engine(() => {
      const now = this.getNow()
      Object.entries(this.eventMatrix).forEach(([interval, events]) => {
        if (now - events.updateTime >= Number(interval)) {
          events.eventQueue.forEach(item => {
            if (typeof item?.sleep === 'number') {
              // 若存在 sleep，则更新 sleep 时间
              item.sleep = this.getNow() - events.updateTime
            }
            // 若不存在 sleep 或者 sleep 时间已经到了，执行事件
            if (!item?.sleep || item?.sleep <= 0) item.fn()
          })
          events.updateTime = now
        }
      })
      this.run()
    }, this.#interval)
  }
  stop() {
    this.#destroyer(this.engineId)
  }
}
