import { readonly, isReadonly, isProxy } from './../reactive'

describe('readonly', () => {
  it('happy path', () => {
    const original = { foo: 1, nested: { bar: 2 } }
    const wrapped = readonly(original)
    expect(wrapped).not.toBe(original)
    expect(wrapped.foo).toBe(1)

    expect(isReadonly(wrapped)).toBe(true)
    expect(isReadonly(original)).toBe(false)

    expect(isReadonly(wrapped.nested)).toBe(true)
    expect(isReadonly(original.nested)).toBe(false)

    expect(isProxy(wrapped)).toBe(true)
  })

  it('warn then call set', () => {
    console.warn = jest.fn()
    const user = readonly({age: 10})

    user.age = 11
    expect(console.warn).toBeCalled()
  })
})