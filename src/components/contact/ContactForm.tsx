import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Send, Loader2, CheckCircle } from 'lucide-react'
import { submitContactForm } from '@/lib/email'
import type { Service } from '@/types/service'

interface ContactFormProps {
  services: Service[]
  preselectedService?: string
}

export function ContactForm({ services, preselectedService }: ContactFormProps) {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    phone: '',
    service: preselectedService || '',
    eventLocation: '',
    message: '',
  })
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    setErrorMessage('')

    try {
      const result = await submitContactForm({
        data: {
          name: formState.name,
          email: formState.email,
          phone: formState.phone || undefined,
          service: formState.service || undefined,
          eventLocation: formState.eventLocation || undefined,
          message: formState.message,
        },
      })

      if (result.success) {
        setStatus('sent')
        setFormState({
          name: '',
          email: '',
          phone: '',
          service: '',
          eventLocation: '',
          message: '',
        })
      } else {
        setStatus('error')
        setErrorMessage(result.error || 'Something went wrong')
      }
    } catch {
      setStatus('error')
      setErrorMessage('Failed to send message. Please try again.')
    }
  }

  if (status === 'sent') {
    return (
      <div className="rounded-xl bg-accent/50 p-8 text-center">
        <CheckCircle className="mx-auto size-12 text-primary" />
        <h3 className="mt-4 text-xl font-semibold text-foreground">
          Message Sent!
        </h3>
        <p className="mt-2 text-muted-foreground">
          Thank you for reaching out. Imam Shamsan will respond to your
          inquiry soon, insha'Allah.
        </p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => setStatus('idle')}
        >
          Send Another Message
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Name *</Label>
          <Input
            id="name"
            required
            value={formState.name}
            onChange={(e) =>
              setFormState((s) => ({ ...s, name: e.target.value }))
            }
            placeholder="Your full name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            required
            value={formState.email}
            onChange={(e) =>
              setFormState((s) => ({ ...s, email: e.target.value }))
            }
            placeholder="your@email.com"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            type="tel"
            value={formState.phone}
            onChange={(e) =>
              setFormState((s) => ({ ...s, phone: e.target.value }))
            }
            placeholder="(555) 123-4567"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="service">Service</Label>
          <Select
            id="service"
            value={formState.service}
            onChange={(e) =>
              setFormState((s) => ({ ...s, service: e.target.value }))
            }
          >
            <option value="">Select a service...</option>
            {services.map((s) => (
              <option key={s.id} value={s.nameEn}>
                {s.nameEn}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="eventLocation">Event Location</Label>
        <Input
          id="eventLocation"
          value={formState.eventLocation}
          onChange={(e) =>
            setFormState((s) => ({ ...s, eventLocation: e.target.value }))
          }
          placeholder="Address or venue name (if applicable)"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Message *</Label>
        <Textarea
          id="message"
          required
          value={formState.message}
          onChange={(e) =>
            setFormState((s) => ({ ...s, message: e.target.value }))
          }
          placeholder="How can Imam Shamsan help you?"
          rows={5}
        />
      </div>

      {status === 'error' && (
        <p className="text-sm text-destructive">{errorMessage}</p>
      )}

      <Button
        type="submit"
        size="lg"
        disabled={status === 'sending'}
        className="w-full gap-2"
      >
        {status === 'sending' ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Sending...
          </>
        ) : (
          <>
            <Send className="size-4" />
            Send Message
          </>
        )}
      </Button>
    </form>
  )
}
