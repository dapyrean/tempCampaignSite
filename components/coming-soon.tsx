'use client'

import { useEffect, useRef, useState } from 'react'

export function ComingSoon() {
  const stageRef = useRef<HTMLElement>(null)
  const cursorRef = useRef<HTMLDivElement>(null)
  const [rack, setRack] = useState({ on: false, gold: false })

  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let hoverTimer = 0
    let goldTimer = 0
    let frame = 0
    let shine = 0.16
    let target = 0.16
    let pointerX = 0
    let pointerY = 0
    let hovering = false
    let timing = false
    let shown = false

    function paint() {
      frame = 0
      shine += (target - shine) * 0.12
      target += (0.16 - target) * 0.04
      stage?.style.setProperty('--shine', shine.toFixed(3))
      if (!reduce) {
        const dx = (pointerX - 0.5) * 16
        const dy = (pointerY - 0.5) * 12
        stage?.style.setProperty('--glow-x', `${dx}px`)
        stage?.style.setProperty('--glow-y', `${dy}px`)
        stage?.style.setProperty('--logo-x', `${dx * 0.35}px`)
        stage?.style.setProperty('--logo-y', `${dy * 0.35}px`)
      }
      if (Math.abs(target - shine) > 0.01 || target > 0.18) {
        frame = window.requestAnimationFrame(paint)
      }
    }

    function requestPaint() {
      if (!frame) frame = window.requestAnimationFrame(paint)
    }

    function placeReflection(event: PointerEvent) {
      stage?.querySelectorAll<HTMLElement>('.letter-glow').forEach((node) => {
        const rect = node.getBoundingClientRect()
        if (!rect.width || !rect.height) return
        const x = ((event.clientX - rect.left) / rect.width) * 100
        const y = ((event.clientY - rect.top) / rect.height) * 100
        node.style.setProperty('--spot-x', `${50 + (x - 50) * 1.45}%`)
        node.style.setProperty('--spot-y', `${50 + (y - 50) * 1.7}%`)
      })
    }

    function armRack() {
      if (shown) return
      shown = true
      window.clearTimeout(hoverTimer)
      window.clearTimeout(goldTimer)
      setRack((value) => ({ ...value, on: true, gold: false }))
      goldTimer = window.setTimeout(() => {
        setRack((value) => ({ ...value, gold: true }))
      }, 40)
    }

    function beginHover() {
      hovering = true
      if (timing || shown) return
      timing = true
      window.clearTimeout(hoverTimer)
      hoverTimer = window.setTimeout(() => {
        timing = false
        if (hovering) armRack()
      }, 15000)
    }

    function onEnter() {
      beginHover()
    }

    function onLeave() {
      hovering = false
      timing = false
      shown = false
      window.clearTimeout(hoverTimer)
      window.clearTimeout(goldTimer)
      setRack({ on: false, gold: false })
    }

    function onMove(event: PointerEvent) {
      const rect = stage?.getBoundingClientRect()
      if (rect?.width && rect.height) {
        pointerX = (event.clientX - rect.left) / rect.width
        pointerY = (event.clientY - rect.top) / rect.height
      }
      const moved = Math.hypot(event.movementX, event.movementY)
      if (moved > 0) target = Math.min(0.92, target + moved * 0.035)
      placeReflection(event)
      const overLogin = event.target instanceof Element && Boolean(event.target.closest('.soon-login'))
      stage?.classList.toggle('is-over-login', overLogin)
      const cursor = cursorRef.current
      if (cursor) {
        cursor.style.left = `${event.clientX}px`
        cursor.style.top = `${event.clientY}px`
      }
      beginHover()
      requestPaint()
    }

    stage.addEventListener('pointerenter', onEnter)
    stage.addEventListener('pointerleave', onLeave)
    stage.addEventListener('pointermove', onMove)
    return () => {
      window.clearTimeout(hoverTimer)
      window.clearTimeout(goldTimer)
      if (frame) window.cancelAnimationFrame(frame)
      stage.removeEventListener('pointerenter', onEnter)
      stage.removeEventListener('pointerleave', onLeave)
      stage.removeEventListener('pointermove', onMove)
    }
  }, [])

  const rackClass = `rack-cursor${rack.on ? ' is-on' : ''}${rack.gold ? ' is-gold' : ''}`

  return (
    <main className={`soon${rack.on ? ' is-rack' : ''}`} ref={stageRef}>
      <a className="soon-login" href="/admin">
        Login
      </a>
      <div className="soon-glow" aria-hidden="true" />
      <div className="soon-inner">
        <div className="soon-mark-wrap">
          <img className="soon-mark" src="/brand/rack-city-hero.png" width={919} height={652} alt="" />
        </div>
        <h1 className="soon-wordmark">
          <span className="letter-glow" data-text="Rack City">
            Rack City
          </span>
        </h1>
        <p className="soon-tagline">
          <span className="soon-rule" />
          <span className="letter-glow" data-text="Retail reimagined">
            Retail reimagined
          </span>
          <span className="soon-rule" />
        </p>
        <p className="soon-status">
          <span className="letter-glow" data-text="Coming soon">
            Coming soon
          </span>
        </p>
      </div>
      <div className={rackClass} ref={cursorRef} aria-hidden="true">
        <svg className="rack-cursor-svg" viewBox="0 0 64 52">
          <path d="M32 3.2a5.2 5.2 0 0 1 2.4 9.8l-.8 1.1 20.6 13.2c1.1.7 1.3 1.8.6 2.7-.6.8-1.6 1.1-2.6.6L33.2 18.4v18.8h-2.4V18.4L11.8 30.6c-1 .5-2 .2-2.6-.6-.7-.9-.5-2 .6-2.7L30.4 14.1l-.8-1.1A5.2 5.2 0 0 1 32 3.2zm0 3.1a2.1 2.1 0 1 0 0 4.2 2.1 2.1 0 0 0 0-4.2zM14.2 33.8h35.6c1.5 0 2.4 1.5 1.6 2.8L33.6 49.2c-.9 1.1-2.3 1.1-3.2 0L12.6 36.6c-.8-1.3.1-2.8 1.6-2.8z" />
        </svg>
      </div>
    </main>
  )
}
