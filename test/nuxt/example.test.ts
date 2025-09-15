import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import Example from '../../app/components/Example.vue'

describe('Example Test Suite', () => {
  it('should render the example component', async () => {
    const component = await mountSuspended(Example)

    expect(component.html()).toContain('Example Component')
    expect(component.html()).toContain('This is an example component.')
  })
})
