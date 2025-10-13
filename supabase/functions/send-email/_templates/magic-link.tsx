import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text,
} from 'npm:@react-email/components@0.0.22'
import * as React from 'npm:react@18.3.1'

interface MagicLinkEmailProps {
  supabase_url: string
  email_action_type: string
  redirect_to: string
  token_hash: string
  token: string
}

export const MagicLinkEmail = ({
  token,
  supabase_url,
  email_action_type,
  redirect_to,
  token_hash,
}: MagicLinkEmailProps) => (
  <Html>
    <Head />
    <Preview>Confirm your email</Preview>
    <Body style={main as any}>
      <Container style={container as any}>
        <Heading style={h1 as any}>Confirm your email</Heading>
        <Link
          href={`${supabase_url}/auth/v1/verify?token=${token_hash}&type=${email_action_type}&redirect_to=${redirect_to}`}
          target="_blank"
          style={{
            ...link,
            display: 'block',
            marginBottom: '16px',
          } as any}
        >
          Click here to confirm your email
        </Link>
        <Text style={{ ...text, marginBottom: '14px' } as any}>
          Or, copy and paste this temporary code:
        </Text>
        <code style={code as any}>{token}</code>
        <Text
          style={{
            ...text,
            color: '#ababab',
            marginTop: '14px',
            marginBottom: '16px',
          } as any}
        >
          If you didn’t try to sign up, you can safely ignore this email.
        </Text>
        <Text style={footer as any}>FuelApp</Text>
      </Container>
    </Body>
  </Html>
)

export default MagicLinkEmail

const main = { backgroundColor: '#ffffff' }
const container = { paddingLeft: '12px', paddingRight: '12px', margin: '0 auto' }
const h1 = { color: '#333', fontSize: '24px', fontWeight: 'bold', margin: '40px 0', padding: '0' }
const link = { color: '#2754C5', fontSize: '14px', textDecoration: 'underline' }
const text = { color: '#333', fontSize: '14px', margin: '24px 0' }
const footer = { color: '#898989', fontSize: '12px', lineHeight: '22px', marginTop: '12px', marginBottom: '24px' }
const code = {
  display: 'inline-block',
  padding: '16px 4.5%',
  width: '90.5%',
  backgroundColor: '#f4f4f4',
  borderRadius: '5px',
  border: '1px solid #eee',
  color: '#333',
}