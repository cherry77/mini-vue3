import { isReadonly, readonly } from './../reactive'

describe('readonly', () => {
  it('happy path', () => {
    const original = { foo: 1, nested: { bar: 2 } }
    const observed = readonly(original)
    expect(observed).not.toBe(original)
    expect(observed.foo).toBe(1)

    expect(isReadonly(observed)).toBe(true)
    expect(isReadonly(original)).toBe(false)

    expect(isReadonly(observed.nested)).toBe(true)
    expect(isReadonly(original.nested)).toBe(false)
  })

  it('warn then call set', () => {
    console.warn = jest.fn()
    const user = readonly({age: 10})

    user.age = 11
    expect(console.warn).toBeCalled()
  })
})