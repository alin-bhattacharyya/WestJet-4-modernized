import { Slot } from '@radix-ui/react-slot'
import { cva } from 'class-variance-authority'
import { cn } from '../../lib/utils'

const buttonVariants = cva(
  'inline-flex h-11 items-center justify-center gap-2 rounded-[4px] px-3 text-[12px] leading-[18px] font-semibold tracking-[.05em] whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#154e55] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:border-[#ebebeb] disabled:bg-[#ebebeb] disabled:text-[#949494]',
  {
    variants: {
      variant: {
        default: 'border border-white bg-[#017f7c] text-white hover:bg-[#154e55]',
        outline: 'border border-[#017f7c] bg-white text-[#017f7c] hover:bg-[#e6f5f5]',
        ghost: 'text-[#017f7c] hover:bg-[#e6f5f5]',
        navy: 'bg-[#003b71] text-white hover:bg-[#002d56]',
      },
      size: { default: 'h-11 px-3', sm: 'h-9 px-3', lg: 'h-12 px-5', icon: 'size-11 p-0' },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  },
)

export function Button({ className, variant, size, asChild = false, ...props }) {
  const Comp = asChild ? Slot : 'button'
  return <Comp className={cn(buttonVariants({ variant, size }), className)} {...props} />
}
