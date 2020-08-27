<template>
  <div class="observable">

    <code-panel title="of" play @run="() => runSubject.next('of')">
      {{ ofCode }}
      <template v-slot:extra>
        <img height="120" :src="ofSource" alt="">
      </template>
    </code-panel>

    <code-panel title="from" play @run="() => runSubject.next('from')">
      {{ fromCode }}
      <template v-slot:extra>
        <img height="120" :src="fromSource" alt="">
      </template>
    </code-panel>

    <code-panel title="interval" play @run="() => runSubject.next('interval')">
      {{ intervalCode }}
      <template v-slot:extra>
        <img height="120" :src="intervalSource" alt="">
      </template>
    </code-panel>

    <code-panel title="fromEvent" play @run="() => runSubject.next('fromEvent')">
      {{ fromEventCode }}
      <template v-slot:extra>
        <img height="120" :src="fromEventSource" alt="">
      </template>
    </code-panel>

    <code-panel title="merge" play @run="() => runSubject.next('merge')">
      {{ mergeCode }}
      <template v-slot:extra>
        <img height="220" :src="mergeSource" alt="">
      </template>
    </code-panel>

    <code-panel title="concat" play @run="() => runSubject.next('concat')">
      {{ concatCode }}
      <template v-slot:extra>
        <img height="220" :src="concatSource" alt="">
      </template>
    </code-panel>

  </div>
</template>

<script>
import { of, from, interval, fromEvent, Subject, merge, zip, concat } from 'rxjs'
import { switchMap, take, map, takeWhile, startWith, delay } from 'rxjs/operators'
import CodePanel from '@/components/CodePanel'
import Logger from '@/subject'
import Log from '@/model/log'
import ofSource from '@/assets/of.png'
import fromSource from '@/assets/from.png'
import intervalSource from '@/assets/interval.png'
import fromEventSource from '@/assets/fromEvent.png'
import mergeSource from '@/assets/merge.png'
import concatSource from '@/assets/concat.png'

export default {
  name: 'Observable',
  components: {
    CodePanel
  },
  data: () => ({
    isActive: true,
    logger: new Logger(),
    runSubject: new Subject(),
    ofSource,
    fromSource,
    intervalSource,
    fromEventSource,
    mergeSource,
    concatSource,
    ofCode: ` import { of } from 'rxjs';

  of(1, 2, 3)
    .subscribe(
      next => console.log('next:', next),
      err => console.log('error:', err),
      () => console.log('the end'),
  );
    `,
    fromCode: ` import { from } from 'rxjs';

  from([10, 20, 30])
    .subscribe(
      next => console.log('next:', next),
  );
    `,
    intervalCode: ` import { interval } from 'rxjs';

  interval(1000)
    .subscribe(
      next => console.log('next:', next),
  );
    `,
    fromEventCode: ` import { fromEvent } from 'rxjs';

  fromEvent(document, 'click')
    .subscribe(
      next => console.log('next:', next),
    );
    `,
    mergeCode: ` import { merge, zip, from, interval } from 'rxjs';
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
    `,
    concatCode: ` import { concat, from } from 'rxjs';

  concat(
    from(['a', 'b']),
    from(['c', 'd']),
  )
    .subscribe(
      next => console.log('next:', next),
    );
    `
  }),
  mounted () {
    const of$ = of(1, 2, 3).pipe(
      map(content => new Log({ sign: 'of', type: 'info', content }))
    )
    const from$ = from([10, 20, 30]).pipe(
      map(content => new Log({ sign: 'from', type: 'warning', content }))
    )
    const interval$ = interval(1000).pipe(take(6)).pipe(
      map(content => new Log({ sign: 'interval', type: 'danger', content }))
    )
    const fromEvent$ = fromEvent(document, 'click').pipe(
      takeWhile(() => this.isActive),
      map(event => new Log({ sign: 'fromEvent', type: 'info', content: `x: ${event.x} / y: ${event.y}` }))
    )
    const merge$ = merge(
      zip(
        from(['a', 'c', 'e']),
        interval(1000).pipe(startWith(0))
      ).pipe(delay(500)),
      zip(
        from(['b', 'd', 'f']),
        interval(1000)
      )
    ).pipe(
      map(([content]) => new Log({ sign: 'merge', type: 'info', content }))
    )
    const concat$ = concat(
      from(['a', 'b']),
      from(['c', 'd'])
    ).pipe(
      map(content => new Log({ sign: 'concat', type: 'warning', content }))
    )

    this.runSubject.asObservable()
      .pipe(
        switchMap(type => {
          switch (type) {
            case 'of':
              return of$
            case 'from':
              return from$
            case 'interval':
              return interval$
            case 'fromEvent':
              return fromEvent$
            case 'merge':
              return merge$
            case 'concat':
              return concat$
            default:
              return of$
          }
        })
      )
      .subscribe({
        next: (log) => {
          this.logger.emit(log)
        }
      })
  },
  beforeDestroy () {
    this.isActive = false
  }
}
</script>

<style scoped>
.observable {
  height: calc(100vh - 80px);
  color: rgba(255, 255, 255, 0.85);
  padding: 16px;
  overflow: auto;
}
</style>
