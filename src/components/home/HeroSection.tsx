import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import { Container } from '@/components/layout/Container'
import { Button } from '@/components/ui/button'
import { ArabicText } from '@/components/shared/ArabicText'

export function HeroSection() {
  return (
    <section className="bg-gradient-to-b from-accent/30 to-background py-16 md:py-24">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
            Imam Dr.{' '}
            <span className="text-primary">Shamsan Al-Jabi</span>
          </h1>
          <ArabicText
            as="p"
            className="mt-3 text-2xl text-secondary sm:text-3xl"
          >
            الدكتور. شمسان الجابي
          </ArabicText>
          <p className="mt-6 text-lg text-muted-foreground md:text-xl">
            Islamic Scholar, Educator & Community Leader. Dedicated to
            spreading authentic Islamic knowledge and serving the Muslim
            community.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link to="/about">
              <Button size="lg" className="gap-2">
                Learn More
                <ArrowRight className="size-4" />
              </Button>
            </Link>
            <Link to="/services">
              <Button size="lg" variant="outline" className="gap-2">
                Book a Service
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </section>
  )
}
