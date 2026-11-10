import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Field, Input } from './Input'

describe('Input', () => { it('associates its field label', () => { render(<Field label="Email"><Input/></Field>); expect(screen.getByLabelText('Email')).toBeVisible() }) })
