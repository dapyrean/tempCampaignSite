import { BookingDialog } from '@/components/booking-dialog'
import { Collection } from '@/components/collection'
import Link from 'next/link'

export function StoreHome() {
  return (
    <main>
      <section className="hero">
        <div className="wrap hero-inner">
          <img className="hero-logo" src="/brand/rack-city-logo.jpg" width={240} height={314} alt="Rack City logo: a gold hanger shaped into a city skyline" />
          <p className="tagline">
            <span />
            Retail reimagined.
            <span />
          </p>
          <h1>
            Clothes cut
            <br />
            for the city
            <br />
            <em>after dark.</em>
          </h1>
          <p className="lede">Wool, cotton, and a few objects made to be kept. Shop the edit, or book the flagship.</p>
          <div className="hero-actions">
            <Link className="btn btn-gold" href="/shop">
              Shop the edit
            </Link>
            <BookingDialog />
          </div>
        </div>
      </section>

      <section className="strip" aria-label="House notes">
        <div className="wrap strip-inner">
          <span>SoHo, New York</span>
          <span>Complimentary US shipping</span>
          <span>Private edits by appointment</span>
          <span>Paid with Square</span>
        </div>
      </section>

      <section className="section wrap" id="shop">
        <div className="section-head">
          <div>
            <p className="kicker">01 — The edit</p>
            <h2>
              Designed to be <em>kept.</em>
            </h2>
          </div>
          <Link className="btn-text" href="/shop">
            View the full edit
          </Link>
        </div>
        <Collection limit={6} />
      </section>

      <section className="split" id="flagship">
        <div className="split-media" role="img" aria-label="A dark clothing floor with rails of black garments" />
        <div className="split-copy">
          <p className="kicker">02 — The flagship</p>
          <h2>
            Come for the clothes.
            <br />
            <em>Stay for the room.</em>
          </h2>
          <p>The SoHo floor is quiet on purpose. A stylist pulls the rail before you arrive. You try the line, not the entire store.</p>
          <BookingDialog label="Request a private hour" />
        </div>
      </section>

      <section className="section wrap">
        <div className="notes">
          <article className="note">
            <span>01</span>
            <h3>The line</h3>
            <p>Shoulders are squared. Hems clear the curb. Nothing in the edit is here to shout.</p>
          </article>
          <article className="note">
            <span>02</span>
            <h3>The cloth</h3>
            <p>Wool, washed cotton, silk crepe, and a gold edge only where the light can find it.</p>
          </article>
          <article className="note">
            <span>03</span>
            <h3>The payment</h3>
            <p>Checkout builds a Square order from this bag and charges the card through Square.</p>
          </article>
        </div>
      </section>

      <section className="journal">
        <div className="journal-copy">
          <p className="kicker">03 — After dark</p>
          <h2>
            The city changes
            <br />
            <em>temperature.</em>
          </h2>
          <p>Wool holds a line. Metal catches the streetlight. Cotton disappears under a coat. That is the whole idea.</p>
          <Link className="btn btn-gold" href="/shop">
            Enter the edit
          </Link>
        </div>
        <div className="journal-media" role="img" aria-label="Evening street style in the city" />
      </section>
    </main>
  )
}
