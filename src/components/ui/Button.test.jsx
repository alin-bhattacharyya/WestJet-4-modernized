import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Button } from './Button'

describe('Button', () => {
  it('renders and handles interaction', async () => {
    const handler = vi.fn()
    render(<Button onClick={handler}>Continue</Button>)
    await userEvent.click(screen.getByRole('button', { name: 'Continue' }))
    expect(handler).toHaveBeenCalledOnce()
  })
})
