import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const password = searchParams.get("password");

  if (!password) {
    return NextResponse.json({ error: "Password is required" }, { status: 400 });
  }

  const sha1 = crypto.createHash("sha1").update(password).digest("hex").toUpperCase();
  const prefix = sha1.slice(0, 5);
  const suffix = sha1.slice(5);

  try {
    const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
    const text = await response.text();

    const lines = text.split('\n');
    const found = lines.find(line => line.startsWith(suffix));

    if (found) {
      const count = parseInt(found.split(':')[1]);
      return NextResponse.json({ breached: true, count });
    } else {
      return NextResponse.json({ breached: false });
    }
  } catch {
    return NextResponse.json({ error: "Failed to check password" }, { status: 500 });
  }
}
