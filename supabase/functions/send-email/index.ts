import { Webhook } from 'https://esm.sh/standardwebhooks@1.0.0'

const resendApiKey = Deno.env.get('RESEND_API_KEY') as string
const hookSecret = Deno.env.get('SEND_EMAIL_HOOK_SECRET') as string

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return new Response('not allowed', { status: 400 })
  }

  try {
    const payload = await req.text()
    const headers = Object.fromEntries(req.headers)

    const wh = new Webhook(hookSecret)
    const {
      user,
      email_data: { token, token_hash, redirect_to, email_action_type },
    } = wh.verify(payload, headers) as {
      user: { email: string }
      email_data: {
        token: string
        token_hash: string
        redirect_to: string
        email_action_type: string
      }
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const confirmLink = `${supabaseUrl}/auth/v1/verify?token=${token_hash}&type=${email_action_type}&redirect_to=${redirect_to}`

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #ffffff; padding: 40px 0;">
          <div style="max-width: 600px; margin: 0 auto; padding: 0 12px;">
            <h1 style="color: #333; font-size: 24px; font-weight: bold; margin: 40px 0;">Confirm your email</h1>
            <p style="color: #333; font-size: 14px; margin: 24px 0;">
              Click the link below to confirm your email address:
            </p>
            <a href="${confirmLink}" 
               style="display: inline-block; background-color: #2754C5; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 5px; font-size: 14px; margin: 16px 0;">
              Confirm Email
            </a>
            <p style="color: #333; font-size: 14px; margin: 24px 0;">
              Or copy and paste this code: <code style="background-color: #f4f4f4; padding: 4px 8px; border-radius: 3px;">${token}</code>
            </p>
            <p style="color: #ababab; font-size: 14px; margin: 24px 0;">
              If you didn't try to sign up, you can safely ignore this email.
            </p>
            <p style="color: #898989; font-size: 12px; margin-top: 40px;">
              FuelApp
            </p>
          </div>
        </body>
      </html>
    `

    // Send email using Resend API
    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'FuelApp <onboarding@resend.dev>',
        to: [user.email],
        subject: 'Confirm your email',
        html,
      }),
    })

    const emailData = await emailResponse.json()

    if (!emailResponse.ok) {
      console.error('Resend API error:', emailData)
      throw new Error(emailData.message || 'Failed to send email')
    }

    console.log(`Email sent successfully to ${user.email}`)

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    })
  } catch (error: any) {
    console.error('Error in send-email function:', error)
    return new Response(
      JSON.stringify({ error: { message: error.message } }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    )
  }
})