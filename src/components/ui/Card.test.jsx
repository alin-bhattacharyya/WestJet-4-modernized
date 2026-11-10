import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Card, CardContent, CardTitle } from './Card'

describe('Card', () => { it('composes accessible content', () => { render(<Card><CardTitle>Trip</CardTitle><CardContent>Details</CardContent></Card>); expect(screen.getByRole('heading',{name:'Trip'})).toBeVisible(); expect(screen.getByText('Details')).toBeVisible() }) })
