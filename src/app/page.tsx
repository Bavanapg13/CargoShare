import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function Home() {
  return (
    <div className="flex-1 overflow-y-auto">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background pt-24 pb-32">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-5" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-8">
              <span>🚀 Revolutionizing Shared Logistics</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8">
              Find & Book <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Shared Container Space</span> Instantly.
            </h1>
            
            <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
              Exporters can discover partially filled cargo containers nearby, split costs, and reduce carbon footprint. LSPs can maximize container utilization and increase revenue.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Link href="/signup" className="w-full sm:w-auto">
                <Button size="lg" className="w-full text-lg h-14 px-8">
                  Register as Trader
                </Button>
              </Link>
              <Link href="/lsp-apply" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full text-lg h-14 px-8 border-2">
                  Apply as LSP
                </Button>
              </Link>
            </div>
            
            <div className="mt-12 flex items-center justify-center space-x-8 text-sm font-medium text-muted-foreground">
              <div className="flex items-center"><span className="mr-2">✓</span> No hidden fees</div>
              <div className="flex items-center"><span className="mr-2">✓</span> Real-time tracking</div>
              <div className="flex items-center"><span className="mr-2">✓</span> Verified LSPs</div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">How CargoShare Works</h2>
            <p className="mt-4 text-lg text-muted-foreground">Seamless end-to-end booking for part-load shipments.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="p-6 rounded-2xl bg-card border border-border text-center shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">🔍</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">1. Search & Discover</h3>
              <p className="text-muted-foreground">Find partially filled containers traveling to your destination on your desired date.</p>
            </div>
            
            <div className="p-6 rounded-2xl bg-card border border-border text-center shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">💬</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">2. Chat & Negotiate</h3>
              <p className="text-muted-foreground">Communicate directly with verified Logistics Service Providers to finalize details.</p>
            </div>
            
            <div className="p-6 rounded-2xl bg-card border border-border text-center shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">3. Book & Pay</h3>
              <p className="text-muted-foreground">Secure your space instantly with online payment and automated invoicing.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
