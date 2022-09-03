import { reactive } from './../reactive'
import { effect, stop } from './../effect'
describe('effect', () => {
	it('happy path', () => {
		const user = reactive({
			age: 10,
		})
		let nextAge
		effect(() => {
			nextAge = user.age + 1
		})
		// init
		expect(nextAge).toBe(11)

		// update
		user.age++
		expect(nextAge).toBe(12)
	})

	it('should return runner when call effect', () => {
		let foo = 10
		const runner = effect(() => {
			foo++
			return 'foo'
		})
		expect(foo).toBe(11)
		const r = runner()
		expect(foo).toBe(12)
		expect(r).toBe('foo')
	})

	it('scheduler', () => {
		// 1. effect 第二个参数给定一个 scheduler 的fn
		// 2. effect 第一次执行的时候，还会执行 fn
		// 3. 当响应式对象 set update 时不会执行 fn 而是执行 scheduler
		// 4. 当执行 runner 时，会再次执行 fn
		let dummy
		let run: any
		const scheduler = jest.fn(() => {
			run = runner
		})
		const obj = reactive({ foo: 1 })
		const runner = effect(
			() => {
				dummy = obj.foo
			},
			{ scheduler }
		)
		expect(scheduler).not.toHaveBeenCalled()
		expect(dummy).toBe(1)
		// should be called on first trigger
		obj.foo++
		expect(scheduler).toHaveBeenCalledTimes(1)
		// should not run yet
		expect(dummy).toBe(1)
		// manually run
		run()
		// should have run
		expect(dummy).toBe(2)

		// 加这个功能时没看vue3的实现时，有个疑惑的点：set update的时候scheduler调用，难道要将scheduler也放在map里一一对应收集下吗？看了下实现，脑子果然秀逗了，已经收集过一遍effect,scheduler又是和effect对应的，直接在effect加个scheduler即可
	})

	it('stop', () => {
		let dummy
		const obj = reactive({ prop: 1 })
		const runner = effect(() => {
			dummy = obj.prop
		})
		obj.prop = 2
		expect(dummy).toBe(2)
		stop(runner)
		obj.prop = 3
		expect(dummy).toBe(2)

		// stopped effect should still be manually callable
		runner()
		expect(dummy).toBe(3)
	})

	it('events: onStop', () => {
		const onStop = jest.fn()
		const runner = effect(() => {}, {
			onStop,
		})

		stop(runner)
		expect(onStop).toHaveBeenCalled()
	})
})
