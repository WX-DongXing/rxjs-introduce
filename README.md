# rxjs-introduce
Rxjs 介绍

#### 核心概念

- **Observable (可观察对象):** 表示一个概念，这个概念是一个可调用的未来值或事件的集合。
- **Observer (观察者):** 一个回调函数的集合，它知道如何去监听由 Observable 提供的值。
- **Subscription (订阅):** 表示 Observable 的执行，主要用于取消 Observable 的执行。
- **Operators (操作符):** 采用函数式编程风格的纯函数 (pure function)，使用像 `map`、`filter`、`concat`、`flatMap` 等这样的操作符来处理集合。
- **Subject (主体):** 相当于 EventEmitter，并且是将值或事件多路推送给多个 Observer 的唯一方式。
- **Schedulers (调度器):** 用来控制并发并且是中央集权的调度员，允许我们在发生计算时进行协调，例如 `setTimeout` 或 `requestAnimationFrame` 或其他

#### 概念解读

##### Observable (可观察对象)、Operators (操作符)、Subscription(订阅)、Observer(操作符)

Observables 在被创建操作符**创建**后，使用观察者来**订阅**它，然后**执行**并发送 `next` / `error` / `complete` 通知给观察者，而且执行可能会被**清理**。```subscription = Observable.subscribe(Observer)``` ```subscription.unsubscribe() ```

```typescript
const observer = {
  next: x => console.log('Observer got a next value: ' + x),
  error: err => console.error('Observer got an error: ' + err),
  complete: () => console.log('Observer got a complete notification'),
};		
```

```typescript
const observable = interval(1000)              		   // 可观察对象，将数据、消息进行发布
                      .pipe(                           // 管道操作符，用于连接其他操作符
                          take(10)                     // 操作符
                      )

const subsciption = observable.subscribe((value) => {    // 订阅和观察者，观察者用于数据的消费
                      console.log(value)
                  })
                  
subsciption.unsubscribe()                      		   // 取消订阅
```

##### Subject(主体)

Subject 是一种特殊类型的 Observable，它像是 Observable，但是可以多播给多个观察者。Subject 还像是 EventEmitters，维护着多个监听器的注册表。

**每个 Subject 都是被观察者（ Observable ）。** - 对于 Subject，你可以提供一个观察者并使用 `subscribe` 方法，就可以开始正常接收值。从观察者的角度而言，它无法判断 Observable 执行是来自普通的 Observable 还是 Subject 。

```typescript
const subject$ = new Subject()

subject$
    .asObservable()
	.pipe(
		xxx
	)
	.subscribe((value) => {
        console.log(value)
    })
```



在 Subject 的内部，`subscribe` 不会调用发送值的新执行。它只是将给定的观察者注册到观察者列表中，类似于其他库或语言中的 `addListener` 的工作方式。

**每个 Subject 都是观察者（Observer）。** - Subject 是一个有如下方法的对象： `next(v)`、`error(e)` 和 `complete()` 。要给 Subject 提供新值，只要调用 `next(theValue)`，它会将值多播给已注册监听该 Subject 的观察者们。

```typescript
const subject$ = new Subject()

subject$
    .asObservable()
	.pipe(
		xxx
	)
	.subscribe((value) => {
        console.log(value)
    })

subject$.next()
```

##### Schedulers (调度器)

调度器控制着何时启动 subscription 和何时发送通知

| 调度器             | 目的                                                         |
| ------------------ | ------------------------------------------------------------ |
| null               | 不传递任何调度器的话，会以同步递归的方式发送通知。用于定时操作或尾递归操作。 |
| Rx.Scheduler.queue | 当前事件帧中的队列调度(蹦床调度器)。用于迭代操作。           |
| Rx.Scheduler.asap  | 微任务的队列调度，它使用可用的最快速的传输机制，比如 Node.js 的 `process.nextTick()` 或 Web Worker 的 MessageChannel 或 setTimeout 或其他。用于异步转换。 |
| Rx.Scheduler.async | 使用 `setInterval` 的调度。用于基于时间的操作符。            |

##### 可观察对象

* ```of```:  将一个值或者多个值转化为可观察对象

   ```typescript
    import { of } from 'rxjs';
    
    of(1, 2, 3)
        .subscribe(
          next => console.log('next:', next), 
          err => console.log('error:', err),
          () => console.log('the end'),
        );
    
    // 'next: 1'
    // 'next: 2'
    // 'next: 3'
    // 'the end'
    ```

* ```from```:  将一个数组转化为可观察对象

   ```typescript
    import { from } from 'rxjs';
    
    from(10, 20, 30)
        .subscribe(
          next => console.log('next:', next), 
        );
    
    // 'next: 10'
    // 'next: 20'
    // 'next: 30'
    ```

* ```interval```:  在指定时间间隔后发出信息，类似于定时器 setInterval

   ```typescript
    import { interval } from 'rxjs';
    
    interval(1000)
        .subscribe(
          next => console.log('next:', next), 
        );
    
    // 'next: 0'
    // 'next: 1'
    // 'next: 2'
    // ...
    ```

