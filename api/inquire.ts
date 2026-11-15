// POST /api/inquire: the inquiry form's backend, a Vercel Function.
//
// The site is a static Astro build; this file sits beside it in Vercel's
// zero-config `api/` directory and becomes a Node function at /api/inquire.
// It validates the submission, drops obvious bots, and emails the host via
// Resend. The destination address lives ONLY in Vercel's environment
// (INQUIRY_TO), never in the repo or the HTML, so it cannot be scraped.
//
// Environment (Vercel project settings):
//   RESEND_API_KEY   Resend API key
//   INQUIRY_TO       where inquiries go (Brian's inbox)
//   INQUIRY_FROM     optional sender, e.g. "Hi Tides <inquiries@hitides.ca>"
//                    (the domain must be verified in Resend); defaults to
//                    Resend's onboarding sender, which only delivers to the
//                    Resend account's own address.
//
// Responses: JSON for fetch() callers; a redirect back to the form for a
// plain HTML submit (JS off). Bots get a cheerful 200 and nothing is sent.

export const config = { runtime: 'nodejs' };

const MAX = { name: 120, email: 200, message: 4000, guests: 4 } as const;
const MIN_FILL_MS = 2500; // humans do not fill five fields in two seconds

type Fields = Record<string, string>;

function wantsJson(req: Request): boolean {
  const accept = req.headers.get('accept') ?? '';
  const type = req.headers.get('content-type') ?? '';
  return accept.includes('application/json') || type.includes('application/json');
}

async function readFields(req: Request): Promise<Fields> {
  const type = req.headers.get('content-type') ?? '';
  if (type.includes('application/json')) {
    const data = (await req.json()) as Record<string, unknown>;
    return Object.fromEntries(
      Object.entries(data).map(([k, v]) => [k, typeof v === 'string' ? v : String(v ?? '')]),
    );
  }
  const text = await req.text();
  return Object.fromEntries(new URLSearchParams(text).entries());
}

function clean(value: string | undefined, max: number): string {
  return (value ?? '').replace(/\r/g, '').trim().slice(0, max);
}

function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length <= MAX.email;
}

function respond(req: Request, ok: boolean, status: number, error?: string): Response {
  if (wantsJson(req)) {
    return new Response(JSON.stringify(ok ? { ok } : { ok, error }), {
      status,
      headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
    });
  }
  // No-JS fallback: back to the form, which shows the matching panel.
  const where = ok ? '/?sent=1#inquire' : `/?sent=0#inquire`;
  return new Response(null, { status: 303, headers: { location: where, 'cache-control': 'no-store' } });
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405, headers: { allow: 'POST' } });
  }

  let fields: Fields;
  try {
    fields = await readFields(req);
  } catch {
    return respond(req, false, 400, 'bad request');
  }

  // Bot checks: the honeypot must stay empty and the form must have been on
  // screen for a moment. Bots get a success so they move on.
  const honeypot = clean(fields.company, 50);
  const started = Number(fields.started ?? 0);
  if (honeypot || (started > 0 && Date.now() - started < MIN_FILL_MS)) {
    return respond(req, true, 200);
  }

  const name = clean(fields.name, MAX.name);
  const email = clean(fields.email, MAX.email);
  const arrival = clean(fields.arrival, 20);
  const departure = clean(fields.departure, 20);
  const guests = clean(fields.guests, 2);
  const message = clean(fields.message, MAX.message);

  if (!name || !isEmail(email)) {
    return respond(req, false, 400, 'name and a valid email are required');
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.INQUIRY_TO;
  if (!apiKey || !to) {
    console.error('inquire: RESEND_API_KEY / INQUIRY_TO not configured');
    return respond(req, false, 503, 'not configured');
  }
  const from = process.env.INQUIRY_FROM || 'Hi Tides <onboarding@resend.dev>';

  const dates = arrival || departure ? `${arrival || '?'} to ${departure || '?'}` : 'dates not given';
  const subject = `Hi Tides inquiry from ${name} (${dates})`;
  const lines = [
    `Name: ${name}`,
    `Email: ${email}`,
    `Arrival: ${arrival || '-'}`,
    `Departure: ${departure || '-'}`,
    `Guests: ${guests || '-'}`,
    '',
    message || '(no message)',
    '',
    `Sent from the inquiry form on hitides.ca. Reply to this email to answer ${name}.`,
  ];

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { authorization: `Bearer ${apiKey}`, 'content-type': 'application/json' },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: email,
      subject,
      text: lines.join('\n'),
    }),
  });

  if (!res.ok) {
    console.error('inquire: resend failed', res.status, await res.text().catch(() => ''));
    return respond(req, false, 502, 'email failed');
  }
  return respond(req, true, 200);
}
