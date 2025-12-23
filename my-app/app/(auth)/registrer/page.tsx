import Link from "next/link";

export default function RegisterPage() {
  return (
    <div style={{ padding: "3rem" }}>
      <h1>Create an account</h1>
      <p>Self-service registration is not available yet. Contact an administrator to be added.</p>
      <Link href="/">Return to login</Link>
    </div>
  );
}
