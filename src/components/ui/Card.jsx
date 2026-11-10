import { cn } from '../../lib/utils'

export function Card({ className, ...props }) {
  return <section className={cn('rounded-[6px] border border-[#dbdcdc] bg-white', className)} {...props} />
}

export function CardHeader({ className, ...props }) {
  return <div className={cn('flex flex-col gap-1 p-4', className)} {...props} />
}

export function CardTitle({ className, ...props }) {
  return <h2 className={cn('text-[18px] font-semibold leading-7 text-[#1c383c]', className)} {...props} />
}

export function CardContent({ className, ...props }) {
  return <div className={cn('p-4 pt-0', className)} {...props} />
}
