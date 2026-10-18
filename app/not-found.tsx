import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="page">
      <div className="wrap empty">
        <p className="kicker">404</p>
        <h1>This piece is not on the rail.</h1>
        <Link className="btn btn-gold" href="/shop">
          Back to the edit
        </Link>
      </div>
    </main>
  )
}
