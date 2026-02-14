import { createServerFn } from '@tanstack/react-start'

interface ContactFormData {
  name: string
  email: string
  phone?: string
  service?: string
  eventLocation?: string
  message: string
}

async function sendContactEmail(data: ContactFormData): Promise<{ success: boolean; error?: string }> {
  const resendApiKey = process.env.RESEND_API_KEY
  const contactEmail = process.env.CONTACT_EMAIL || 'mccgpimamshamsan@gmail.com'

  if (!resendApiKey) {
    console.error('RESEND_API_KEY not configured')
    return { success: false, error: 'Email service not configured' }
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Imam Shamsan Website <onboarding@resend.dev>',
        to: contactEmail,
        subject: data.service
          ? `New Inquiry: ${data.service} - from ${data.name}`
          : `New Message from ${data.name}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${data.name}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          ${data.phone ? `<p><strong>Phone:</strong> ${data.phone}</p>` : ''}
          ${data.service ? `<p><strong>Service:</strong> ${data.service}</p>` : ''}
          ${data.eventLocation ? `<p><strong>Event Location:</strong> ${data.eventLocation}</p>` : ''}
          <p><strong>Message:</strong></p>
          <p>${data.message.replace(/\n/g, '<br>')}</p>
        `,
        reply_to: data.email,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('Resend API error:', error)
      return { success: false, error: 'Failed to send email' }
    }

    return { success: true }
  } catch (error) {
    console.error('Error sending email:', error)
    return { success: false, error: 'Failed to send email' }
  }
}

export const submitContactForm = createServerFn({
  method: 'POST',
}).handler(async (ctx) => {
  const data = (ctx as Record<string, unknown>).data as ContactFormData
  return sendContactEmail(data)
})
