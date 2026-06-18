import { PublicHeader } from "@/components/shared/header/PublicHeader"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <PublicHeader />
      <main>{children}</main>
    </>
  )
}