* ```fromEvent```:  将事件转化为可观察对象

   ```typescript
    import { fromEvent } from 'rxjs';
    
    fromEvent(document, 'click')
        .subscribe(
          next => console.log('next:', next), 
        );
    
    // 'next: ev'
    // 'next: ev'
    // 'next: ev'
    // ...
    ```

 * ```merge```:  合并可观察对象数据流

     ```typescript
      import { merge, zip, from, interval } from 'rxjs';
      import { startWith, delay } from 'rxjs/operators';
      
      merge(
            zip(
              from(['a', 'c', 'e']),
              interval(1000).pipe(startWith(0))
            ).pipe(delay(500)),
            zip(
              from(['b', 'd', 'f']),
              interval(1000)
            )
      )
         .subscribe(
             next => console.log('next:', next), 
          );
      ```

 * ```concat```:  按照顺序，前一个 observable 完成了再订阅下一个 observable 并发出值

     ```typescript
      import { concat, from } from 'rxjs';
      
      merge(
      	from(['a', 'b']),
          from(['c', 'd']),
      )
         .subscribe(
             next => console.log('next:', next), 
          );
      
      // 'next: a'
      // 'next: b'
      // 'next: c'
      // 'next: d'
      ```

##### 操作符

 * ```pipe```:  管道工具，用于连接操作符

     ```typescript
      import { interval } from 'rxjs';
      
      interval(1000)
      	.pipe(
          	xxxx
      	)
      ```

 * ```map```:  对源 observable 的每个值应用投射函数

     ```typescript
      import { from } from 'rxjs';
      import { map } from 'rxjs/operators';
      
      from([1, 2, 3])
          .pipe(
              map(v => v * 10)
          )
         .subscribe(
             next => console.log('next:', next), 
          );
      // 'next: 10'
      // 'next: 20'
      // 'next: 30'
      ```

 * 比较常见的还有```filter```、```scan```(reduce)，用法一致

 * ```tap```:  可对源 observable 的每个值进行有副作用的处理，但依然返回源值

    ```typescript
      import { from } from 'rxjs';
      import { tap } from 'rxjs/operators';
      
      from([1, 2, 3])
          .pipe(
              tap(v => {
                  console.log('tap: ', v * 2)
              })
          )
         .subscribe(
             next => console.log('next:', next), 
          );
      
      // 'tap: 2'
      // 'next: 1'
      // 'tap: 4'
      // 'next: 2'
      // 'tap: 6'
      // 'next: 3'
      ```

 * ```take```:  取得源值的数目

     ```typescript
      import { from } from 'rxjs';
      import { take } from 'rxjs/operators';
      
      from(['a', 'b', 'c', 'd'])
          .pipe(
              take(2)
          )
         .subscribe(
             next => console.log('next:', next), 
          );
      
      // 'next: a'
      // 'next: b'
      ```

 * ```mergeAll```:  收集并订阅所有的可观察对象

    ```typescript
      import { of, iif } from 'rxjs';
      import { take } from 'rxjs/operators';
      
      of(1, 0)
          .pipe(
              map(value => iif(() => value, from(['a', 'b', 'c', 'd']), from(['e', 'f']))),
          	mergeAll()
          )
         .subscribe(
             next => console.log('next:', next), 
          );
      
      // 'next: a'
      // 'next: b'
      // 'next: c'
      // 'next: d'
      // 'next: e'
      // 'next: f'
      ```

 * ```mergeMap```:  映射成可观察对象并发出值

     ```typescript
      import { of, iif } from 'rxjs';
      import { take } from 'rxjs/operators';
      
      of(1, 0)
          .pipe(
              map(value => iif(() => value, from(['a', 'b', 'c', 'd']), from(['e', 'f']))),
          	mergeAll()
          )
         .subscribe(
             next => console.log('next:', next), 
          );
      
      // 'next: a'
      // 'next: b'
      // 'next: c'
      // 'next: d'
      // 'next: e'
      // 'next: f'
      
      import { of, interval } from 'rxjs';
      import { mergeMap, take, map } from 'rxjs/operators';
      
      of('a', 'b', 'c').pipe(
          mergeMap(str => interval(1000).pipe(
              take(3),
              map(value => str + value)
          ))
       )
        .subscribe(
            next => console.log('next:', next)
         );
         
          
      // 'next: a0'
      // 'next: b0'
      // 'next: c0'
      // 'next: a1'
      // 'next: b1'
      // 'next: c1'
      // 'next: a2'
      // 'next: b2'
      // 'next: c2'
      ```

 * ```forkJoin```:  当所有可观察对象完成时，发出每个可观察对象的最新值。

     ```typescript
      import { of, iif } from 'rxjs';
      import { take } from 'rxjs/operators';
      
      forkJoin({
          a: of('1', '2', '3', '4'),
          b: timer(2000),
          c: Promise.resolve('4')
      })
          .subscribe(
          ({ a, b, c }) => console.log('next:', a + b + c), 
      );
      
      // 'next: 404'
      ```

 * ```throttleTime```:  当指定的持续时间经过后发出最新值。

     ```typescript
      import { interval } from 'rxjs';
      import { throttleTime } from 'rxjs/operators';
      
      interval(1000)
      	.pipe(
          	throttleTime(2000)
      	)
          .subscribe(
           next => console.log('next:', next), 
      );
      
      // 'next: 0'
      ```

 * ```debounceTime```:  舍弃掉在两次输出之间小于指定时间的发出值。

     ```typescript
      import { fromEvent } from 'rxjs';
      import { debounceTime } from 'rxjs/operators';
      
      fromEvent(this.$refs.search.$el, 'keyup')
          .pipe(
          debounceTime(500),
          pluck('target', 'value')
      )
      ```


