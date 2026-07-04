import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const metadata = { title: "Admin Login", robots: { index: false } };

async function login(formData: FormData) {
  "use server";
  const expected = process.env.ADMIN_PASSCODE ?? "redlineadmin";
  if (String(formData.get("passcode")) === expected) {
    const jar = await cookies();
    jar.set("rc_admin", expected, { httpOnly: true, sameSite: "lax", maxAge: 604800, path: "/" });
    redirect("/admin");
  }
  redirect("/admin/login?error=1");
}

export default async function AdminLogin({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  return (
    <div className="mx-auto max-w-sm px-4 py-24">
      <h1 className="font-display text-3xl uppercase mb-6">Admin</h1>
      <form action={login} className="space-y-4">
        <input
          type="password"
          name="passcode"
          required
          placeholder="Passcode"
          className="w-full bg-panel border border-line rounded-xl px-4 py-3 text-sm outline-none focus:border-caliper"
        />
        {error && <p className="text-danger text-sm font-semibold">Wrong passcode.</p>}
        <button className="w-full bg-caliper hover:bg-caliper-dark text-night font-bold rounded-full py-3 transition-colors">
          Sign In
        </button>
        <p className="text-xs text-mist">
          Default: <code>redlineadmin</code> — change via <code>ADMIN_PASSCODE</code> in .env
        </p>
      </form>
    </div>
  );
}
