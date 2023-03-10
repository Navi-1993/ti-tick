我有一个开源 npm 包发布，名字为 ti-tick，作用是管理 js 的定时任务，来优化频繁使用 setInterval 带来的前端性能问题。请帮我写一下 readme.md

# ti-tick

[![npm version](https://badge.fury.io/js/ti-tick.svg)](https://badge.fury.io/js/ti-tick)
[![Build Status](https://travis-ci.org/username/ti-tick.svg?branch=master)](https://travis-ci.org/username/ti-tick)

ti-tick 是一个开源的 npm 包，用于管理 JavaScript 的定时任务，以优化频繁使用 setInterval 带来的前端性能问题。

[定时任务的管理与优化](https://github.com/Navi-1993/what-should-i-know/blob/master/front-end/Performance%20Optimization/Optimization%20of%20Scheduled%20Tasks.md)

## 安装

你可以使用 npm 安装 ti-tick：

```bash
npm install ti-tick
```

或者使用 yarn 安装：

```bash
yarn add ti-tick
```

## 使用

### 实例化一个管理器

```ts
import Ticker from 'ti-tick';
const ticker = new Ticker()
// 单例地使用它
export default ticker
```

### 暂停和恢复定时管理器

```ts
ticker.stop()
ticker.run()
```

### 添加要执行的定时任务

```ts
const fn = ()=> console.log('持续执行的定时任务')
const event = {
    fn,
    leading: true, // 当添加定时任务时，会立即 fn 1 次。
    sleep: 6000, // 等待 6 秒后再开始持续执行
  }
ticker.addTickEvent(event, 1000)
await delay(10000) // 等待 10 秒
ticker.removeTickEvent(evnet) // 移除定时任务
```

### 封装为 hooks 使用

```ts
import Ticker from '../utils/ticker'
import type {Event} from '../utils/ticker'
const ticker = new Ticker()

type UseTick = {
  fn: Event['fn']
  interval: ReturnType<Date['getTime']>
  options?: {
    sleep?: Event['sleep']
    leading?: boolean
  }
}

export default function useTick(
  fn: UseTick['fn'],
  interval: UseTick['interval'],
  options?: UseTick['options']
): [() => ReturnType<Ticker['addTickEvent']>, () => ReturnType<Ticker['removeTickEvent']>] {
  const event = {
    fn,
    sleep: options?.sleep,
  }
  return [() => ticker.addTickEvent(event, interval), () => ticker.removeTickEvent(event)]
}

// usage
import useTick from '../../hooks/use-tick'
const [run, stop] = useTick(()=>{}, 1000)
run()
```

### 替换定时任务管理器的 engine
**理论上，你可以定制任意的engine 来实例定时任务管理器，满足不同场景的需求**
```ts
// 比如使用 window.requestAnimationFrame 来做定时任务管理器的核心循环，当页面最小化的时候，定时任务将不会执行。
const FrameTicker = new Ticker(
  {
    engine: window.requestAnimationFrame,
    destroyer: window.cancelAnimationFrame
  }
)
```

## 许可证

MIT License.
