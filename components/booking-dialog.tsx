'use client'

import { CalendarDays, X } from 'lucide-react'
import { useEffect, useState } from 'react'

export function BookingDialog({ label = 'Book a private edit' }: { label?: string }) {
  const [open, setOpen] = useState(false)
  const [sent, setSent] = useState<{ date: string; time: string; name: string } | null>(null)

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    setSent({
      name: String(data.get('name') || 'Guest'),
      date: String(data.get('date') || ''),
      time: String(data.get('time') || ''),
    })
  }

  return (
    <>
      <button className="btn btn-line btn-light" type="button" onClick={() => setOpen(true)}>
        <CalendarDays />
        {label}
      </button>
      {open ? (
        <div className="dialog-backdrop" role="presentation" onClick={() => setOpen(false)}>
          <section className="dialog" role="dialog" aria-modal="true" aria-labelledby="booking-title" onClick={(event) => event.stopPropagation()}>
            <button className="icon-button" type="button" aria-label="Close" onClick={() => setOpen(false)}>
              <X />
            </button>
            <p className="kicker">Flagship / SoHo</p>
            <h2 id="booking-title">A private hour with the edit.</h2>
            {sent ? (
              <div className="confirm-copy">
                <p>
                  {sent.name}, you are noted for {sent.date || 'the requested day'} at {sent.time}. Bring this confirmation to the door. Private edits are held on the floor, not in an inbox.
                </p>
                <button className="btn btn-gold" type="button" onClick={() => setOpen(false)}>
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={submit}>
                <p>Tell us when you would like the room. A stylist pulls the rail before you arrive.</p>
                <label className="field">
                  Name
                  <input name="name" required autoComplete="name" />
                </label>
                <div className="form-grid">
                  <label className="field">
                    Date
                    <input name="date" type="date" required />
                  </label>
                  <label className="field">
                    Time
                    <select name="time" required defaultValue="16:00">
                      <option value="10:00">10:00</option>
                      <option value="13:30">13:30</option>
                      <option value="16:00">16:00</option>
                      <option value="18:30">18:30</option>
                    </select>
                  </label>
                </div>
                <button className="btn btn-gold" type="submit">
                  Request the hour
                </button>
              </form>
            )}
          </section>
        </div>
      ) : null}
    </>
  )
}
