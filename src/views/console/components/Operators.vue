<template>
  <div class="operators">

    <code-panel title="pipe">{{pipeCode}}</code-panel>

    <code-panel title="map" play @run="() => runSubject.next('map')">
      {{ mapCode }}
      <template v-slot:extra>
        <img height="220" :src="mapSource" alt="">
      </template>
    </code-panel>

    <code-panel title="tap" play @run="() => runSubject.next('tap')">
      {{ tapCode }}
    </code-panel>

    <code-panel title="take" play @run="() => runSubject.next('take')">
      {{ takeCode }}
      <template v-slot:extra>
        <img height="220" :src="takeSource" alt="">
      </template>
    </code-panel>

    <code-panel title="mergeAll" play @run="() => runSubject.next('mergeAll')">
      {{ mergeAllCode }}
      <template v-slot:extra>
        <img height="220" :src="mergeAllSource" alt="">
      </template>
    </code-panel>

    <code-panel title="mergeMap" play @run="() => runSubject.next('mergeMap')">
      {{ mergeMapCode }}
    </code-panel>

    <code-panel title="forkJoin" play @run="() => runSubject.next('forkJoin')">
      {{ forkJoinCode }}
    </code-panel>

    <code-panel title="throttleTime" play @run="() => runSubject.next('throttleTime')">
      {{ throttleTimeCode }}
    </code-panel>

    <code-panel title="debounceTime">
      {{ debounceTimeCode }}
      <template v-slot:extra>
        <div style="padding: 0 16px 16px">
          <a-input type="text" ref="search" placeholder="search" />
        </div>
      </template>
    </code-panel>

  </div>
</template>

<script>
import { from, Subject, iif, of, interval, forkJoin, timer, fromEvent } from 'rxjs'
import { map, switchMap, tap, take, mergeAll, mergeMap, throttleTime, debounceTime, pluck } from 'rxjs/operators'
import CodePanel from '@/components/CodePanel'
import Logger from '@/subject'
import Log from '@/model/log'
import mapSource from '@/assets/map.png'
import takeSource from '@/assets/take.png'
import mergeAllSource from '@/assets/mergeAll.png'

export default {
  name: 'Operators',
  components: {
    CodePanel
  },
  data: () => ({
    isActive: true,
    logger: new Logger(),
    runSubject: new Subject(),
    mapSource,
    takeSource,
    mergeAllSource,
    pipeCode: ` import { interval } from 'rxjs';

  interval(1000)
    .pipe(
      xxx
    )
    `,
    mapCode: ` import { from } from 'rxjs';
  import { map } from 'rxjs/operators';

  from([1, 2, 3])
    .pipe(
      map(v => v * 10)
    )
    `,
    tapCode: ` import { from } from 'rxjs';
  import { tap } from 'rxjs/operators';

  from([1, 2, 3])
    .pipe(
      tap(v => v * 2)
    )
    `,
    takeCode: ` import { from } from 'rxjs';
  import { take } from 'rxjs/operators';

  from(['a', 'b', 'c', 'd'])
    .pipe(
      take(2)
    )
    `,
    mergeAllCode: ` import { from } from 'rxjs';
  import { take } from 'rxjs/operators';

  from([1, 2, 3])
    .pipe(
      map(v => v * 10)
    )
    `,
    mergeMapCode: ` import { of, interval } from 'rxjs';
  import { mergeMap, take, map } from 'rxjs/operators';

  of('a', 'b', 'c')
  .pipe(
      mergeMap(str => interval(1000).pipe(
        take(3),
        map(value => str + value)
      ))
    )
    `,
    forkJoinCode: ` import { forkJoin, of, timer } from 'rxjs';

  forkJoin({
      a: of('1', '2', '3', '4'),
      b: timer(2000),
      c: Promise.resolve('4')
    }
    .subscribe(({a, b, c}) => a + b + c)
    `,
    throttleTimeCode: ` import { interval } from 'rxjs';
  import { throttleTime } from 'rxjs/operators';

  interval(1000)
    .pipe(
      throttleTime(2000)
    )
    `,
    debounceTimeCode: ` import { fromEvent } from 'rxjs';
  import { debounceTime } from 'rxjs/operators';

  fromEvent(this.$refs.search.$el, 'keyup')
    .pipe(
      debounceTime(500),
      pluck('target', 'value')
    )
    `
  }),
  mounted () {
    const map$ = from([1, 2, 3]).pipe(
      map(value => new Log({ sign: 'map', type: 'info', content: value * 10 }))
    )

    const tap$ = from([1, 2, 3]).pipe(
      tap(value => this.logger.emit(new Log({ sign: 'effect', type: 'danger', content: value * 2 }))),
      map(content => new Log({ sign: 'tap', type: 'warning', content }))
    )

    const take$ = from(['a', 'b', 'c', 'd']).pipe(
      take(2),
      map(content => new Log({ sign: 'take', type: 'info', content }))
    )

    const mergeAll$ = from([1, 0]).pipe(
      map(value => iif(() => value, from(['a', 'b', 'c', 'd']), from(['e', 'f']))),
      mergeAll(),
      map(content => new Log({ sign: 'mergeAll', type: 'danger', content }))
    )

    const mergeMap$ = of('a', 'b', 'c').pipe(
      mergeMap(str => interval(1000).pipe(
        take(3),
        map(value => str + value)
      )),
      map(content => new Log({ sign: 'mergeMap', type: 'info', content }))
    )

    const forJoin$ = forkJoin({
      a: of('1', '2', '3', '4'),
      b: timer(2000),
      c: Promise.resolve('4')
    }).pipe(
      map(({ a, b, c }) => new Log({ sign: 'mergeMap', type: 'warning', content: a + b + c }))
    )

    const throttleTime$ = interval(1000).pipe(
      throttleTime(2000),
      take(3),
      map(content => new Log({ sign: 'throttleTime', type: 'danger', content }))
    )

    fromEvent(this.$refs.search.$el, 'keyup')
      .pipe(
        debounceTime(500),
        pluck('target', 'value'),
        map(content => new Log({ sign: 'debounceTime', type: 'danger', content }))
      )
      .subscribe(log => this.logger.emit(log))

    this.runSubject.asObservable()
      .pipe(
        switchMap(type => {
          switch (type) {
            case 'map':
              return map$
            case 'tap':
              return tap$
            case 'take':
              return take$
            case 'mergeAll':
              return mergeAll$
            case 'mergeMap':
              return mergeMap$
            case 'forkJoin':
              return forJoin$
            case 'throttleTime':
              return throttleTime$
            default:
              return map$
          }
        })
      )
      .subscribe({
        next: (log) => {
          this.logger.emit(log)
        }
      })
  }
}
</script>

<style scoped lang="less">
.operators {
  height: calc(100vh - 80px);
  color: rgba(255, 255, 255, 0.85);
  padding: 16px;
  overflow: auto;
}
</style>
