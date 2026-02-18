import { Navigation } from "./components/navigation"
import { HeroSection } from "./sections/hero"
import { CatalogSection } from "./sections/catalog"
import { DeliverySection } from "./sections/delivery"
import { AboutSection } from "./sections/about"
import { ContactsSection } from "./sections/contacts"

export default function Home() {
  return (
    <main>
      <Navigation />
      <HeroSection />
      <CatalogSection />
      <DeliverySection />
      <AboutSection />
      <ContactsSection />
    </main>
  )
}
