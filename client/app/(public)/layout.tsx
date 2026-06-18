import { PublicHeader } from "@/components/shared/header/PublicHeader"

export default function PublicLayout({
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