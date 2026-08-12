'use client'

import { Reveal } from '@/components/museum/Reveal'

interface RoomProps {
  /** room number as displayed on the door, e.g. '01' */
  number: string
  /** room name, e.g. 'THE FOUNTAIN' */
  name: string
  /** short catalogue line under the name */
  catalog?: string
  id: string
  dark?: boolean
  children: React.ReactNode
  className?: string
}

/**
 * A museum room: the numbered door frame that opens every section.
 * Dark rooms override the palette in place so every shared class follows.
 */
export function Room({ number, name, catalog, id, dark = false, children, className = '' }: RoomProps) {
  return (
    <section
      id={id}
      aria-label={name.replace(/_/g, ' ')}
      className={`relative overflow-hidden ${dark ? 'room-dark' : ''} ${className}`}
    >
      {children}
    </section>
  )
}

/** The door plate that heads every room. */
export function RoomDoor({
  number,
  name,
  catalog,
  align = 'start',
}: {
  number: string
  name: string
  catalog?: string
  align?: 'start' | 'center' | 'end'
}) {
  return (
    <Reveal
      className={`mb-14 flex ${align === 'center' ? 'justify-center text-center' : align === 'end' ? 'justify-end text-end' : ''}`}
    >
      <div data-rv className="max-w-2xl">
        <div className={`flex items-center gap-3 ${align === 'center' ? 'justify-center' : ''}`}>
          <span className="label-accent label">Room {number}</span>
          <span className="rule-accent w-10" aria-hidden="true" />
        </div>
        <h2 className="room-title mt-3">{name}</h2>
        {catalog && <p className="serif mt-3 text-lg leading-relaxed text-text-2">{catalog}</p>}
      </div>
    </Reveal>
  )
}